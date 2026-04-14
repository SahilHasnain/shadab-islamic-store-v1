import type {
  Category,
  FAQItem,
  HeroSlide,
  Product,
  SiteContent,
  SiteSettings,
  Testimonial,
} from "@/src/types";

export const mockSettings: SiteSettings = {
  businessName: "Shopsathi",
  description:
    "A handcrafted storefront for modest essentials, gifting, and devotional lifestyle products.",
  logoPath: "/images/logo.png",
  businessImage: "/images/person.jpg",
  featuredProductsTitle: "Featured Picks",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923075398!2d77.0688992503568!3d28.527280343964497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c1f3d5f555%3A0x4a513d0f24f0d5f2!2sNew%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  contact: {
    whatsappNumber: "919142047299",
    whatsappMessage: "Salam, I would like to place an order from Shopsathi.",
    instagramHandle: "shopsathi.store",
  },
  newProductThresholdDays: 15,
};

export const mockHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    eyebrow: "Festive Essentials",
    headline: "Curated modest wear and gifting pieces for everyday devotion.",
    subheading:
      "Build the storefront around trust, clarity, and WhatsApp-first ordering instead of CMS complexity.",
    desktopImage: "/images/amama6.png",
    mobileImage: "/images/amama3.png",
    ctaLabel: "Browse Products",
    ctaHref: "/products",
  },
  {
    id: "hero-2",
    eyebrow: "Signature Collection",
    headline: "Discover bestsellers selected for gifting, occasion wear, and daily use.",
    subheading:
      "Browse standout pieces across caps, wraps, and fragrance essentials with a simple WhatsApp-first ordering flow.",
    desktopImage: "/images/barkati-topi.webp",
    mobileImage: "/images/topi1.png",
    ctaLabel: "Explore Structure",
    ctaHref: "/#featured-products",
  },
];

export const mockCategories: Category[] = [
  {
    id: "cat-topi",
    slug: "topi",
    title: "Topi",
    description: "Prayer caps and formal headwear in multiple finishes.",
    featuredImages: ["/images/topi1.png", "/images/topi2.png"],
  },
  {
    id: "cat-amama",
    slug: "amama",
    title: "Amama",
    description: "Premium wraps and ceremonial headwear styles.",
    featuredImages: ["/images/amama1.png", "/images/amama6.png"],
  },
  {
    id: "cat-attar",
    slug: "attar",
    title: "Attar",
    description: "Classic fragrance pieces for gifting and everyday use.",
    featuredImages: ["/images/attar.webp", "/images/dates.webp"],
  },
];

export const mockCatalogProducts: Product[] = [
  {
    id: "prod-barkati-topi",
    slug: "barkati-topi",
    name: "Barkati Topi",
    categorySlug: "topi",
    basePrice: 499,
    image: "/images/barkati-topi.webp",
    gallery: ["/images/barkati-topi.webp", "/images/topi1.png", "/images/topi2.png"],
    shortDescription: "Structured ceremonial cap with clean silhouette and gift-ready finish.",
    inStock: true,
    featured: true,
    createdAt: "2026-04-06T10:00:00.000Z",
    discountType: "percentage",
    discountValue: 10,
    options: [
      {
        group: "Size",
        values: [{ value: "M" }, { value: "L" }, { value: "XL" }],
      },
      {
        group: "Color",
        values: [
          { value: "Ivory", image: "/images/topi1.png" },
          { value: "Sand", image: "/images/topi2.png" },
        ],
      },
    ],
  },
  {
    id: "prod-amama-royal",
    slug: "royal-amama-wrap",
    name: "Royal Amama Wrap",
    categorySlug: "amama",
    basePrice: 1299,
    image: "/images/amama6.png",
    gallery: ["/images/amama6.png", "/images/amama5.png", "/images/amama3.png"],
    shortDescription: "Long-form ceremonial wrap designed for elevated occasion wear.",
    inStock: true,
    featured: true,
    createdAt: "2026-04-11T10:00:00.000Z",
    discountType: "fixed",
    discountValue: 100,
    options: [
      {
        group: "Fabric",
        values: [{ value: "Cotton" }, { value: "Silk Blend", priceOverride: 1499 }],
      },
    ],
  },
  {
    id: "prod-oud-attar",
    slug: "oud-attar",
    name: "Oud Attar",
    categorySlug: "attar",
    basePrice: 799,
    image: "/images/attar.webp",
    gallery: ["/images/attar.webp", "/images/dates.webp"],
    shortDescription: "Deep fragrance profile for evening use and premium gifting.",
    inStock: false,
    featured: true,
    createdAt: "2026-03-28T10:00:00.000Z",
  },
  {
    id: "prod-signature-topi",
    slug: "signature-topi",
    name: "Signature Topi",
    categorySlug: "topi",
    basePrice: 349,
    image: "/images/topi-set.png",
    gallery: ["/images/topi-set.png", "/images/topi1.png"],
    shortDescription: "Everyday prayer cap with a softer structure and broad appeal.",
    inStock: true,
    featured: false,
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "prod-heritage-amama",
    slug: "heritage-amama",
    name: "Heritage Amama",
    categorySlug: "amama",
    basePrice: 999,
    image: "/images/amama1.png",
    gallery: ["/images/amama1.png", "/images/amama2.png", "/images/amama.jpg"],
    shortDescription: "Balanced ceremonial wrap for daily use and special gatherings.",
    inStock: true,
    featured: false,
    createdAt: "2026-02-18T10:00:00.000Z",
  },
];

export const mockFeaturedProducts = mockCatalogProducts.filter(
  (product) => product.featured,
);

export const mockTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Aamir Khan",
    role: "Returning Customer",
    text: "The catalog is simple, the WhatsApp ordering flow is quick, and the product presentation feels trustworthy.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Zehra Fatima",
    role: "Gift Buyer",
    text: "The storefront makes it easy to compare items without needing a complicated checkout stack.",
    rating: 5,
  },
];

export const mockFaqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Is Shopsathi V1 connected to a backend?",
    answer: "This storefront currently runs with local product content and a WhatsApp-first ordering flow.",
  },
  {
    id: "faq-2",
    question: "Why not copy the old code directly?",
    answer: "The storefront experience stays the same, but the codebase has been reorganized to keep the frontend cleaner and easier to maintain.",
  },
  {
    id: "faq-3",
    question: "Will WhatsApp ordering stay in the new version?",
    answer: "Yes. It is part of the core product flow and will remain a first-class path in later phases.",
  },
];

export const mockSiteContent: SiteContent = {
  settings: mockSettings,
  heroSlides: mockHeroSlides,
  categories: mockCategories,
  featuredProducts: mockFeaturedProducts,
  catalogProducts: mockCatalogProducts,
  testimonials: mockTestimonials,
  faqs: mockFaqs,
};
