import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.local");

function loadEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      if (index === -1) return null;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      return [key, value];
    })
    .filter(Boolean);

  return Object.fromEntries(entries);
}

const env = loadEnvFile(envPath);

const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error("Missing Appwrite configuration in .env.local");
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
};

const resources = {
  databaseId: "shopsathi",
  buckets: [
    { bucketId: "products-media", name: "Storefront Media" },
  ],
  collections: [
    {
      collectionId: "categories",
      name: "Categories",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "title", size: 255, required: true },
        { type: "string", key: "slug", size: 255, required: true },
        { type: "string", key: "description", size: 1000, required: true },
        { type: "integer", key: "displayOrder", required: true, min: 1, max: 9999 },
        { type: "string", key: "featuredImageIds", size: 2000, required: false, array: true },
        { type: "boolean", key: "isActive", required: false, default: true },
      ],
      indexes: [
        { key: "slug_unique", type: "unique", attributes: ["slug"], orders: ["ASC"] },
        {
          key: "display_order_index",
          type: "key",
          attributes: ["displayOrder"],
          orders: ["ASC"],
        },
      ],
    },
    {
      collectionId: "products",
      name: "Products",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "name", size: 255, required: true },
        { type: "string", key: "slug", size: 255, required: true },
        { type: "string", key: "categoryId", size: 255, required: true },
        { type: "string", key: "shortDescription", size: 2000, required: true },
        { type: "double", key: "basePrice", required: true, min: 0, max: 1000000 },
        { type: "string", key: "discountType", size: 20, required: false },
        { type: "double", key: "discountValue", required: false, min: 0, max: 1000000 },
        { type: "boolean", key: "inStock", required: false, default: true },
        { type: "boolean", key: "featured", required: false, default: false },
        { type: "string", key: "mainImageId", size: 255, required: false },
        { type: "string", key: "galleryImageIds", size: 4000, required: false, array: true },
        { type: "string", key: "optionsJson", size: 20000, required: false },
        { type: "boolean", key: "isActive", required: false, default: true },
      ],
      indexes: [
        { key: "slug_unique", type: "unique", attributes: ["slug"], orders: ["ASC"] },
        { key: "category_index", type: "key", attributes: ["categoryId"], orders: ["ASC"] },
        { key: "featured_index", type: "key", attributes: ["featured"], orders: ["ASC"] },
        { key: "stock_index", type: "key", attributes: ["inStock"], orders: ["ASC"] },
      ],
    },
    {
      collectionId: "site_settings",
      name: "Site Settings",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "businessName", size: 255, required: true },
        { type: "string", key: "description", size: 2000, required: true },
        { type: "string", key: "logoImageId", size: 255, required: false },
        { type: "string", key: "businessImageId", size: 255, required: false },
        { type: "string", key: "featuredProductsTitle", size: 255, required: false },
        { type: "string", key: "whatsappNumber", size: 50, required: true },
        { type: "string", key: "whatsappMessage", size: 1000, required: true },
        { type: "string", key: "instagramHandle", size: 255, required: false },
        { type: "string", key: "mapEmbedUrl", size: 2000, required: false },
        { type: "integer", key: "newProductThresholdDays", required: true, min: 0, max: 365 },
      ],
      indexes: [],
    },
    {
      collectionId: "hero_slides",
      name: "Hero Slides",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "eyebrow", size: 255, required: false },
        { type: "string", key: "headline", size: 500, required: true },
        { type: "string", key: "subheading", size: 2000, required: false },
        { type: "string", key: "desktopImageId", size: 255, required: true },
        { type: "string", key: "mobileImageId", size: 255, required: false },
        { type: "string", key: "ctaLabel", size: 255, required: true },
        { type: "string", key: "ctaHref", size: 500, required: true },
        { type: "integer", key: "displayOrder", required: true, min: 1, max: 9999 },
        { type: "boolean", key: "isActive", required: false, default: true },
      ],
      indexes: [
        {
          key: "display_order_index",
          type: "key",
          attributes: ["displayOrder"],
          orders: ["ASC"],
        },
      ],
    },
    {
      collectionId: "testimonials",
      name: "Testimonials",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "name", size: 255, required: true },
        { type: "string", key: "role", size: 255, required: false },
        { type: "string", key: "text", size: 4000, required: true },
        { type: "integer", key: "rating", required: false, min: 1, max: 5 },
        { type: "integer", key: "displayOrder", required: true, min: 1, max: 9999 },
        { type: "boolean", key: "isActive", required: false, default: true },
      ],
      indexes: [
        {
          key: "display_order_index",
          type: "key",
          attributes: ["displayOrder"],
          orders: ["ASC"],
        },
      ],
    },
    {
      collectionId: "faqs",
      name: "FAQs",
      permissions: ['read("any")'],
      attributes: [
        { type: "string", key: "question", size: 1000, required: true },
        { type: "string", key: "answer", size: 5000, required: true },
        { type: "integer", key: "displayOrder", required: true, min: 1, max: 9999 },
        { type: "boolean", key: "isActive", required: false, default: true },
      ],
      indexes: [
        {
          key: "display_order_index",
          type: "key",
          attributes: ["displayOrder"],
          orders: ["ASC"],
        },
      ],
    },
  ],
};

