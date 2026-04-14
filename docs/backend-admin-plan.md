# Shopsathi V1 Backend And Admin Integration Plan

## Goal

Add a real backend and admin panel to `shopsathi-v1` using:

- Appwrite for backend services
- a custom admin panel under `/admin`

This plan uses the old `shopsathi` repo as the reference for:

- content model
- product management needs
- settings structure
- current CMS usage patterns in Sanity

The new implementation should not reproduce the old mixed frontend/CMS coupling. Backend and admin must be integrated through clear application boundaries.

## Product Objective

After this integration, `shopsathi-v1` should support:

- real product CRUD
- real category CRUD
- real site settings management
- hero slider management
- testimonial management
- FAQ management
- image uploads
- admin authentication and authorization
- frontend data reading from Appwrite instead of local mock data

## Reference From Old Repo

The old repo currently uses Sanity for:

- `product`
- `category`
- `settings`
- `testimonial`
- `faq`

Important reference points:

- `studio/schemas/product.ts`
- `studio/schemas/category.ts`
- `studio/schemas/siteSettings.ts`
- `studio/schemas/testimonial.ts`
- `studio/schemas/faq.ts`

These schemas define the current content requirements, but the new backend model should be adapted to frontend needs rather than copied blindly.

## Architecture Direction

Target architecture:

```text
shopsathi-v1/
  app/
    admin/
    api/
  src/
    features/
      admin/
      catalog/
      home/
      cart/
      product/
    backend/
      appwrite/
      repositories/
      mappers/
    types/
```

Rules:

- frontend UI should not call raw Appwrite APIs directly from many places
- create a backend access layer inside `src/backend/`
- keep Appwrite document shapes separate from frontend view models
- use mappers to convert backend documents into app-facing types
- `/admin` should have its own feature area and route group

## Appwrite Services To Use

Recommended Appwrite services:

- `Auth`
  for admin login/session handling
- `Databases`
  for products, categories, FAQs, testimonials, settings, slider entries
- `Storage`
  for product/category/settings images
- `Functions` optional later
  only if image processing, slug validation, sync jobs, or server-side workflows become necessary

## Core Data Model

### 1. Categories

Purpose:

- organize products
- control storefront browsing
- support menu/category chips

Suggested fields:

- `title`
- `slug`
- `description`
- `displayOrder`
- `featuredImageIds` or `featuredImages`
- `isActive`

Notes:

- old Sanity schema already has `title`, `slug`, `order`, `featuredImages`
- add `description` in Appwrite because the current frontend uses it directly

### 2. Products

Purpose:

- main storefront inventory

Suggested fields:

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
- `isActive`
- `createdAt`
- `updatedAt`

Suggested nested option model:

- `options`
  array of objects
  each object:
  - `group`
  - `value`
  - `priceOverride`
  - `imageId`

Notes:

- old Sanity `price` is stored as string, but Appwrite should store numeric pricing
- use numeric price in backend and format only in frontend
- `shortDescription` should be added explicitly because the new frontend depends on it

### 3. Site Settings

Purpose:

- global storefront content and contact configuration

Suggested fields:

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

Notes:

- treat settings as a singleton document
- do not allow multiple settings documents

### 4. Hero Slides

Purpose:

- homepage hero content management

Suggested fields:

- `eyebrow`
- `headline`
- `subheading`
- `desktopImageId`
- `mobileImageId`
- `ctaLabel`
- `ctaHref`
- `displayOrder`
- `isActive`

Notes:

- old Sanity model references a category for CTA destination
- for Appwrite, prefer storing a direct href or a structured target
- frontend should resolve href cleanly without joining CMS-specific reference logic

### 5. Testimonials

Suggested fields:

- `name`
- `role`
- `text`
- `rating`
- `isActive`
- `displayOrder`

### 6. FAQs

Suggested fields:

- `question`
- `answer`
- `isActive`
- `displayOrder`

## Storage Strategy

Use Appwrite Storage buckets:

- `products`
  main images and gallery images
- `categories`
  featured category images
- `branding`
  logo, business image, hero assets

Rules:

- store Appwrite file ids in database documents
- frontend should resolve image URLs through helper functions
- never hardcode Appwrite storage URL construction inside UI components

## Admin Authentication And Roles

### Auth Model

Use Appwrite Auth with email/password for admin users.

Suggested initial roles:

- `owner`
  full access
- `admin`
  content management
- `editor`
  optional later for non-destructive content edits

### Access Rules

- public users can read only the storefront-safe collections
- only authenticated admins can access `/admin`
- write permissions must be restricted by Appwrite collection permissions
- admin route should verify session server-side where possible

## `/admin` Scope

The custom admin panel should cover:

