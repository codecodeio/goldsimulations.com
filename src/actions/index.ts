import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { SITE_URL } from "astro:env/server";

import {
  sendAlreadySubscribedEmail,
  sendConfirmationEmail,
} from "@/lib/sendConfirmationEmail";
import { supabase } from "@/lib/supabase";

const emailSchema = z.object({ email: z.email() });

interface SubscriberRow {
  email: string;
  confirmation_token: string;
  confirmed_at: string | null;
}

// Look up by email. Returns null if not found. Surfaces unexpected DB errors.
async function findSubscriberByEmail(email: string): Promise<SubscriberRow | null> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, confirmation_token, confirmed_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("supabase.newsletter_subscribers select error:", error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We couldn't process your subscription. Please try again shortly.",
    });
  }

  return data;
}

// Insert a brand-new row. Returns the newly generated confirmation_token.
async function insertSubscriber(email: string): Promise<string> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
    .select("confirmation_token")
    .single();

  if (error || !data) {
    console.error("supabase.newsletter_subscribers insert error:", error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We couldn't create your subscription. Please try again shortly.",
    });
  }

  return data.confirmation_token;
}

// Rotate the confirmation token for a pending subscriber (invalidates any
// previously sent link). Returns the new token.
async function rotateConfirmationToken(email: string): Promise<string> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmation_token: crypto.randomUUID(), updated_at: new Date().toISOString() })
    .eq("email", email)
    .select("confirmation_token")
    .single();

  if (error || !data) {
    console.error("supabase.newsletter_subscribers update error:", error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We couldn't refresh your confirmation link. Please try again shortly.",
    });
  }

  return data.confirmation_token;
}

async function sendOrThrow(email: string, token: string) {
  const confirmationUrl = `${SITE_URL}/confirm-subscription?token=${token}`;
  const { error } = await sendConfirmationEmail({ email, confirmationUrl });

  if (error) {
    console.error("resend.emails.send error:", error);
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We couldn't send your confirmation email. Please try again shortly.",
    });
  }
}

// Tell an existing subscriber, by email, that they are already on the list.
// A failure here is logged but not surfaced: the caller must return the same
// response as the confirmation path, or the difference would reveal whether the
// address is subscribed.
async function notifyAlreadySubscribed(email: string) {
  const { error } = await sendAlreadySubscribedEmail({ email });
  if (error) {
    console.error("resend already-subscribed send error:", error);
  }
}

export const server = {
  subscribe: defineAction({
    accept: "form",
    input: emailSchema,
    handler: async ({ email }) => {
      const normalized = email.trim().toLowerCase();
      const existing = await findSubscriberByEmail(normalized);

      // Anti-enumeration: the response is identical whether or not the address
      // is already subscribed. A confirmed subscriber gets an "already on the
      // list" email rather than nothing, so the page's "we sent you an email"
      // is true in both cases and only the address owner learns which.
      if (existing?.confirmed_at) {
        await notifyAlreadySubscribed(normalized);
        return { status: "pending" as const };
      }

      const token = existing
        ? await rotateConfirmationToken(normalized)
        : await insertSubscriber(normalized);

      await sendOrThrow(normalized, token);

      return { status: "pending" as const };
    },
  }),

  resendConfirmation: defineAction({
    accept: "form",
    input: emailSchema,
    handler: async ({ email }) => {
      const normalized = email.trim().toLowerCase();
      const existing = await findSubscriberByEmail(normalized);

      // Already confirmed: send the "already on the list" note so the response
      // stays identical to the resend path without the UI claiming something
      // untrue. No row at all means we have no consent to mail the address, so
      // that case stays a silent no-op - it is unreachable from the UI anyway,
      // since the resend control only appears after a successful subscribe.
      if (existing?.confirmed_at) {
        await notifyAlreadySubscribed(normalized);
        return { status: "sent" as const };
      }
      if (!existing) {
        return { status: "sent" as const };
      }

      const token = await rotateConfirmationToken(normalized);
      await sendOrThrow(normalized, token);

      return { status: "sent" as const };
    },
  }),
};
