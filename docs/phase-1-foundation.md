# Phase 1 Foundation

## Outcome

Phase 1 establishes the non-negotiable base for the rebuild:

- stable frontend types
- local mock data
- predictable folder boundaries
- project-level conventions before UI implementation expands

## Canonical Data Contracts

The frontend rebuild will use a single app-facing model for:

- site settings
- hero slides
- categories
- products
- product options
- testimonials
- FAQs
- cart items

These contracts live in `src/types/storefront.ts`.

## Mock Data Policy

Mock data is not temporary filler. It is the working product content source for the rebuild.

Rules:

- data should be realistic enough to exercise UI states
- data should support variants, stock states, discount states, and category filters
- data shape should match UI needs directly
- avoid recreating backend response shapes

## Folder Ownership

- `src/types`: app-facing types only
- `src/data/mock`: seeded storefront content
- `src/lib`: pure helpers and shared constants
- `src/features/*`: product-specific UI and logic by domain

## Intentionally Deferred

These are not Phase 1 work:

- full homepage implementation
- real catalog page
- cart interactions
- modal behavior
- URL-synced filters
- backend integration

## Phase 1 Exit Check

Phase 1 is done when:

- the repo no longer looks like a starter template
- the app has a clear architecture direction
- mock content and types are ready for feature implementation
- future phases can build without revisiting the data model first
