import "server-only";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const appwriteConfig = {
  endpoint: getRequiredEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"),
  projectId: getRequiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"),
  apiKey: getRequiredEnv("APPWRITE_API_KEY"),
  databaseId: "shopsathi",
  bucketId: "products-media",
  collections: {
    categories: "categories",
    products: "products",
    siteSettings: "site_settings",
    heroSlides: "hero_slides",
    testimonials: "testimonials",
    faqs: "faqs",
  },
} as const;