async function request(method, route, body) {
  const response = await fetch(`${endpoint}${route}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  const errorText = await response.text();
  throw new Error(`${method} ${route} failed: ${response.status} ${errorText}`);
}

async function exists(route) {
  try {
    await request("GET", route);
    return true;
  } catch (error) {
    if (String(error).includes("404")) return false;
    throw error;
  }
}

async function ensureDatabase() {
  const route = `/databases/${resources.databaseId}`;
  if (await exists(route)) {
    console.log(`Database ${resources.databaseId} already exists`);
    return;
  }

  await request("POST", "/databases", {
    databaseId: resources.databaseId,
    name: "Shopsathi",
    enabled: true,
  });
  console.log(`Created database ${resources.databaseId}`);
}

async function ensureBucket(bucket) {
  const route = `/storage/buckets/${bucket.bucketId}`;
  if (await exists(route)) {
    console.log(`Bucket ${bucket.bucketId} already exists`);
    return;
  }

  await request("POST", "/storage/buckets", {
    bucketId: bucket.bucketId,
    name: bucket.name,
    permissions: ['read("any")'],
    fileSecurity: false,
    enabled: true,
    maximumFileSize: 30000000,
    allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "svg"],
    compression: "none",
    encryption: true,
    antivirus: true,
  });
  console.log(`Created bucket ${bucket.bucketId}`);
}

async function ensureCollection(collection) {
  const route = `/databases/${resources.databaseId}/collections/${collection.collectionId}`;
  if (await exists(route)) {
    console.log(`Collection ${collection.collectionId} already exists`);
    return;
  }

  await request("POST", `/databases/${resources.databaseId}/collections`, {
    collectionId: collection.collectionId,
    name: collection.name,
    permissions: collection.permissions,
    documentSecurity: false,
    enabled: true,
  });
  console.log(`Created collection ${collection.collectionId}`);
}

async function ensureAttribute(collectionId, attribute) {
  const baseRoute = `/databases/${resources.databaseId}/collections/${collectionId}/attributes`;

  const keyRoute = `${baseRoute}/${attribute.key}`;
  if (await exists(keyRoute)) {
    console.log(`Attribute ${collectionId}.${attribute.key} already exists`);
    return;
  }

  if (attribute.type === "string") {
    await request("POST", `${baseRoute}/string`, attribute);
  } else if (attribute.type === "integer") {
    await request("POST", `${baseRoute}/integer`, attribute);
  } else if (attribute.type === "double") {
    await request("POST", `${baseRoute}/float`, attribute);
  } else if (attribute.type === "boolean") {
    await request("POST", `${baseRoute}/boolean`, attribute);
  } else {
    throw new Error(`Unsupported attribute type ${attribute.type}`);
  }

  console.log(`Created attribute ${collectionId}.${attribute.key}`);
}

async function ensureIndex(collectionId, index) {
  const route = `/databases/${resources.databaseId}/collections/${collectionId}/indexes/${index.key}`;
  if (await exists(route)) {
    console.log(`Index ${collectionId}.${index.key} already exists`);
    return;
  }

  await request("POST", `/databases/${resources.databaseId}/collections/${collectionId}/indexes`, {
    key: index.key,
    type: index.type,
    attributes: index.attributes,
    orders: index.orders,
  });
  console.log(`Created index ${collectionId}.${index.key}`);
}

async function main() {
  console.log("Starting Appwrite Phase A setup...");
  await ensureDatabase();

  for (const bucket of resources.buckets) {
    await ensureBucket(bucket);
  }

  for (const collection of resources.collections) {
    await ensureCollection(collection);
  }

  for (const collection of resources.collections) {
    for (const attribute of collection.attributes) {
      await ensureAttribute(collection.collectionId, attribute);
    }
  }

  for (const collection of resources.collections) {
    for (const index of collection.indexes) {
      await ensureIndex(collection.collectionId, index);
    }
  }

  console.log("Appwrite Phase A setup complete.");
  console.log(JSON.stringify(resources, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
