import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface OfferLetterData {
  studentName: string;
  internshipDomain: string;
  duration: string;
  issueDate: string;
  joiningDate: string;
  referenceNumber: string;
  offerLetterId: string;
  verificationUrl: string;
}

export async function generateOfferLetterPDF(data: OfferLetterData): Promise<Buffer> {
  // Create a new A4 landscape or portrait PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const brandColor = "#4f46e5";
  const textColor = "#334155";
  const lightGray = "#f1f5f9";

  // 1. Header Border
  doc.setFillColor(brandColor);
  doc.rect(0, 0, pageWidth, 15, "F");

  // 2. Company Logo / Title
  doc.setTextColor(brandColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("InterNexa", 20, 35);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text("Empowering the next generation of professionals", 20, 42);

  // 3. Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(textColor);
  doc.text("INTERNSHIP OFFER LETTER", pageWidth / 2, 65, { align: "center" });

  // 4. Date & Ref
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${data.issueDate}`, 20, 80);
  doc.text(`Ref No: ${data.referenceNumber}`, 20, 86);
  doc.text(`Offer ID: ${data.offerLetterId}`, 20, 92);

  // 5. Salutation
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Dear ${data.studentName},`, 20, 110);

  // 6. Body Text
  doc.setFont("helvetica", "normal");
  const bodyText = `We are thrilled to offer you the position of Intern in the ${data.internshipDomain} domain at InterNexa. Your application and profile demonstrated the skills and passion we look for in our cohort.

During your ${data.duration} internship, you will have the opportunity to work on real-world projects, receive mentorship from industry experts, and develop highly sought-after skills.

Details of your internship:
- Domain: ${data.internshipDomain}
- Duration: ${data.duration}
- Mode: Remote / Online
- Scheduled Start Date: ${data.joiningDate}

We expect you to perform your duties with dedication and adhere to the professional standards of InterNexa. Upon successful completion of this program and all associated projects, you will be awarded an official Certificate of Completion.

Congratulations once again! We look forward to welcoming you to the team and helping you launch a successful career.`;

  const splitText = doc.splitTextToSize(bodyText, pageWidth - 40);
  doc.text(splitText, 20, 125);

  // 7. Signature Section
  const signatureY = 220;
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", 20, signatureY);
  doc.setFont("helvetica", "normal");
  doc.text("InterNexa Management Team", 20, signatureY + 6);
  
  // Fake digital signature mark
  doc.setTextColor(brandColor);
  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.text("InterNexa Verified", 20, signatureY - 10);
  doc.setTextColor(textColor);
  doc.setFontSize(10);

  // 8. QR Code for Verification
  try {
    const qrDataUrl = await QRCode.toDataURL(data.verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    });
    
    // Add QR Code image (x, y, width, height)
    doc.addImage(qrDataUrl, "PNG", pageWidth - 50, signatureY - 25, 30, 30);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Scan to verify", pageWidth - 35, signatureY + 10, { align: "center" });
  } catch (err) {
    console.error("QR Code generation failed", err);
  }

  // 9. Footer
  doc.setFillColor(lightGray);
  doc.rect(0, 275, pageWidth, 25, "F");
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("This is a digitally generated document and does not require physical signatures.", pageWidth / 2, 285, { align: "center" });
  doc.text("Verify this document online at internexa.in/verify", pageWidth / 2, 290, { align: "center" });

  // Convert to Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
