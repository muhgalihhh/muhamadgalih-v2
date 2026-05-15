"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const TO_EMAIL = "galihslank79@gmail.com";

export async function sendContactMessage(formData: FormData) {
  const name    = (formData.get("name")    as string)?.trim();
  const email   = (formData.get("email")   as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required." };
  }

  // 1. Save to DB
  const supabase = await createClient();
  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (dbError) return { error: "Failed to send message. Please try again." };

  // 2. Send email notification (best-effort — never block the success response)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to:   TO_EMAIL,
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="margin-bottom:4px">New message from your portfolio ✦</h2>
            <p style="color:#666;margin-top:0;font-size:13px">
              Received via muhamadgalih.com contact form
            </p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr>
                <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:90px;border-radius:4px 0 0 4px">Name</td>
                <td style="padding:8px 12px;border:1px solid #eee">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Email</td>
                <td style="padding:8px 12px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f5f5f5;font-weight:600">Subject</td>
                <td style="padding:8px 12px;border:1px solid #eee">${subject}</td>
              </tr>
            </table>
            <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.6">
              ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </div>
            <p style="margin-top:20px">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
                 style="background:#1a1a2e;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600">
                Reply to ${name} ↗
              </a>
            </p>
          </div>
        `,
      });
    } catch {
      // Email failure doesn't affect the user — message is already saved in DB
    }
  }

  return { ok: true };
}
