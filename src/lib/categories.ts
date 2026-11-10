// Small, client-safe list of sections. Used whenever the database has no category rows.
export const FALLBACK_CATEGORIES = [
  { id: "bracelets", name: "Bracelets", slug: "bracelets", parentType: "Jewellery", sortOrder: 1 },
  { id: "necklaces", name: "Necklaces", slug: "necklaces", parentType: "Jewellery", sortOrder: 2 },
  { id: "rings", name: "Rings", slug: "rings", parentType: "Jewellery", sortOrder: 3 },
  { id: "earrings", name: "Earrings", slug: "earrings", parentType: "Jewellery", sortOrder: 4 },
  { id: "pendants", name: "Pendants", slug: "pendants", parentType: "Jewellery", sortOrder: 6 },
  { id: "drop-earrings", name: "Drop Earrings", slug: "drop-earrings", parentType: "Jewellery", sortOrder: 7 },
  { id: "huggie-earrings", name: "Huggie Earrings", slug: "huggie-earrings", parentType: "Jewellery", sortOrder: 8 },
  { id: "hoop-earrings", name: "Hoop Earrings", slug: "hoop-earrings", parentType: "Jewellery", sortOrder: 9 },
  { id: "heart-pendants", name: "Heart Pendants", slug: "heart-pendants", parentType: "Jewellery", sortOrder: 10 },
  { id: "cushion-pendants", name: "Cushion Pendants", slug: "cushion-pendants", parentType: "Jewellery", sortOrder: 11 },
  { id: "tennis-bracelets", name: "Tennis Bracelets", slug: "tennis-bracelets", parentType: "Jewellery", sortOrder: 12 },
  { id: "chain-bracelets", name: "Chain Bracelets", slug: "chain-bracelets", parentType: "Jewellery", sortOrder: 13 },
  { id: "engagement-rings", name: "Engagement Rings", slug: "engagement-rings", parentType: "Jewellery", sortOrder: 14 },
  { id: "halo-rings", name: "Halo Rings", slug: "halo-rings", parentType: "Jewellery", sortOrder: 15 },
  { id: "bridal-rings", name: "Bridal Rings", slug: "bridal-rings", parentType: "Jewellery", sortOrder: 16 },
  { id: "eternity-rings", name: "Eternity Rings", slug: "eternity-rings", parentType: "Jewellery", sortOrder: 17 },
  { id: "classic-rings", name: "Classic Rings", slug: "classic-rings", parentType: "Jewellery", sortOrder: 18 },
  { id: "mens-rings", name: "Men's Rings", slug: "mens-rings", parentType: "Jewellery", sortOrder: 19 },
];

// Style sections for the 14Kt catalogue. A product belongs to one through its `collection` field;
// `parent` is the main category it sits under.
export const COLLECTIONS_14KT = [
  {
    "name": "Drop Earrings",
    "parent": "Earrings",
    "eyebrow": "Blue Sapphire",
    "description": "Oval and pear-shaped blue sapphire drops with round brilliant diamonds, set in 14K white gold.",
    "image": "/14kt-jewellery/Earrings/EDNOVBR0795AB-cdb77930.jpg"
  },
  {
    "name": "Huggie Earrings",
    "parent": "Earrings",
    "eyebrow": "Diamond",
    "description": "Round and cushion-cut diamond huggies with European lever backs, set in 14K white gold.",
    "image": "/14kt-jewellery/Earrings/GDE0004B-b2511569.jpg"
  },
  {
    "name": "Hoop Earrings",
    "parent": "Earrings",
    "eyebrow": "Diamond",
    "description": "Round, pear and heart-shaped diamond hoops, set in 14K gold.",
    "image": "/14kt-jewellery/Earrings/EHPBR0420-ef28af17.jpg"
  },
  {
    "name": "Heart Pendants",
    "parent": "Pendants",
    "eyebrow": "Diamond",
    "description": "Heart-shaped diamond pendants, set in 14K yellow gold.",
    "image": "/14kt-jewellery/Pendants/PBZHS0105Y-24b97f84.jpg"
  },
  {
    "name": "Cushion Pendants",
    "parent": "Pendants",
    "eyebrow": "Diamond",
    "description": "Bezel set cushion-cut solitaire diamond pendants, set in 14K yellow gold.",
    "image": "/14kt-jewellery/Pendants/PSOLCU0105BY-a02ea00d.jpg"
  },
  {
    "name": "Tennis Bracelets",
    "parent": "Bracelets",
    "eyebrow": "Diamond",
    "description": "Round, radiant, oval, princess, cushion and Asscher-cut diamond tennis bracelets, set in 14K gold.",
    "image": "/14kt-jewellery/Bracelets/BTBR0300-22d92716.jpg"
  },
  {
    "name": "Chain Bracelets",
    "parent": "Bracelets",
    "eyebrow": "Diamond",
    "description": "A single bezel set diamond on a fine chain, in a choice of cuts, set in 14K gold.",
    "image": "/14kt-jewellery/Bracelets/BCHBR0100BY-624d7e72.jpg"
  },
  {
    "name": "Engagement Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Solitaire and accented diamond engagement rings in a choice of cuts, set in 14K gold.",
    "image": "/14kt-jewellery/Rings/RENOV0100-5768ed27.jpg"
  },
  {
    "name": "Halo Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Diamond rings framed by a halo of smaller stones, set in 14K gold.",
    "image": "/14kt-jewellery/Rings/RENGAHBR0150Y-ed0fbc71.jpg"
  },
  {
    "name": "Bridal Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Statement bridal rings with large centre diamonds, set in 14K gold.",
    "image": "/14kt-jewellery/Rings/RBASOLOV0675Y-99736193.jpg"
  },
  {
    "name": "Eternity Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Bezel set half eternity rings, set in 14K yellow gold.",
    "image": "/14kt-jewellery/Rings/RHESPS0150BY-5d05c013.jpg"
  },
  {
    "name": "Classic Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Classic diamond rings, set in 14K white gold.",
    "image": "/14kt-jewellery/Rings/RASOLPS0145A-811e44b7.jpg"
  },
  {
    "name": "Men's Rings",
    "parent": "Rings",
    "eyebrow": "Diamond",
    "description": "Emerald-cut diamond men's rings, set in 14K yellow gold.",
    "image": "/14kt-jewellery/Rings/RMEM1015Y-91d4e45c.jpg"
  }
];

