import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        rating: Math.min(5, Math.max(1, body.rating)),
        title: body.title,
        content: body.content,
        userId: body.userId || null,
      },
      include: { user: { select: { name: true } } },
    });

    // Update product rating
    const allReviews = await prisma.review.findMany({
      where: { productId: product.id },
    });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: product.id },
      data: { avgRating, reviewCount: allReviews.length },
    });

    return NextResponse.json(review);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
