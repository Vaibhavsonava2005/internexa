const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://internexalabs.online';
};
const APP_URL = getBaseUrl();
const BRAND_COLOR = "#4f46e5";

function getBrevoKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.error("❌ BREVO_API_KEY is NOT set in environment variables!");
    return "";
  }
  return key.replace(/[\s\r\n]+/g, ''); // Strip all whitespace/newlines
}

// -- Brevo Send Helper
export async function sendBrevoEmail({ to, subject, htmlContent, attachment }: { to: { email: string, name: string }[], subject: string, htmlContent: string, attachment?: any[] }) {
  const apiKey = getBrevoKey();
  
  if (!apiKey) {
    console.error("⚠️ BREVO_API_KEY missing — email NOT sent. Subject:", subject, "To:", to.map(t => t.email).join(', '));
    return { success: false, error: "BREVO_API_KEY not configured" };
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

    console.log("📧 Sending email via Brevo — To:", to.map(t => t.email).join(', '), "Subject:", subject);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log("📧 Brevo API Response:", response.status, responseText);

    if (!response.ok) {
      console.error("❌ Brevo API Error:", response.status, responseText);
      return { success: false, error: responseText };
    }

    console.log("✅ Email sent successfully to:", to.map(t => t.email).join(', '));
    return { success: true };
  } catch (error: any) {
    console.error("❌ Brevo Network/Fetch Error:", error.message || error);
    return { success: false, error: error.message };
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
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      
      const { data, error } = await supabaseAdmin.storage.from('offer-letters').download(pdfUrl);
      
      if (!error && data) {
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Content = buffer.toString('base64');
        
        attachment.push({
          content: base64Content,
          name: `InterNexa_Offer_Letter_${offerLetterId}.pdf`
        });
      } else {
        console.error("Failed to download PDF for email attachment", error);
      }
    } catch (err) {
      console.error("Error attaching PDF to email", err);
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

export async function sendPaymentRejectedEmail({
  email,
  name,
  internshipName,
}: {
  email: string;
  name: string;
  internshipName: string;
}) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
<tr><td align="center">
<table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);max-width:600px;margin:0 auto;">
  
  <tr><td style="padding:40px;text-align:center;background:linear-gradient(135deg,#ef4444,#dc2626);">
    <h1 style="color:#ffffff;font-size:28px;margin:0 0 12px;font-weight:800;letter-spacing:-0.5px;">Payment Verification Failed</h1>
  </td></tr>

  <tr><td style="padding:40px 40px 20px;">
    <p style="color:#334155;font-size:16px;line-height:24px;margin:0 0 20px;">Hi <strong style="color:#0f172a;">${name}</strong>,</p>
    <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 24px;">
      We reviewed your submitted payment screenshot for the <strong>${internshipName}</strong> internship, but unfortunately we could not verify the transaction.
    </p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:24px;margin-bottom:32px;">
      <h3 style="color:#b91c1c;margin:0 0 12px;font-size:16px;">What you can do:</h3>
      <ul style="color:#7f1d1d;margin:0;padding-left:20px;line-height:24px;">
        <li>Ensure you paid the correct amount (?199).</li>
        <li>Make sure the screenshot clearly shows the UPI Reference ID or Transaction ID.</li>
        <li>Try submitting the payment again using the onboarding link.</li>
      </ul>
    </div>

    <div style="text-align:center;margin:36px 0 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://internexalabs.online'}/dashboard/internships" style="display:inline-block;background:#ef4444;color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 6px 20px rgba(239,68,68,0.4);">Go to Dashboard</a>
    </div>
  </td></tr>
  
  <tr><td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#4f46e5;font-size:18px;font-weight:800;margin:0 0 4px;">InterNexa</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendBrevoEmail({
    to: [{ email, name }],
    subject: "Action Required: Payment Verification Failed - InterNexa",
    htmlContent,
  });
}

export async function sendJoiningLetterEmail({
  studentName,
  email,
  internshipName,
  letterId,
  applicationId,
  duration,
  pdfUrl,
}: {
  studentName: string;
  email: string;
  internshipName: string;
  letterId: string;
  applicationId: string;
  duration: string;
  pdfUrl?: string;
}) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
<tr><td align="center">
<table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);max-width:600px;margin:0 auto;">
  
  <tr><td style="padding:40px;text-align:center;background:linear-gradient(135deg,#10b981,#059669);">
    <h1 style="color:#ffffff;font-size:28px;margin:0 0 12px;font-weight:800;letter-spacing:-0.5px;">Welcome to InterNexa!</h1>
  </td></tr>

  <tr><td style="padding:40px 40px 20px;">
    <p style="color:#334155;font-size:16px;line-height:24px;margin:0 0 20px;">Hi <strong style="color:#0f172a;">${studentName}</strong>,</p>
    <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 24px;">
      Your payment for the <strong>${internshipName}</strong> internship has been successfully verified! We are thrilled to officially welcome you aboard.
    </p>

    <!-- PDF Attached Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;background:#eef2ff;border-radius:12px;border:1px solid #c7d2fe;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;color:#3730a3;font-size:14px;font-weight:600;">📎 Your official Joining Letter PDF is attached to this email.</p>
        <p style="margin:4px 0 0;color:#4338ca;font-size:13px;">Please keep it for your records.</p>
      </td></tr>
    </table>

    <div style="text-align:center;margin:36px 0 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://internexalabs.online'}/dashboard/internships" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 6px 20px rgba(79,70,229,0.4);letter-spacing:0.3px;">🚀 Go to Dashboard</a>
    </div>
  </td></tr>
  
  <tr><td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#4f46e5;font-size:18px;font-weight:800;margin:0 0 4px;">InterNexa</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  let attachment: any[] = [];
  if (pdfUrl) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      );
      
      const { data, error } = await supabaseAdmin.storage.from('documents').download(pdfUrl);
      if (data) {
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        attachment = [{
          content: buffer.toString('base64'),
          name: 'InterNexa_Joining_Letter.pdf'
        }];
      }
    } catch (err) {
      console.error("Failed to fetch pdf for attachment:", err);
    }
  }

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `🎉 Congratulations ${studentName}! Your InterNexa Joining Letter`,
    htmlContent,
    attachment: attachment.length > 0 ? attachment : undefined
  });
}