export const isStyleSection = (name: string) => COLLECTIONS_14KT.some(c => c.name === name);

// Number of options per product (by slug), so cards anywhere can show "From $X".
export const OPTION_COUNTS: Record<string, number> = {"blue-sapphire-oval-drop-earrings":5,"round-diamond-huggie-earrings":2,"round-diamond-hoop-earrings":9,"pear-diamond-hoop-earrings":2,"cushion-diamond-huggie-earrings":6,"bezel-set-cushion-diamond-pendant":2,"bezel-set-heart-diamond-pendant":6,"emerald-cut-diamond-chain-bracelet":31,"pear-diamond-chain-bracelet":28,"radiant-diamond-chain-bracelet":17,"oval-diamond-chain-bracelet":10,"princess-diamond-chain-bracelet":3,"round-diamond-tennis-bracelet":30,"princess-diamond-tennis-bracelet":3,"cushion-diamond-tennis-bracelet":2,"asscher-diamond-tennis-bracelet":2,"oval-diamond-engagement-ring":8,"accented-oval-diamond-engagement-ring":2,"accented-round-diamond-engagement-ring":9,"pear-diamond-engagement-ring":4,"accented-pear-diamond-engagement-ring":8,"emerald-cut-diamond-engagement-ring-with-marquise-and-round-side-stones":2,"oval-diamond-engagement-ring-with-marquise-and-round-side-stones":4,"accented-east-west-pear-diamond-engagement-ring":2,"accented-emerald-cut-diamond-engagement-ring":7,"pear-diamond-engagement-ring-with-marquise-and-round-side-stones":4,"bezel-set-heart-diamond-half-eternity-ring":2,"accented-cushion-diamond-engagement-ring-with-marquise-and-round-side-stones":2,"accented-east-west-emerald-cut-diamond-engagement-ring":3,"accented-emerald-cut-diamond-engagement-ring-with-pear-side-stones":4,"accented-pear-diamond-engagement-ring-with-pear-side-stones":3,"accented-round-diamond-engagement-ring-with-marquise-side-stones":6,"accented-cushion-diamond-engagement-ring-with-pear-side-stones":2,"round-diamond-engagement-ring":3,"accented-radiant-diamond-engagement-ring":3,"round-diamond-halo-engagement-ring":4,"round-diamond-solitaire-engagement-ring":2,"accented-cushion-diamond-engagement-ring-with-marquise-side-stones":2,"accented-emerald-cut-diamond-engagement-ring-with-marquise-side-stones":4,"accented-round-diamond-engagement-ring-with-pear-side-stones":2,"accented-radiant-diamond-engagement-ring-with-marquise-side-stones":4,"accented-heart-diamond-engagement-ring-with-marquise-side-stones":3,"radiant-diamond-halo-engagement-ring":4,"accented-princess-diamond-engagement-ring":2,"heart-diamond-classic-halo-ring":2,"oval-diamond-bridal-solitaire-ring":2,"emerald-cut-diamond-bridal-ring-with-hidden-halo":2,"emerald-cut-diamond-mens-ring":3};
