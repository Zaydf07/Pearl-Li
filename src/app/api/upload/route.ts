import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only image files are allowed (JPG, PNG, WebP)" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large — max 10MB" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build a safe filename: timestamp + sanitised original name
    const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "products");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, safeName), buffer);

    const url = `/uploads/products/${safeName}`;
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
