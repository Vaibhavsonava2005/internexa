"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function verifyDocumentAction(docId: string, email: string) {
  try {
    const upperId = docId.toUpperCase().trim();
    
    // Check what type of document this is based on prefix
    if (!upperId.startsWith("CERT-") && !upperId.startsWith("OFF-") && !upperId.startsWith("JOIN-") && !upperId.startsWith("NDA-") && !upperId.startsWith("OFL-") && !upperId.startsWith("JNL-") && !upperId.startsWith("APP-") && !upperId.startsWith("EXP-") && !upperId.startsWith("LOR-") && !upperId.startsWith("REF-")) {
      return { success: false, error: "Invalid document format. Please enter a valid Document ID (e.g. CERT-xxx, JOIN-xxx, EXP-xxx)." };
    }

    let type = "Official Document";
    if (upperId.startsWith("CERT-")) type = "Completion Certificate";
    else if (upperId.startsWith("OFF-") || upperId.startsWith("OFL-")) type = "Offer Letter";
    else if (upperId.startsWith("JOIN-") || upperId.startsWith("JNL-")) type = "Joining Letter";
    else if (upperId.startsWith("NDA-")) type = "Non-Disclosure Agreement";
    else if (upperId.startsWith("EXP-")) type = "Experience Letter";
    else if (upperId.startsWith("LOR-")) type = "Letter of Recommendation";
    else if (upperId.startsWith("APP-") || upperId.startsWith("REF-")) type = "Application Reference";

    let application = null;

    // We use "Deep Logic" to find the application across all possible ID mappings.
    // 1. It might be derived from application_id (e.g. CERT-2026-000010 -> APP-2026-000010)
    const potentialAppId = upperId.replace(/^(CERT-|JOIN-|OFF-|NDA-|OFL-|JNL-|EXP-|LOR-|REF-)/, 'APP-');
    
    // 2. It might be derived from the full UUID
    const potentialId = upperId.replace(/^(CERT-|JOIN-|OFF-|NDA-|OFL-|JNL-|APP-|EXP-|LOR-|REF-)/, '').toLowerCase();
    
    // Safely check if it's a valid UUID to prevent Postgres casting errors
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(potentialId);
    
    let orQuery = `application_id.eq.${potentialAppId},offer_letter_id.eq.${upperId},certificate_id.eq.${upperId},reference_number.eq.${upperId}`;
    if (isUuid) {
      orQuery += `,id.eq.${potentialId}`;
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title)')
      .or(orQuery)
      .limit(1)
      .single();

    if (!error && data) {
      application = data;
    }

    if (!application) {
      return { success: false, error: "Document not found in registry. Please check the ID and try again." };
    }

    if (application.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return { success: false, error: "The provided email does not match the registered student's email for this document." };
    }

    return { 
      success: true, 
      data: {
        docType: type,
        studentName: application.full_name,
        internshipName: application.internships?.title || "Internship Program",
        email: application.email
      }
    };
  } catch (error: any) {
    console.error("Verification error:", error);
    return { success: false, error: "Server error during verification" };
  }
}
