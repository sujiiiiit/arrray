"use server";

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/supabase/server-client";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bucket = (formData.get("bucket") as string) || "public";
    const folder = (formData.get("folder") as string) || "";
    const fileBuffer = await file.arrayBuffer();
    const filePath = `${folder}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ success: true, filePath: data.path, publicUrl });
  } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ error: message }, { status: 500 });
  }
}
