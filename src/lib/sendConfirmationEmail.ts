import { RESEND_API_KEY, SEND_TRANSACTIONAL_FROM } from "astro:env/server";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

// Replies go to the monitored Workspace group, not the sending subdomain -
// nobody reads mail addressed to hello@mail.goldsimulations.com.
const REPLY_TO = "contact@goldsimulations.com";

interface SendConfirmationEmailArgs {
  email: string;
  confirmationUrl: string;
}

export async function sendConfirmationEmail({
  email,
  confirmationUrl,
}: SendConfirmationEmailArgs) {
  const subject = "Confirm your subscription to Gold Simulations";

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f6f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f1;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e6e3da;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#1a1a1a;">Confirm your subscription</h1>
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#3a3a3a;">
                  Thanks for signing up for the Gold Simulations newsletter. Click the button below to confirm your email address and finish subscribing.
                </p>
                <p style="margin:32px 0;text-align:center;">
                  <a href="${confirmationUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:16px;">Confirm subscription</a>
                </p>
                <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#6a6a6a;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;color:#6a6a6a;word-break:break-all;">
                  <a href="${confirmationUrl}" style="color:#6a6a6a;">${confirmationUrl}</a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a8a;">
                  If you didn't sign up for this newsletter, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Confirm your subscription to Gold Simulations

Thanks for signing up for the Gold Simulations newsletter. Open the link below to confirm your email address and finish subscribing:

${confirmationUrl}

If you didn't sign up, you can safely ignore this email.`;

  return resend.emails.send({
    from: SEND_TRANSACTIONAL_FROM,
    replyTo: REPLY_TO,
    to: email,
    subject,
    html,
    text,
  });
}

// Sent when someone signs up with an address that is already confirmed.
//
// The subscribe page deliberately shows the same message whichever branch runs,
// so the page never reveals whether an address is on the list. Sending this
// instead of nothing keeps that protection while making the on-page copy true -
// an email really was sent - and puts the actual answer in front of the one
// person entitled to it: whoever owns the address.
export async function sendAlreadySubscribedEmail({ email }: { email: string }) {
  const subject = "You're already subscribed to Gold Simulations";

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f6f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f1;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e6e3da;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#1a1a1a;">You're already on the list</h1>
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#3a3a3a;">
                  Someone just signed up for the Gold Simulations newsletter using this address, but it's already subscribed. There's nothing you need to do - you'll keep receiving updates as normal.
                </p>
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#3a3a3a;">
                  If that wasn't you, you can safely ignore this email. Nobody was told whether this address is subscribed.
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#8a8a8a;">
                  Want to stop receiving these? Reply to this email and we'll take you off the list.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `You're already on the list

Someone just signed up for the Gold Simulations newsletter using this address, but it's already subscribed. There's nothing you need to do - you'll keep receiving updates as normal.

If that wasn't you, you can safely ignore this email. Nobody was told whether this address is subscribed.

Want to stop receiving these? Reply to this email and we'll take you off the list.`;

  return resend.emails.send({
    from: SEND_TRANSACTIONAL_FROM,
    replyTo: REPLY_TO,
    to: email,
    subject,
    html,
    text,
  });
}
