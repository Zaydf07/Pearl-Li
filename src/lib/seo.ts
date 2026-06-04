export const DEFAULT_SEO = {
  title: "Pearl & Li — Fine Jewellery & Luxury Goods",
  description: "Where Italian artistry meets Eastern grace — fine jewellery and luxury goods for the discerning collector. Discover our CT Series collection of exquisite bracelets, necklaces, rings, and earrings.",
  keywords: "luxury jewellery, fine jewelry, bracelets, necklaces, rings, earrings, cartier, ct series, designer jewelry",
  image: "https://pearlandi.com/og-image.jpg",
};

export function generateMetadata(props: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  slug?: string;
}) {
  const baseUrl = "https://pearlandi.com";
  const title = props.title || DEFAULT_SEO.title;
  const description = props.description || DEFAULT_SEO.description;
  const image = props.image || DEFAULT_SEO.image;
  const url = props.slug ? `${baseUrl}${props.slug}` : baseUrl;

  return {
    title,
    description,
    keywords: props.keywords || DEFAULT_SEO.keywords,
    openGraph: {
      title,
      description,
      image,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image,
    },
    canonical: url,
  };
}
