import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { supabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface OfferLetterData {
  offerId: string;
  applicationId?: string;
  studentName: string;
  internshipName: string;
  date: string;
  duration: string;
  stipend?: string;
}

// Helper to draw a beautiful corporate letterhead
function addPremiumLetterhead(doc: jsPDF, title: string, data: OfferLetterData) {
  // Brand Header Band (Indigo-600)
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 35, "F");

  // Logo / Company Name
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.text("InterNexa", 20, 23);
  
  // Tagline / Website
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 210, 255);
  doc.text("Accelerating Careers with AI", 20, 30);

  // Header Contact Info (Right aligned)
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("info.internexa@gmail.com", 190, 20, { align: "right" });
  doc.text("www.internexa.com", 190, 25, { align: "right" });

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(18);
  doc.text(title, 105, 55, { align: "center" });
  
  // Decorative line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(20, 62, 190, 62);

  // Meta Info Box (Right Side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // Slate-500
  doc.text(`Date:`, 135, 75);
  doc.text(`Ref ID:`, 135, 82);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(data.date, 155, 75);
  doc.text(data.offerId, 155, 82);

  if (data.applicationId) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(`App No:`, 135, 89);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(data.applicationId.substring(0, 18) + (data.applicationId.length > 18 ? '...' : ''), 155, 89);
  }
}

// Helper to draw a beautiful footer with QR code
function addPremiumFooter(doc: jsPDF, qrCodeDataUri: string) {
  // Footer Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 265, 190, 265);
  
  // Footer Text
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("This is an electronically generated document. No physical signature is required.", 20, 272);
  doc.text("To verify the authenticity of this document, please scan the QR code.", 20, 277);
  
  // Brand watermark at bottom
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text("© InterNexa Education", 20, 285);

  // QR Code
  doc.addImage(qrCodeDataUri, 'PNG', 165, 268, 22, 22);
}

// Helper for paragraph rendering with proper line height
function drawParagraphs(doc: jsPDF, text: string, startY: number): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Slate-800
  
  // splitTextToSize creates an array of lines based on the maxWidth
  const lines = doc.splitTextToSize(text, 170);
  let currentY = startY;
  
  for (let i = 0; i < lines.length; i++) {
    // If line is empty (representing a paragraph break), add more spacing
    if (lines[i].trim() === "") {
      currentY += 4;
    } else {
      doc.text(lines[i], 20, currentY);
      currentY += 6.5; // Line height
    }
  }
  
  return currentY;
}

export async function generateAndUploadOfferLetter(data: OfferLetterData): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    const doc = new jsPDF();
    
    addPremiumLetterhead(doc, "OFFER OF INTERNSHIP", data);

    // Salutation
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(`Dear ${data.studentName},`, 20, 105);

    // Avoid using rupee symbol as jsPDF default font Helvetica doesn't support it and it breaks kerning.
    const stipendText = data.stipend ? `your stipend structure is: ${data.stipend}.` : "a performance-based stipend of up to INR 15,000 will be provided upon successful completion of the internship.";
    
    // Body Paragraphs
    const bodyText = `We are absolutely thrilled to offer you the position of Intern in the ${data.internshipName} program at InterNexa. Your skills, background, and enthusiasm deeply impressed our team, and we believe you will be a phenomenal addition to our community.

This internship is scheduled for a duration of ${data.duration}. Regarding compensation, ${stipendText}

Throughout this program, you will gain hands-on experience, working on real-world projects that will significantly bridge the gap between your academic learning and industry leadership. Please find the detailed curriculum, project modules, and terms on your student dashboard.

To officially accept this offer and begin your journey with us, please log in to your InterNexa account and complete the secure onboarding process within 72 hours.

We look forward to welcoming you aboard and wish you a highly successful and enriching learning journey!`;

    let currentY = drawParagraphs(doc, bodyText, 115);
    
    currentY += 20;

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Authorized Signatory", 20, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("InterNexa Education Team", 20, currentY + 5);

    // QR Code for Verification
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app'}/verify?id=${data.offerId}`;
    const qrCodeDataUri = await QRCode.toDataURL(verificationUrl, { margin: 1, color: { dark: '#1e293b', light: '#ffffff' } });
    
    addPremiumFooter(doc, qrCodeDataUri);

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Upload to Supabase Storage
    const fileName = `${data.offerId}-${uuidv4()}.pdf`;
    
    let { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('offer-letters')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      await supabaseAdmin.storage.createBucket('offer-letters', { public: true });
      const retryRes = await supabaseAdmin.storage.from('offer-letters').upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });
      uploadData = retryRes.data;
      uploadError = retryRes.error;
    }

    if (uploadError) throw uploadError;
    return { success: true, fileId: uploadData?.path || fileName };

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return { success: false, error: error.message };
  }
}

export async function generateAndUploadJoiningLetter(data: OfferLetterData): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    const doc = new jsPDF();
    
    addPremiumLetterhead(doc, "OFFICIAL JOINING LETTER", data);

    // Salutation
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(`Dear ${data.studentName},`, 20, 105);
    
    // Body Paragraphs
    const bodyText = `Welcome to InterNexa! We are delighted to officially onboard you as an Intern in the highly competitive ${data.internshipName} program. Your payment verification was successful, and all of your onboarding requirements have been met in full.

This joining letter serves as the official and legal confirmation of your enrollment. Your internship officially begins on ${data.date} for a duration of ${data.duration}.

Please check your dashboard for immediate access to your exclusive curriculum, project repositories, and AI assistant tools. Our entire team is extremely excited to help you bridge the gap between learning and leading in the tech industry. 

We wish you a very productive, challenging, and enriching experience with InterNexa.`;

    let currentY = drawParagraphs(doc, bodyText, 115);
    
    currentY += 20;

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Authorized Signatory", 20, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("InterNexa Education Team", 20, currentY + 5);

    // QR Code for Verification
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app'}/verify?id=${data.offerId}`;
    const qrCodeDataUri = await QRCode.toDataURL(verificationUrl, { margin: 1, color: { dark: '#1e293b', light: '#ffffff' } });
    
    addPremiumFooter(doc, qrCodeDataUri);

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Upload to Supabase Storage
    const fileName = `${data.offerId}-${uuidv4()}.pdf`;
    
    let { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      await supabaseAdmin.storage.createBucket('documents', { public: true });
      const retryRes = await supabaseAdmin.storage.from('documents').upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });
      uploadData = retryRes.data;
      uploadError = retryRes.error;
    }

    if (uploadError) throw uploadError;
    return { success: true, fileId: uploadData?.path || fileName };

  } catch (error: any) {
    console.error("PDF generation/upload failed:", error);
    return { success: false, error: error.message };
  }
}
