const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app';
const BRAND_COLOR = "#4f46e5";
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// -- Brevo Send Helper
export async function sendBrevoEmail({ to, subject, htmlContent, attachment }: { to: { email: string, name: string }[], subject: string, htmlContent: string, attachment?: any[] }) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is missing, returning mock success.");
    return { success: true, mock: true };
  }

  try {
    const payload: any = {
      sender: { name: "InterNexa", email: "info.internexa@gmail.com" },
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
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  
  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 40px;text-align:center;">
    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">InterNexa</h1>
    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Bridge the Gap Between Learning and Leading</p>
  </td></tr>
  
  <!-- Body -->
  <tr><td style="padding:40px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background-color:#eef2ff;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;">📄</div>
    </div>
    <h2 style="color:#0f172a;text-align:center;font-size:22px;margin:0 0 8px;">Application Received!</h2>
    <p style="color:#64748b;text-align:center;font-size:14px;margin:0 0 28px;">We've received your application and it's under review.</p>
    
    <p style="color:#334155;font-size:16px;line-height:1.7;">Dear <strong>${studentName}</strong>,</p>
    <p style="color:#334155;font-size:16px;line-height:1.7;">Thank you for applying to the <strong>${internshipName}</strong> program at InterNexa. Our team is reviewing your profile and qualifications.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;margin:24px 0;border:1px solid #e2e8f0;">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 12px;font-weight:700;color:#0f172a;font-size:15px;">📋 Application Details</p>
        <table width="100%" cellpadding="4" cellspacing="0">
          <tr><td style="color:#64748b;font-size:14px;width:140px;">Application ID</td><td style="color:#0f172a;font-size:14px;font-weight:600;font-family:monospace;">${applicationId}</td></tr>
          <tr><td style="color:#64748b;font-size:14px;">Reference No</td><td style="color:#0f172a;font-size:14px;font-weight:600;font-family:monospace;">${referenceNumber}</td></tr>
          <tr><td style="color:#64748b;font-size:14px;">Program</td><td style="color:#0f172a;font-size:14px;font-weight:600;">${internshipName}</td></tr>
          <tr><td style="color:#64748b;font-size:14px;">Status</td><td><span style="display:inline-block;padding:2px 10px;background:#fef3c7;color:#92400e;border-radius:20px;font-size:12px;font-weight:600;">Under Review</span></td></tr>
        </table>
      </td></tr>
    </table>
    
    <p style="color:#334155;font-size:16px;line-height:1.7;">You'll receive an email notification once a decision has been made. In the meantime, you can track your application status from your dashboard.</p>
    
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">Track Application Status →</a>
    </div>
  </td></tr>
  
  <!-- Footer -->
  <tr><td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
    <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} InterNexa. All rights reserved.</p>
  </td></tr>
  
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `📄 Application Received: ${internshipName} — ${referenceNumber}`,
    htmlContent
  });
}

// -- 2. Offer Letter Email — THE BIG ONE
interface OfferEmailProps {
  studentName: string;
  email: string;
  internshipName: string;
  offerLetterId: string;
  applicationId: string;
  duration: string;
  pdfUrl?: string;
}

