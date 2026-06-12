"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const groupSizeValue = formData.get("groupSize") as string;
  const message = formData.get("message") as string;
  const safariSlug = formData.get("safariSlug") as string;
  const groupSize = Number(groupSizeValue);

  if (!firstName || !lastName || !email || !phone || !groupSize || !message || !safariSlug) {
    throw new Error("Missing required fields");
  }

  // Save to database
  const inquiry = await prisma.inquiry.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      groupSize,
      message,
      safariSlug,
    },
  });

  // Send email via Brevo API
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const adminEmail = process.env.ADMIN_EMAIL;
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey || !adminEmail) {
    console.warn("Email configuration missing: BREVO_API_KEY or ADMIN_EMAIL not set. Email will not be sent.");
  } else {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: {
            email: process.env.SENDER_EMAIL || "noreply@glocalrwandasafaris.com",
            name: "Glocal Rwanda Safaris",
          },
          to: [
            {
              email: email,
            },
          ],
          bcc: [
            {
              email: adminEmail,
            },
          ],
          subject: `Thank you for your inquiry about ${safariSlug}`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1F382B 0%, #2d4a3d 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .logo { color: #E0B060; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .safari-name { color: #1F382B; font-size: 22px; font-weight: bold; margin-bottom: 20px; }
                .details { background: white; padding: 20px; border-left: 4px solid #1F382B; margin: 20px 0; }
                .message-box { background: white; padding: 20px; border-left: 4px solid #E0B060; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                .btn { display: inline-block; background: #E0B060; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">🦁 Glocal Rwanda Safaris</div>
                  <p style="color: white; margin: 0;">Premium Safari Experiences</p>
                </div>
                <div class="content">
                  <h2 style="color: #1F382B; margin-top: 0;">Thank You for Your Inquiry!</h2>
                  <p>We have received your inquiry about our safari experience. Our team will review your message and get back to you within 24 hours.</p>
                  
                  <div class="safari-name">Safari: ${safariSlug}</div>
                  
                  <div class="details">
                    <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>
                    <p style="margin: 0;"><strong>Group Size:</strong> ${groupSize}</p>
                  </div>
                  
                  <div class="message-box">
                    <p style="margin: 0; color: #666;"><strong>Your Message:</strong></p>
                    <p style="margin: 10px 0 0 0;">${message}</p>
                  </div>
                  
                  <p>In the meantime, feel free to explore more of our safari experiences on our website.</p>
                  
                  <a href="${siteUrl}/safaris" class="btn">View All Safaris</a>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Glocal Rwanda Safaris. All rights reserved.</p>
                  <p>This is an automated message. Please do not reply to this email.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to send email:", errorText);
      }
    } catch (error) {
      console.error("Email error:", error);
    }
  }

  // Revalidate admin path
  revalidatePath("/admin");

  return inquiry;
}
