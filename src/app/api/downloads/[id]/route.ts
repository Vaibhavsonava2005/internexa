import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Redirect directly to the public URL for the offer letter
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/offer-letters/${id}`;
    
    return NextResponse.redirect(publicUrl);
  } catch (error) {
    console.error("Error in download route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
