import { Resend } from "resend";

const getResendClient = () => {
  try {
    const apiKey = (process.env.RESEND_API_KEY || "re_mock_key").replace(/\s+/g, '');
    return new Resend(apiKey);
  } catch (e) {
    console.error("Failed to initialize Resend:", e);
    return null;
  }
};
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app';
const BRAND_COLOR = "#4f46e5";

// -- Shared Base Template
const getBaseTemplate = (title: string, content: string) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: ${BRAND_COLOR}; margin: 0; font-size: 28px; font-weight: 800;">InterNexa</h1>
    </div>
    <h2 style="color: #1e293b; text-align: center; font-size: 22px;">${title}</h2>
    
    <div style="color: #334155; line-height: 1.6; font-size: 16px;">
      ${content}
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Need help? Contact us at <a href="mailto:support@internexa.in" style="color: ${BRAND_COLOR}; text-decoration: none;">support@internexa.in</a></p>
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} InterNexa. All rights reserved.</p>
    </div>
  </div>
`;

// -- 1. Application Submitted
interface ApplicationEmailProps {
  studentName: string;
  email: string;
  internshipName: string;
  referenceNumber: string;
  applicationId: string;
}

export async function sendApplicationReceivedEmail({
  studentName, email, internshipName, referenceNumber, applicationId
}: ApplicationEmailProps) {
  if (!process.env.RESEND_API_KEY) return { success: true, mock: true };

  const content = `
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your application for the <strong>${internshipName}</strong> program has been successfully received.</p>
    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a;">Application Details</h4>
      <p style="margin: 4px 0;"><strong>Application ID:</strong> ${applicationId}</p>
      <p style="margin: 4px 0;"><strong>Reference No:</strong> ${referenceNumber}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> Under Review</p>
    </div>
    <p>Our team will review your profile shortly. You will be notified once a decision is made.</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${APP_URL}/dashboard" style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Track Status</a>
    </div>
  `;

  try {
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: "InterNexa <support@internexa.in>",
        to: email,
        subject: `Application Received: ${internshipName} - ${referenceNumber}`,
        html: getBaseTemplate("Application Received", content),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false };
  }
}

// -- 2. Offer Letter Generated
interface OfferEmailProps {
  studentName: string;
  email: string;
  internshipName: string;
  offerLetterId: string;
  pdfUrl?: string; // We can attach a URL to download
}

export async function sendOfferLetterEmail({
  studentName, email, internshipName, offerLetterId, pdfUrl
}: OfferEmailProps) {
  if (!process.env.RESEND_API_KEY) return { success: true, mock: true };

  const content = `
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Congratulations! We are thrilled to offer you a position in the <strong>${internshipName}</strong> program.</p>
    <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #bbf7d0;">
      <h4 style="margin: 0 0 12px 0; color: #166534;">Offer Details</h4>
      <p style="margin: 4px 0; color: #166534;"><strong>Offer ID:</strong> ${offerLetterId}</p>
      <p style="margin: 4px 0; color: #166534;"><strong>Status:</strong> Action Required</p>
    </div>
    <p>Your official Offer Letter has been generated. Please review it and accept the offer to secure your seat. Note that offers expire in <strong>72 hours</strong>.</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${APP_URL}/dashboard" style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View & Accept Offer</a>
    </div>
  `;

  try {
    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: "InterNexa <support@internexa.in>",
        to: email,
        subject: `🎉 Congratulations! Offer Letter for ${internshipName}`,
        html: getBaseTemplate("Offer Letter Issued", content),
        attachments: [
          {
            filename: `Offer_Letter_${internshipName.replace(/\s+/g, '_')}.pdf`,
            path: pdfUrl,
          }
        ]
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false };
  }
}

// -- 3. Payment Successful
interface PaymentEmailProps {
  studentName: string;
  email: string;
  internshipName: string;
  transactionId: string;
  amount: number;
}

export async function sendPaymentSuccessEmail({
  studentName, email, internshipName, transactionId, amount
}: PaymentEmailProps) {
  if (!process.env.RESEND_API_KEY) return { success: true, mock: true };

  const content = `
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your payment of <strong>₹${amount}</strong> for the <strong>${internshipName}</strong> program was successful!</p>
    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a;">Transaction Details</h4>
      <p style="margin: 4px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> Paid</p>
    </div>
    <p>Your internship dashboard is now unlocked. You can access your curriculum and begin immediately.</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${APP_URL}/dashboard" style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Start Learning</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "InterNexa <support@internexa.in>",
      to: email,
      subject: `Payment Successful: Welcome to ${internshipName}`,
      html: getBaseTemplate("Payment Successful", content),
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false };
  }
}