export async function sendOfferLetterEmail({
  studentName, email, internshipName, offerLetterId, applicationId, duration, pdfUrl
}: OfferEmailProps) {
  const acceptLink = `${APP_URL}/offer/${offerLetterId}`;
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 72);
  const expiryStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
  
  <!-- Celebration Header -->
  <tr><td style="background:linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%);padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">🎉</div>
    <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:800;letter-spacing:-0.5px;">Congratulations!</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;font-weight:500;">You've been selected for an internship at InterNexa</p>
  </td></tr>
  
  <!-- Logo Bar -->
  <tr><td style="padding:20px 40px;background-color:#f0fdf4;border-bottom:1px solid #bbf7d0;text-align:center;">
    <h2 style="color:#4f46e5;margin:0;font-size:24px;font-weight:800;">InterNexa</h2>
    <p style="color:#64748b;margin:4px 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Official Offer Letter</p>
  </td></tr>
  
  <!-- Body -->
  <tr><td style="padding:40px;">
    <p style="color:#334155;font-size:16px;line-height:1.8;">Dear <strong style="color:#0f172a;">${studentName}</strong>,</p>
    
    <p style="color:#334155;font-size:16px;line-height:1.8;">We are absolutely thrilled to inform you that after careful review of your application, <strong>you have been officially selected</strong> for the <strong style="color:#4f46e5;">${internshipName}</strong> internship program at InterNexa!</p>
    
    <p style="color:#334155;font-size:16px;line-height:1.8;">Your skills, enthusiasm, and potential truly stood out among numerous applicants. We are confident that you will thrive in this program and gain invaluable industry experience.</p>
    
    <!-- Offer Details Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 100%);border-radius:16px;margin:28px 0;border:2px solid #86efac;">
      <tr><td style="padding:24px;">
        <p style="margin:0 0 16px;font-weight:800;color:#065f46;font-size:16px;">📋 Your Offer Details</p>
        <table width="100%" cellpadding="6" cellspacing="0">
          <tr><td style="color:#047857;font-size:14px;font-weight:600;width:150px;vertical-align:top;">Offer ID</td><td style="color:#065f46;font-size:15px;font-weight:700;font-family:'Courier New',monospace;letter-spacing:0.5px;">${offerLetterId}</td></tr>
          <tr><td style="color:#047857;font-size:14px;font-weight:600;vertical-align:top;">Application No</td><td style="color:#065f46;font-size:14px;font-weight:600;">${applicationId}</td></tr>
          <tr><td style="color:#047857;font-size:14px;font-weight:600;vertical-align:top;">Program</td><td style="color:#065f46;font-size:14px;font-weight:700;">${internshipName}</td></tr>
          <tr><td style="color:#047857;font-size:14px;font-weight:600;vertical-align:top;">Duration</td><td style="color:#065f46;font-size:14px;font-weight:600;">${duration}</td></tr>
          <tr><td style="color:#047857;font-size:14px;font-weight:600;vertical-align:top;">Offer Date</td><td style="color:#065f46;font-size:14px;">${todayStr}</td></tr>
          <tr><td style="color:#047857;font-size:14px;font-weight:600;vertical-align:top;">Expires</td><td style="font-size:14px;"><span style="display:inline-block;padding:3px 12px;background:#fef2f2;color:#dc2626;border-radius:20px;font-size:12px;font-weight:700;">${expiryStr} (72 hrs)</span></td></tr>
        </table>
      </td></tr>
    </table>

    <!-- Benefits Section -->
    <h3 style="color:#0f172a;font-size:18px;margin:32px 0 16px;font-weight:700;">🎁 What You'll Get</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding:6px 8px 6px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Industry-Grade Projects</strong><br><span style="color:#64748b;">Real-world projects for your portfolio</span></td>
          </tr></table>
        </td>
        <td width="50%" style="padding:6px 0 6px 8px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Verified Certificate</strong><br><span style="color:#64748b;">Industry-recognized with QR verification</span></td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px 6px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Expert Mentorship</strong><br><span style="color:#64748b;">1-on-1 guidance from industry experts</span></td>
          </tr></table>
        </td>
        <td style="padding:6px 0 6px 8px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Letter of Recommendation</strong><br><span style="color:#64748b;">Performance-based LOR from mentors</span></td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 8px 6px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Placement Assistance</strong><br><span style="color:#64748b;">Career support & interview prep</span></td>
          </tr></table>
        </td>
        <td style="padding:6px 0 6px 8px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;vertical-align:top;color:#10b981;font-size:18px;">✅</td>
            <td style="color:#334155;font-size:14px;line-height:1.5;"><strong>Flexible Learning</strong><br><span style="color:#64748b;">Learn at your own pace, anywhere</span></td>
          </tr></table>
        </td>
      </tr>
    </table>
    
    <!-- Timeline -->
    <h3 style="color:#0f172a;font-size:18px;margin:32px 0 16px;font-weight:700;">📍 Your Journey Ahead</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
      <tr><td style="padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;"><span style="display:inline-block;width:28px;height:28px;background:#10b981;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;margin-right:12px;">1</span><span style="color:#0f172a;font-size:14px;font-weight:600;">Accept Offer & Complete Onboarding</span></td></tr>
          <tr><td style="padding:0 0 0 14px;"><div style="border-left:2px dashed #cbd5e1;height:16px;margin-left:0;"></div></td></tr>
          <tr><td style="padding:8px 0;"><span style="display:inline-block;width:28px;height:28px;background:#6366f1;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;margin-right:12px;">2</span><span style="color:#0f172a;font-size:14px;font-weight:600;">Access Learning Materials & Projects</span></td></tr>
          <tr><td style="padding:0 0 0 14px;"><div style="border-left:2px dashed #cbd5e1;height:16px;margin-left:0;"></div></td></tr>
          <tr><td style="padding:8px 0;"><span style="display:inline-block;width:28px;height:28px;background:#f59e0b;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;margin-right:12px;">3</span><span style="color:#0f172a;font-size:14px;font-weight:600;">Work with Mentor & Submit Projects</span></td></tr>
          <tr><td style="padding:0 0 0 14px;"><div style="border-left:2px dashed #cbd5e1;height:16px;margin-left:0;"></div></td></tr>
          <tr><td style="padding:8px 0;"><span style="display:inline-block;width:28px;height:28px;background:#ec4899;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;margin-right:12px;">4</span><span style="color:#0f172a;font-size:14px;font-weight:600;">Earn Certificate, LOR & Career Support</span></td></tr>
        </table>
      </td></tr>
    </table>
    
    <!-- PDF Attached Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;background:#eef2ff;border-radius:12px;border:1px solid #c7d2fe;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;color:#3730a3;font-size:14px;font-weight:600;">📎 Your official Offer Letter PDF is attached to this email.</p>
        <p style="margin:4px 0 0;color:#4338ca;font-size:13px;">Please keep it for your records.</p>
      </td></tr>
    </table>

    <!-- CTA Button -->
    <div style="text-align:center;margin:36px 0 0;">
      <a href="${acceptLink}" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 6px 20px rgba(5,150,105,0.4);letter-spacing:0.3px;">🚀 Accept Offer & Get Started</a>
    </div>
    <p style="text-align:center;color:#ef4444;font-size:13px;margin:12px 0 0;font-weight:600;">⏰ This offer expires on ${expiryStr}. Accept within 72 hours to secure your seat!</p>
  </td></tr>
  
  <!-- Footer -->
  <tr><td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#4f46e5;font-size:18px;font-weight:800;margin:0 0 4px;">InterNexa</p>
    <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">Bridge the Gap Between Learning and Leading</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
    <p style="color:#94a3b8;font-size:11px;margin:8px 0 0;">© ${new Date().getFullYear()} InterNexa. All rights reserved. | <a href="${APP_URL}/privacy" style="color:#94a3b8;">Privacy Policy</a> | <a href="${APP_URL}/terms" style="color:#94a3b8;">Terms</a></p>
  </td></tr>
  
