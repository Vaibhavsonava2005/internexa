import { NextRequest, NextResponse } from "next/server";

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
      // The id here is the full path, decode it
      filePath = decodeURIComponent(id);
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
