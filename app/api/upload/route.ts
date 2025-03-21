import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/supabase/server-client";

export async function POST(request: NextRequest) {
  try {
    console.log("API route /api/upload called");

    // Create Supabase client
    const supabase = await createSupabaseClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }

    if (!user) {
      console.error("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.error("No file provided in request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(
      `Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
    );

    // Optional: Set bucket and folder names
    const bucket = (formData.get("bucket") as string) || process.env.SUPABASE_USER_UPLOADS_TABLE||"uploads";
    const folder = (formData.get("folder") as string) || "";

    // Create a clean filename without spaces and special chars
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${folder}/${Date.now()}-${cleanFileName}`;

    // Read the full file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    console.log(`Uploading to path: ${filePath} in bucket: ${bucket}`);

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Upload successful, data:", data);

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    console.log("Public URL:", publicUrl);

    return NextResponse.json({
      success: true,
      filePath: data.path,
      // publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Unexpected error in upload route:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
