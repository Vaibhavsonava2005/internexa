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

export async function generateAndUploadOfferLetter(data: OfferLetterData): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    const doc = new jsPDF();
    
    // Add InterNexa Branding
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229); // #4f46e5 (Indigo)
    doc.setFontSize(28);
    doc.text("InterNexa", 20, 30);
    
    // Add "OFFER LETTER" title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("OFFER OF INTERNSHIP", 105, 50, { align: "center" });

    // Details Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    doc.text(`Date: ${data.date}`, 145, 30);
    doc.text(`Offer ID: ${data.offerId}`, 145, 38);
    if (data.applicationId) {
      doc.text(`App No: ${data.applicationId}`, 145, 46);
    }

    doc.text(`Dear ${data.studentName},`, 20, 70);

    const bodyText = `We are thrilled to offer you the position of Intern in the ${data.internshipName} program at InterNexa. Your skills and background impress us, and we believe you will be a great addition to our team.

This internship is for a duration of ${data.duration}. ${data.stipend ? `You will receive a stipend of ${data.stipend}.` : "A performance-based stipend of up to ₹15,000 is to be given at the end of the internship."}

Please find the detailed curriculum and terms on your student dashboard. To accept this offer, please log in to your InterNexa account and complete the onboarding process within 72 hours.

We look forward to welcoming you aboard and wish you a successful learning journey.`;

    const splitText = doc.splitTextToSize(bodyText, 170);
    doc.text(splitText, 20, 85);

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signatory", 20, 160);
    doc.setFont("helvetica", "normal");
    doc.text("InterNexa Education Team", 20, 168);

    // QR Code for Verification
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app'}/verify?id=${data.offerId}`;
    const qrCodeDataUri = await QRCode.toDataURL(verificationUrl, { margin: 1 });
    
    doc.addImage(qrCodeDataUri, 'PNG', 150, 150, 35, 35);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Scan to Verify", 155, 188);

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

    // If upload fails, it might be because the bucket doesn't exist
    if (uploadError) {
      console.warn("Upload failed, attempting to create bucket 'offer-letters'...");
      await supabaseAdmin.storage.createBucket('offer-letters', { public: true });
      
      // Retry upload
      const retryRes = await supabaseAdmin
        .storage
        .from('offer-letters')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });
        
      uploadData = retryRes.data;
      uploadError = retryRes.error;
    }

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return { success: false, error: "Failed to upload Offer Letter" };
    }

    return { success: true, fileId: uploadData.path };

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return { success: false, error: error.message };
  }
}
