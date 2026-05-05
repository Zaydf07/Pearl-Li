import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Bangles",     slug: "bangles",     parentType: "Jewellery",   sortOrder: 1 },
  { name: "Bracelets",   slug: "bracelets",   parentType: "Jewellery",   sortOrder: 2 },
  { name: "Chains",      slug: "chains",      parentType: "Jewellery",   sortOrder: 3 },
  { name: "Earrings",    slug: "earrings",    parentType: "Jewellery",   sortOrder: 4 },
  { name: "Necklaces",   slug: "necklaces",   parentType: "Jewellery",   sortOrder: 5 },
  { name: "Pendants",    slug: "pendants",    parentType: "Jewellery",   sortOrder: 6 },
  { name: "Rings",       slug: "rings",       parentType: "Jewellery",   sortOrder: 7 },
  { name: "Watches",     slug: "watches",     parentType: "Watches",     sortOrder: 1 },
  { name: "Accessories", slug: "accessories", parentType: "Accessories", sortOrder: 1 },
];

async function main() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    console.log(`  ✦ ${c.name}`);
  }
  console.log("Categories seeded.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
