# Appwrite Phase A Spec

## Status

Phase A setup has been executed successfully against the current Appwrite project.

Created resources:

- database: `shopsathi`
- bucket: `products-media`
- collections:
  - `categories`
  - `products`
  - `site_settings`
  - `hero_slides`
  - `testimonials`
  - `faqs`

Created indexes:

- `categories.slug_unique`
- `categories.display_order_index`
- `products.slug_unique`
- `products.category_index`
- `products.featured_index`
- `products.stock_index`
- `hero_slides.display_order_index`
- `testimonials.display_order_index`
- `faqs.display_order_index`

## Database

- `shopsathi`

## Storage Buckets

- `products-media`

Current note:

- the active Appwrite plan allowed only one additional bucket during setup
- Phase A is using `products-media` as the shared storefront media bucket for products, categories, branding, and hero assets
- bucket separation can be revisited later if the Appwrite plan changes

Appwrite constraint note:

- boolean attributes with default values had to be created as non-required attributes because the current Appwrite setup rejected `required + default` on those fields

## Collections

### `categories`

- `title`
- `slug`
- `description`
- `displayOrder`
- `featuredImageIds`
- `isActive`

Indexes:

- `slug_unique`
- `display_order_index`

### `products`

- `name`
- `slug`
- `categoryId`
- `shortDescription`
- `basePrice`
- `discountType`
- `discountValue`
- `inStock`
- `featured`
- `mainImageId`
- `galleryImageIds`
- `optionsJson`
- `isActive`

Indexes:

- `slug_unique`
- `category_index`
- `featured_index`
- `stock_index`

### `site_settings`

- `businessName`
- `description`
- `logoImageId`
- `businessImageId`
- `featuredProductsTitle`
- `whatsappNumber`
- `whatsappMessage`
- `instagramHandle`
- `mapEmbedUrl`
- `newProductThresholdDays`

### `hero_slides`

- `eyebrow`
- `headline`
- `subheading`
- `desktopImageId`
- `mobileImageId`
- `ctaLabel`
- `ctaHref`
- `displayOrder`
- `isActive`

Indexes:

- `display_order_index`

### `testimonials`

- `name`
- `role`
- `text`
- `rating`
- `displayOrder`
- `isActive`

Indexes:

- `display_order_index`

### `faqs`

- `question`
- `answer`
- `displayOrder`
- `isActive`

Indexes:

- `display_order_index`

## Setup Script

Script path:

- `scripts/setup-appwrite-phase-a.mjs`

Expected env vars from `.env.local`:

- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`

Run command:

```bash
node scripts/setup-appwrite-phase-a.mjs
```
