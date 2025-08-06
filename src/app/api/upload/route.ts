import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, filename);

  try {
    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json(
      { success: false, error: "Error saving file." },
      { status: 500 }
    );
  }
}