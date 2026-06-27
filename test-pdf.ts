import { generateOfferLetterPDF } from "./src/lib/pdf";
import fs from "fs";

async function run() {
  try {
    const buffer = await generateOfferLetterPDF({
      studentName: "John Doe",
      internshipDomain: "Artificial Intelligence",
      duration: "3 months",
      issueDate: "2026-06-26",
      joiningDate: "2026-07-01",
      referenceNumber: "INX-ART-123456",
      offerLetterId: "OFF-98765",
      verificationUrl: "https://internexa.in/verify/OFF-98765"
    });
    fs.writeFileSync("test.pdf", buffer);
    console.log("PDF created successfully");
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
}
run();
