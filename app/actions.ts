"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type QuoteResult = { success: true } | { success: false; error: string };

export async function sendQuoteRequest(formData: FormData): Promise<QuoteResult> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  if (!name || !phone) {
    return { success: false, error: "Name and phone are required." };
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) {
    return { success: false, error: "Contact email is not configured." };
  }

  try {
    await resend.emails.send({
      from: `Angel Mechanic Expert <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: contactEmail,
      subject: `New Quote Request: ${service || "General Inquiry"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a1a; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #e65100; margin: 0; font-size: 22px;">New Quote Request</h1>
          </div>
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px; color: #1a1a1a;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a1a1a;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a1a1a;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">${email || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a1a1a;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">${service || "Not specified"}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #1a1a1a; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #374151;">${message}</td>
              </tr>` : ""}
            </table>
          </div>
          <div style="background: #1a1a1a; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 13px;">Angel Mechanic Expert LLC &mdash; Orlando, FL</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
