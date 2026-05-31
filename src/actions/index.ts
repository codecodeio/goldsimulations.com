import { ActionError, defineAction } from "astro:actions";
import { SITE_URL } from "astro:env/server";
import { z } from "astro:schema";

import { sendConfirmationEmail } from "@/lib/sendConfirmationEmail";
import { supabase } from "@/lib/supabase";

const emailSchema = z.object({ email: z.string().email() });

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

export const server = {
  subscribe: defineAction({
    accept: "form",
    input: emailSchema,
    handler: async ({ email }) => {
      const normalized = email.trim().toLowerCase();
      const existing = await findSubscriberByEmail(normalized);

      // Anti-enumeration: never reveal that an email is already on the list.
      // For a confirmed subscriber, succeed silently with no email sent.
      if (existing?.confirmed_at) {
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

      // No row, or already confirmed: succeed silently. Never disclose state.
      if (!existing || existing.confirmed_at) {
        return { status: "sent" as const };
      }

      const token = await rotateConfirmationToken(normalized);
      await sendOrThrow(normalized, token);

      return { status: "sent" as const };
    },
  }),
};
