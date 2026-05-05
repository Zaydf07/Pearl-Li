import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(inquiries);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const type = form.get("type") as string;
    const message = form.get("message") as string;

    const imageFiles = form.getAll("images") as File[];
    const savedPaths: string[] = [];

    if (imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      for (const file of imageFiles) {
        if (file.size === 0) continue;
        const buf = Buffer.from(await file.arrayBuffer());
        const fname = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        await writeFile(path.join(uploadDir, fname), buf);
        savedPaths.push(`/uploads/${fname}`);
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: { name: `${firstName} ${lastName}`, email, phone, type: type || "General", message, images: savedPaths.join(",") },
    });
    return NextResponse.json(inquiry, { status: 201 });
  }

  const data = await req.json();
  const inquiry = await prisma.inquiry.create({ data: { ...data, status: "new" } });
  return NextResponse.json(inquiry, { status: 201 });
}
