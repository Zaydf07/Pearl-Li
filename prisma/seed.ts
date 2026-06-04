import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS_DATA } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Create jewelry categories
  const categories = [
    { name: "Bracelets", slug: "bracelets", parentType: "Jewellery", sortOrder: 1 },
    { name: "Necklaces", slug: "necklaces", parentType: "Jewellery", sortOrder: 2 },
    { name: "Rings", slug: "rings", parentType: "Jewellery", sortOrder: 3 },
    { name: "Earrings", slug: "earrings", parentType: "Jewellery", sortOrder: 4 },
    { name: "Anklets", slug: "anklets", parentType: "Jewellery", sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Seed products
  for (const p of PRODUCTS_DATA) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@pearlandli.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@pearlandli.com",
      password: await bcrypt.hash("admin123", 12),
      role: "admin",
    },
  });

  // Create demo customer
  await prisma.user.upsert({
    where: { email: "jane@pearlandli.com" },
    update: {},
    create: {
      name: "Jane Li",
      email: "jane@pearlandli.com",
      password: await bcrypt.hash("demo123", 12),
      country: "Italy",
      phone: "+39 06 1234 5678",
    },
  });

  console.log("✦ Seeding complete!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