</table>
</td></tr>
</table>
</body>
</html>`;

  // Build PDF attachment
  let attachment: any[] = [];
  if (pdfUrl) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/offer-letters/${pdfUrl}`;
      attachment.push({
        url: publicUrl,
        name: `InterNexa_Offer_Letter_${offerLetterId}.pdf`
      });
    }
  }

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `🎉 Congratulations ${studentName}! Your Offer Letter for ${internshipName} — ${offerLetterId}`,
    htmlContent,
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
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  
  <tr><td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">✅</div>
    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;">Payment Successful!</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;">Welcome to your internship journey</p>
  </td></tr>
  
  <tr><td style="padding:40px;">
    <p style="color:#334155;font-size:16px;line-height:1.8;">Dear <strong>${studentName}</strong>,</p>
    <p style="color:#334155;font-size:16px;line-height:1.8;">Your payment of <strong style="color:#059669;">₹${amount}</strong> for the <strong>${internshipName}</strong> program has been successfully processed. Your internship dashboard is now fully unlocked!</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;margin:24px 0;border:1px solid #e2e8f0;">
      <tr><td style="padding:20px;">
        <p style="margin:0 0 12px;font-weight:700;color:#0f172a;font-size:15px;">💳 Transaction Details</p>
        <table width="100%" cellpadding="4" cellspacing="0">
          <tr><td style="color:#64748b;font-size:14px;width:140px;">Transaction ID</td><td style="color:#0f172a;font-size:14px;font-weight:600;font-family:monospace;">${transactionId}</td></tr>
          <tr><td style="color:#64748b;font-size:14px;">Amount Paid</td><td style="color:#059669;font-size:14px;font-weight:700;">₹${amount}</td></tr>
          <tr><td style="color:#64748b;font-size:14px;">Status</td><td><span style="display:inline-block;padding:2px 10px;background:#dcfce7;color:#166534;border-radius:20px;font-size:12px;font-weight:600;">Confirmed</span></td></tr>
        </table>
      </td></tr>
    </table>
    
    <p style="color:#334155;font-size:16px;line-height:1.8;">You can now access your curriculum, projects, and mentor assignments from your dashboard. Start learning today!</p>
    
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;box-shadow:0 4px 14px rgba(79,70,229,0.4);">🎓 Start Learning Now →</a>
    </div>
  </td></tr>
  
  <tr><td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
    <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} InterNexa. All rights reserved.</p>
  </td></tr>
  
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `✅ Payment Confirmed — Welcome to ${internshipName}!`,
    htmlContent
  });
}