1. Dashboard
2. Products
3. Categories
4. Hero Slides
5. Testimonials
6. FAQs
7. Site Settings
8. Media upload flows

### Dashboard

Purpose:

- quick status visibility
- counts
- recent edits
- stock summary

Suggested widgets:

- total products
- featured products
- out-of-stock products
- total categories
- pending content health flags

### Products Admin

Required features:

- list products
- search products
- filter by category
- filter by stock state
- create product
- edit product
- delete or archive product
- upload main image and gallery
- manage option groups and option values

### Categories Admin

Required features:

- list categories
- reorder categories
- upload featured images
- manage slug/title/description

### Settings Admin

Required features:

- singleton form
- contact details
- WhatsApp defaults
- logo/business image upload
- map URL
- homepage section title
- new product threshold

### Content Admin

Required features:

- hero slide CRUD with ordering
- testimonial CRUD with ordering
- FAQ CRUD with ordering

## Frontend Integration Strategy

Move from mock data to backend in phases.

### Phase A: Backend Foundation

- set up Appwrite project
- create databases, collections, attributes, indexes
- create storage buckets
- create admin auth

### Phase B: Backend Access Layer

- add Appwrite client setup
- add server/client env handling
- add repositories:
  - `productsRepository`
  - `categoriesRepository`
  - `settingsRepository`
  - `heroRepository`
  - `testimonialRepository`
  - `faqRepository`
- add mappers from Appwrite docs to frontend types

### Phase C: Read Integration

- replace `src/data/mock` reads with repository reads
- keep a mock fallback only if explicitly needed for local development
- update homepage and catalog routes to fetch live data

### Phase D: Admin Panel

- build `/admin/login`
- build protected `/admin` layout
- add CRUD screens one area at a time

### Phase E: Write Integration And Hardening

- real create/update/delete flows
- upload flows
- validation
- permission review
- loading/error states

## Repository Layer Design

Example direction:

```text
src/backend/appwrite/
  client.ts
  config.ts
  storage.ts

src/backend/repositories/
  products.ts
  categories.ts
  settings.ts
  hero-slides.ts
  testimonials.ts
  faqs.ts

src/backend/mappers/
  product-mapper.ts
  category-mapper.ts
  settings-mapper.ts
```

Principles:

- repositories return frontend-safe types
- mappers isolate backend document differences
- UI should consume typed app models, not Appwrite document objects

## Validation Rules

Validation should exist in two places:

- admin form validation in frontend
- backend-side schema/permission enforcement in Appwrite

Critical validations:

- unique slugs
- required product/category/settings fields
- numeric price integrity
- valid image requirements for hero and products
- no duplicate product option group/value combinations

## Slug Strategy

Slug rules:

- generated from title/name initially
- editable with caution
- must remain unique within collection

Recommendation:

- use frontend helper for slug generation
- enforce uniqueness before save
- if collisions happen, append suffixes deterministically

## Image Handling Notes

For admin UX:

- upload first
- preview immediately
- save file id into document
- allow replacement/removal

For storefront UX:

- provide a single image URL resolver
- support main image plus gallery
- support option-specific image overrides for products

## Security Considerations

- do not expose admin writes directly from unprotected client contexts
- keep admin session checks strict
- verify collection permissions carefully before shipping
- avoid storing secrets in client env
- if needed, use server actions or route handlers as controlled write boundaries

## Suggested Delivery Phases

### Phase 1: Appwrite Project Setup

- project
- env vars
- collections
- attributes
- indexes
- buckets
- admin auth

### Phase 2: Read-Only Storefront Integration

- repository layer
- live homepage reads
- live catalog reads
- image resolution

### Phase 3: Admin Auth And Layout

- `/admin/login`
- protected `/admin`
- dashboard shell
- role checks

### Phase 4: Product And Category Management

- products CRUD
- categories CRUD
- image uploads
- ordering controls

### Phase 5: Settings And Content Management

- site settings singleton
- hero slides
- testimonials
- FAQs

### Phase 6: Cleanup And Production Hardening

- permissions audit
- error handling
- empty states
- optimistic updates where useful
- docs

## Success Criteria

This integration is successful when:

- storefront reads live data from Appwrite
- `/admin` is protected and usable
- non-technical content updates no longer require code changes
- products, categories, hero slides, settings, FAQs, and testimonials are manageable from admin
- image uploads are stable
- frontend code remains feature-oriented and maintainable

## Immediate Next Step

Start with backend foundation planning in implementation terms:

1. define Appwrite collection names and field names exactly
2. define storage bucket names exactly
3. define required env vars
4. scaffold `src/backend/appwrite/` and repository interfaces
5. create `/admin` route shell and authentication plan
