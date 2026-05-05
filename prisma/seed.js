const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const PRODUCTS = [
  { slug:"astral-ring", name:"Astral Ring", collection:"Celestial", price:3800, type:"Jewellery", isNew:true, isSale:false, description:"Luminous South Sea pearl in 18k yellow gold with pavé diamond orbit. Limited edition, handcrafted.", material:"18k Yellow Gold", gemstone:"South Sea Pearl, Diamonds", origin:"Italy", image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
  { slug:"star-pendant-necklace", name:"Star Pendant Necklace", collection:"Celestial", price:2400, type:"Jewellery", isNew:true, isSale:false, description:"18k white gold star pendant, 0.8ct total diamond weight, 45cm chain.", material:"18k White Gold", gemstone:"Diamonds (0.8ct)", origin:"Italy", image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { slug:"pearl-drop-earrings", name:"Pearl Drop Earrings", collection:"Celestial", price:1950, type:"Jewellery", isNew:true, isSale:true, description:"Akoya pearl drops, 18k yellow gold hooks. 10mm pearls, AAA grade.", material:"18k Yellow Gold", gemstone:"Akoya Pearls (10mm)", origin:"Japan / Italy", image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
  { slug:"serpentine-bracelet", name:"Serpentine Bracelet", collection:"Serpentine", price:5200, type:"Jewellery", isNew:false, isSale:false, description:"Fluid 18k gold articulated links with diamond clasp. Signature Roman motif.", material:"18k Yellow Gold", gemstone:"Diamonds (clasp)", origin:"Italy", image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80" },
  { slug:"jade-diamond-ring", name:"Jade & Diamond Ring", collection:"Jadore", price:4600, type:"Jewellery", isNew:false, isSale:true, description:"Imperial jade set in platinum with rose-cut diamond halo.", material:"Platinum", gemstone:"Imperial Jade, Rose-cut Diamonds", origin:"Hong Kong / Italy", image:"https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80" },
  { slug:"heritage-watch", name:"Heritage Watch", collection:"Timepieces", price:8900, type:"Watches", isNew:false, isSale:false, description:"36mm rose gold case, mother-of-pearl dial, Swiss movement, alligator strap.", material:"18k Rose Gold", gemstone:"Mother of Pearl", origin:"Switzerland", image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80" },
  { slug:"celestial-bangles", name:"Celestial Bangles (Set of 3)", collection:"Celestial", price:3200, type:"Jewellery", isNew:true, isSale:false, description:"Trio of 18k gold bangles — hammered, smooth, and diamond-set textures.", material:"18k Yellow Gold", gemstone:"Diamonds (paved)", origin:"Italy", image:"https://images.unsplash.com/photo-1630018548696-a9fd5e1e0555?w=600&q=80" },
  { slug:"serpenti-silk-scarf", name:"Serpenti Silk Scarf", collection:"Accessories", price:680, type:"Accessories", isNew:false, isSale:true, description:"Hand-rolled silk twill, serpent motif, 90×90cm. Dry clean only.", material:"Silk Twill", gemstone:"—", origin:"Italy", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { slug:"pearl-clutch-bag", name:"Pearl Clutch Bag", collection:"Accessories", price:3200, type:"Accessories", isNew:false, isSale:false, description:"Python-embossed leather, oversized pearl clasp, 22cm. Gold hardware.", material:"Leather, Gold Hardware", gemstone:"Cultured Pearl Clasp", origin:"Italy", image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { slug:"jadore-choker", name:"Jadore Choker", collection:"Jadore", price:6800, type:"Jewellery", isNew:false, isSale:false, description:"Platinum choker with alternating jade cabochons and round diamonds.", material:"Platinum", gemstone:"Jade, Diamonds (2.4ct)", origin:"Italy", image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { slug:"celestial-stud-earrings", name:"Celestial Stud Earrings", collection:"Celestial", price:980, type:"Jewellery", isNew:true, isSale:false, description:"Diamond star studs in 18k white gold. 0.4ct total. Push-back closure.", material:"18k White Gold", gemstone:"Diamonds (0.4ct)", origin:"Italy", image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
  { slug:"serpentine-cuff", name:"Serpentine Cuff", collection:"Serpentine", price:4100, type:"Jewellery", isNew:false, isSale:true, description:"Open-style 18k gold cuff with serpent head terminals and ruby eyes.", material:"18k Yellow Gold", gemstone:"Rubies, Diamonds", origin:"Italy", image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80" },
];

async function main() {
  console.log("Seeding database…");
  for (const p of PRODUCTS) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
    process.stdout.write(".");
  }
  const adminPwd = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({ where: { email: "admin@pearlandli.com" }, update: {}, create: { name: "Admin", email: "admin@pearlandli.com", password: adminPwd, role: "admin" } });
  const demoPwd = await bcrypt.hash("demo123", 12);
  await prisma.user.upsert({ where: { email: "jane@pearlandli.com" }, update: {}, create: { name: "Jane Li", email: "jane@pearlandli.com", password: demoPwd, country: "Italy", phone: "+39 06 1234 5678" } });
  console.log("\n✦ Seeding complete!");
  console.log("Admin: admin@pearlandli.com / admin123");
  console.log("Demo:  jane@pearlandli.com  / demo123");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
