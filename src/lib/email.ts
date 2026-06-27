const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app';
const BRAND_COLOR = "#4f46e5";
const BREVO_API_KEY = process.env.BREVO_API_KEY;

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

// -- Brevo Send Helper
async function sendBrevoEmail({ to, subject, htmlContent, attachment }: { to: { email: string, name: string }[], subject: string, htmlContent: string, attachment?: any[] }) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is missing, returning mock success.");
    return { success: true, mock: true };
  }

  try {
    const payload: any = {
      sender: { name: "InterNexa", email: "support@internexa.in" },
      to,
      subject,
      htmlContent,
    };

    if (attachment && attachment.length > 0) {
      payload.attachment = attachment;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY.replace(/\s+/g, ''),
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      return { success: false, error: errorData };
    }

    return { success: true };
  } catch (error) {
    console.error("Brevo Network/Fetch Error:", error);
    return { success: false };
  }
}

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

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `Application Received: ${internshipName} - ${referenceNumber}`,
    htmlContent: getBaseTemplate("Application Received", content)
  });
}

// -- 2. Offer Letter Generated
interface OfferEmailProps {
  studentName: string;
  email: string;
  internshipName: string;
  offerLetterId: string;
  pdfUrl?: string;
}

export async function sendOfferLetterEmail({
  studentName, email, internshipName, offerLetterId, pdfUrl
}: OfferEmailProps) {
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

  let attachment = [];
  if (pdfUrl) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/offer-letters/${pdfUrl}`;
      attachment.push({
        url: publicUrl,
        name: `Offer_Letter_${internshipName.replace(/\s+/g, '_')}.pdf`
      });
    }
  }

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `🎉 Congratulations! Offer Letter for ${internshipName}`,
    htmlContent: getBaseTemplate("Offer Letter Issued", content),
    attachment
  });
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

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `Payment Successful: Welcome to ${internshipName}`,
    htmlContent: getBaseTemplate("Payment Successful", content)
  });
}