export async function sendCertificateEmail({
  studentName,
  email,
  internshipName,
  certificateId,
  pdfUrl,
}: {
  studentName: string;
  email: string;
  internshipName: string;
  certificateId: string;
  pdfUrl?: string;
}) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
<tr><td align="center">
<table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);max-width:600px;margin:0 auto;">
  
  <tr><td style="padding:40px;text-align:center;background:linear-gradient(135deg,#10b981,#059669);">
    <h1 style="color:#ffffff;font-size:32px;margin:0 0 12px;font-weight:800;letter-spacing:-0.5px;">Congratulations! 🎉</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:18px;margin:0;">You've completed your internship!</p>
  </td></tr>

  <tr><td style="padding:40px 40px 20px;">
    <p style="color:#334155;font-size:16px;line-height:24px;margin:0 0 20px;">Hi <strong style="color:#0f172a;">${studentName}</strong>,</p>
    <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 24px;">
      We are thrilled to present you with your official <strong>Certificate of Completion</strong>, <strong>Experience Letter</strong>, and <strong>Letter of Recommendation (LOR)</strong> for the <strong>${internshipName}</strong> internship program at InterNexa.
    </p>

    <!-- Certificate Box -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#64748b;font-size:13px;padding-bottom:4px;">CERTIFICATE ID</td>
        </tr>
        <tr>
          <td style="color:#0f172a;font-size:20px;font-weight:800;font-family:monospace;letter-spacing:1px;">${certificateId}</td>
        </tr>
      </table>
    </div>
    
    <!-- PDF Attached Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;background:#ecfdf5;border-radius:12px;border:1px solid #a7f3d0;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;color:#065f46;font-size:14px;font-weight:600;">📎 Your official Documents PDF is attached to this email.</p>
        <p style="margin:4px 0 0;color:#047857;font-size:13px;">This single PDF contains your Certificate, LOR, and Experience Letter.</p>
      </td></tr>
    </table>

    <div style="text-align:center;margin:36px 0 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://internexalabs.online'}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 6px 20px rgba(16,185,129,0.4);letter-spacing:0.3px;">Go to Dashboard</a>
    </div>
  </td></tr>
  
  <tr><td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#10b981;font-size:18px;font-weight:800;margin:0 0 4px;">InterNexa</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">Need help? Contact <a href="mailto:info.internexa@gmail.com" style="color:#10b981;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  let attachment: any[] = [];
  if (pdfUrl) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
      );
      
      const { data, error } = await supabaseAdmin.storage.from('documents').download(pdfUrl);
      if (data) {
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        attachment = [{
          content: buffer.toString('base64'),
          name: 'InterNexa_Certificate_Documents.pdf'
        }];
      }
    } catch (err) {
      console.error("Failed to fetch pdf for attachment:", err);
    }
  }

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject: `🎓 Congratulations ${studentName}! Your InterNexa Certificate is Here`,
    htmlContent,
    attachment: attachment.length > 0 ? attachment : undefined
  });
}

// -- Admin Manual Email
interface AdminManualEmailProps {
  email: string;
  studentName: string;
  subject: string;
  body: string;
  templateType: string;
}

export async function sendAdminManualEmail({ email, studentName, subject, body, templateType }: AdminManualEmailProps) {
  // Use markdown-style conversion for the body to HTML paragraphs
  const formattedBody = body.split('\n\n').map(p => `<p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 16px;">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  
  let buttonHtml = '';
  
  if (templateType === 'instant_certification') {
    buttonHtml = `
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${APP_URL}/dashboard/certificates" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 6px 20px rgba(79,70,229,0.3);">Go to Certificates</a>
    </div>`;
  } else if (templateType === 'streak_reminder') {
    buttonHtml = `
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${APP_URL}/dashboard/courses" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 6px 20px rgba(79,70,229,0.3);">Continue Learning</a>
    </div>`;
  } else {
    buttonHtml = `
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 6px 20px rgba(79,70,229,0.3);">Open Dashboard</a>
    </div>`;
  }

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
    <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">InterNexa Labs</h1>
    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Bridge the Gap Between Learning and Leading</p>
  </td></tr>
  
  <!-- Body -->
  <tr><td style="padding:40px;">
    <h2 style="color:#0f172a;font-size:22px;margin:0 0 24px;">Hi ${studentName},</h2>
    
    ${formattedBody}
    
    ${buttonHtml}
    
    <p style="color:#334155;font-size:16px;line-height:1.6;margin:32px 0 0;">
      Best regards,<br/>
      <strong style="color:#0f172a;">The InterNexa Team</strong>
    </p>
  </td></tr>
  
  <!-- Footer -->
  <tr><td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="color:#4f46e5;font-size:18px;font-weight:800;margin:0 0 4px;">InterNexa Labs</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 4px;">For any questions, contact us at <a href="mailto:info.internexa@gmail.com" style="color:#4f46e5;text-decoration:none;font-weight:600;">info.internexa@gmail.com</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendBrevoEmail({
    to: [{ email, name: studentName }],
    subject,
    htmlContent
  });
}
