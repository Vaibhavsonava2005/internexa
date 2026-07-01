import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateAndUploadJoiningLetter } from "@/lib/pdf-generator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate param
    if (!id) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    let bucket = "offer-letters";
    let filePath = id;

    if (type === "certificate") {
      bucket = "documents";
      filePath = `certificates/${id}`;
    } else if (type === "certificate_file") {
      bucket = "documents";
      filePath = decodeURIComponent(id);
    } else if (type === "joining_letter") {
      bucket = "documents";
      
      // If it's a raw application ID instead of a .pdf filename, generate it on the fly
      if (!id.endsWith(".pdf")) {
        const { data: application } = await supabaseAdmin
          .from("applications")
          .select("*, internships(title, duration)")
          .eq("id", id)
          .single();
          
        if (application) {
          try {
            const pdfResult = await generateAndUploadJoiningLetter({
              offerId: application.offer_letter_id || `OFF-${application.id.substring(0,8).toUpperCase()}`,
              applicationId: application.application_id || application.reference_number || application.id,
              studentName: application.full_name,
              internshipName: application.internships?.title || "Internship Program",
              date: application.start_date ? new Date(application.start_date).toLocaleDateString() : new Date().toLocaleDateString(),
              duration: application.internships?.duration || "N/A",
            });
            
            if (pdfResult.success && pdfResult.fileId) {
              filePath = pdfResult.fileId;
              // Save it to the DB so next time it's fast
              await supabaseAdmin.from("applications").update({ joining_letter_file_id: filePath }).eq("id", id);
            } else {
              filePath = id; // Fallback to raw id if generation fails
            }
          } catch (err) {
            console.error("Fly generation error:", err);
            filePath = id;
          }
        } else {
          filePath = id;
        }
      } else {
        filePath = id;
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    // For storage v1 public URLs, the format is /storage/v1/object/public/<bucket>/<filepath>
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    
    return NextResponse.redirect(publicUrl);
  } catch (error) {
    console.error("Error in download route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
