import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "newest"; // newest, price-low, price-high, rating
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : 0;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : Infinity;
    const category = searchParams.get("category");
    const material = searchParams.get("material");

    let products = await prisma.product.findMany();

    // Client-side filtering (since SQLite doesn't support mode: "insensitive")
    products = products.filter(p => {
      const searchLower = q.toLowerCase();
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.material.toLowerCase().includes(searchLower) ||
        p.gemstone.toLowerCase().includes(searchLower);

      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchesCategory = !category || p.subCategory === category;
      const matchesMaterial = !material || p.material.toLowerCase().includes(material.toLowerCase());

      return matchesSearch && matchesPrice && matchesCategory && matchesMaterial;
    });

    // Sort
    if (sort === "price-low") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") products.sort((a, b) => b.price - a.price);
    else if (sort === "rating") products.sort((a, b) => b.avgRating - a.avgRating);
    else products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // newest

    return NextResponse.json({
      results: products,
      count: products.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
