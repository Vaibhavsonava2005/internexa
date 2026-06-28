"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function verifyDocumentAction(docId: string) {
  try {
    const upperId = docId.toUpperCase().trim();
    
    // Check what type of document this is based on prefix
    if (!upperId.startsWith("CERT-") && !upperId.startsWith("OFF-") && !upperId.startsWith("JOIN-") && !upperId.startsWith("NDA-")) {
      return { success: false, error: "Invalid document format" };
    }

    let type = "";
    if (upperId.startsWith("CERT-")) type = "Completion Certificate";
    else if (upperId.startsWith("OFF-")) type = "Offer Letter";
    else if (upperId.startsWith("JOIN-")) type = "Joining Letter";
    else if (upperId.startsWith("NDA-")) type = "Non-Disclosure Agreement";

    let application = null;

    if (upperId.startsWith("CERT-")) {
      // For CERT-, the ID is CERT-{first 8 chars of app.id}
      const idPrefix = upperId.replace("CERT-", "").toLowerCase();
      
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*, internships(title)')
        .ilike('id', `${idPrefix}%`)
        .limit(1)
        .single();
        
      if (!error && data) {
        application = data;
      }
    } else if (upperId.startsWith("OFF-")) {
      // For OFF-, it's stored in offer_letter_id
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*, internships(title)')
        .eq('offer_letter_id', upperId)
        .limit(1)
        .single();
        
      if (!error && data) {
        application = data;
      }
    } else {
      // JOIN- and NDA- are usually same as CERT- (derived from app ID) 
      const idPrefix = upperId.replace(/^(JOIN-|NDA-)/, "").toLowerCase();
      
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*, internships(title)')
        .ilike('id', `${idPrefix}%`)
        .limit(1)
        .single();
        
      if (!error && data) {
        application = data;
      }
    }

    if (!application) {
      return { success: false, error: "Document not found in registry" };
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
