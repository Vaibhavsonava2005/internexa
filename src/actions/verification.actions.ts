"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function verifyDocumentAction(docId: string) {
  try {
    const upperId = docId.toUpperCase().trim();
    
    // Check what type of document this is based on prefix
    if (!upperId.startsWith("CERT-") && !upperId.startsWith("OFF-") && !upperId.startsWith("JOIN-") && !upperId.startsWith("NDA-") && !upperId.startsWith("OFL-") && !upperId.startsWith("JNL-")) {
      return { success: false, error: "Invalid document format. ID must start with CERT-, OFF-, JOIN-, or NDA-." };
    }

    let type = "Official Document";
    if (upperId.startsWith("CERT-")) type = "Completion Certificate";
    else if (upperId.startsWith("OFF-") || upperId.startsWith("OFL-")) type = "Offer Letter";
    else if (upperId.startsWith("JOIN-") || upperId.startsWith("JNL-")) type = "Joining Letter";
    else if (upperId.startsWith("NDA-")) type = "Non-Disclosure Agreement";

    let application = null;

    // We use "Deep Logic" to find the application across all possible ID mappings.
    // 1. It might be derived from application_id (e.g. CERT-2026-000010 -> APP-2026-000010)
    const potentialAppId = upperId.replace(/^(CERT-|JOIN-|OFF-|NDA-|OFL-|JNL-)/, 'APP-');
    
    // 2. It might be derived from the first 8 chars of the UUID
    const potentialIdPrefix = upperId.replace(/^(CERT-|JOIN-|OFF-|NDA-|OFL-|JNL-)/, '').toLowerCase();

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title)')
      .or(`application_id.eq.${potentialAppId},offer_letter_id.eq.${upperId},reference_number.eq.${upperId},id.ilike.${potentialIdPrefix}%`)
      .limit(1)
      .single();

    if (!error && data) {
      application = data;
    }

    if (!application) {
      return { success: false, error: "Document not found in registry. Please check the ID and try again." };
    }

    return { 
      success: true, 
      data: {
        docType: type,
        studentName: application.full_name,
        internshipName: application.internships?.title || "Internship Program"
      }
    };
  } catch (error: any) {
    console.error("Verification error:", error);
    return { success: false, error: "Server error during verification" };
  }
}
