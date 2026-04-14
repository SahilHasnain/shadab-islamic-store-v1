# Shopsathi V1 Migration Plan

## Goal

Rebuild the current `shopsathi` app into `shopsathi-v1` as a frontend-only Next.js application using mock data, while keeping the product experience intact and significantly improving code quality, maintainability, and structure.

This is not a code copy exercise.

The old `shopsathi` repo will be treated as:

- product reference
- content reference
- interaction reference

The new `shopsathi-v1` repo will be treated as:

- clean implementation
- frontend-only app
- mock-data-driven product prototype
- maintainable baseline for future extension

## Principles

- Do not copy Sanity, CMS, or backend coupling into `v1`
- Do not carry over messy component boundaries
- Keep one canonical frontend data model
- Prefer small feature modules over large shared dumping grounds
- Keep route files thin and business logic outside UI-heavy components
- Use mock data shaped exactly for the UI
- Preserve product behavior, not source code structure

## Source Product Scope

The current `shopsathi` app contains these main product areas:

1. Homepage
2. Product listing page
3. Product modal
4. Cart drawer
5. WhatsApp ordering flow
6. Header, footer, floating WhatsApp entry points

These will be carried into `shopsathi-v1`.

The following will not be migrated into `shopsathi-v1`:

- Sanity Studio
- GROQ queries
- CMS fetch logic
- seed scripts
- runtime backend dependencies
- mixed normalization/fetch/render patterns

## Target Architecture

Proposed high-level structure:

```text
app/
  (routes)

src/
  components/
    ui/
    layout/
  features/
    home/
    catalog/
    product/
    cart/
    shared/
  data/
    mock/
  lib/
    utils/
    constants/
  types/
```

Rules for this structure:

- `components/ui` only for generic reusable UI primitives
- `features/*` owns product-specific UI and logic
- `data/mock` is the single source of mock content
- `types` contains clean app-facing types only
- `lib/utils` contains pure helpers, not app orchestration

## Phase Plan

### Phase 1: Product Mapping And Foundation

Objective:
Understand the existing app completely and establish the clean foundation for the rebuild.

Scope:

- map existing screens, sections, flows, and interactions
- define the new folder structure
- define the canonical data types
- define mock-data shape
- define migration constraints and naming conventions
- replace boilerplate app metadata and project docs

Deliverables:

- migration plan doc
- architecture outline
- type model for products, categories, testimonials, FAQs, settings, cart items
- mock data contract
- updated project README direction

Exit criteria:

- we know exactly what will be rebuilt
- we know exactly what will not be rebuilt
- data contracts are stable enough to start UI work

### Phase 2: App Shell And Shared System

Objective:
Build the reusable app foundation before feature pages.

Scope:

- global layout
- typography and design tokens
- header
- footer
- shared buttons and UI primitives
- floating WhatsApp action
- base page containers and spacing system

Deliverables:

- coherent visual system
- reusable shared components
- consistent responsive shell

Exit criteria:

- pages can be assembled without layout duplication
- shared UI primitives are good enough to support the rest of the build

### Phase 3: Homepage Clone With Mock Data

Objective:
Rebuild the homepage experience using clean feature modules and mock content.

Scope:

- hero section
- featured products section
- about section
- testimonials section
- FAQ section
- map/contact section
- homepage CTA flows

Deliverables:

- complete homepage based on mock data
- homepage feature folder with section-level organization

Exit criteria:

- homepage is visually and functionally aligned with the reference app
- homepage does not depend on backend data fetching

### Phase 4: Catalog, Product Modal, And Filtering

Objective:
Rebuild the product browsing experience with clean local state and URL sync.

Scope:

- products listing page
- category filtering
- price filtering
- stock filtering
- sorting
- search
- product cards
- product quick-view modal
- variant selection
- gallery behavior
- pricing helpers

Deliverables:

- complete catalog page
- pure helper layer for filtering and pricing
- product modal split into manageable sub-parts where needed

Exit criteria:

- filters behave correctly
- modal logic is isolated and understandable
- no duplicated filtering pipelines

### Phase 5: Cart, WhatsApp Flow, Cleanup, And Hardening

Objective:
Finish the transactional frontend flow and stabilize the codebase.

Scope:

- cart state
- cart drawer
- WhatsApp cart message generation
- add-to-cart flow from cards/modal
- cleanup pass
- naming consistency pass
- dead-code removal
- lint verification
- final documentation

Deliverables:

- working cart flow
- working WhatsApp order flow
- cleaner docs and maintainable codebase

Exit criteria:

- app feels complete as a frontend prototype
- architecture is coherent
- code is ready for future backend integration if needed

## Phase Order Rationale

This order is intentional:

- Phase 1 prevents blind copying
- Phase 2 creates reusable foundations
- Phase 3 validates the visual direction early
- Phase 4 handles the heaviest logic after the foundation is stable
- Phase 5 closes the loop with the transactional flow and cleanup

## Key Refactor Decisions

These decisions should remain fixed unless we discover a strong reason to change them:

- `shopsathi-v1` will use mock data, not temporary API simulation unless clearly needed
- product logic will be extracted into helpers instead of living inside page components
- the new implementation will not mirror the old file structure
- oversized components from the old repo will be split during rebuild, especially catalog and modal flows
- duplication will be removed even if the old app tolerated it

## Known Risks

- cloning visuals too literally may accidentally reproduce bad structure
- the current product modal has too many responsibilities, so it must be rebuilt carefully
- filter behavior and WhatsApp messaging need exact functional parity even if implementation changes
- if mock data is poorly designed, maintainability will degrade again quickly

## Working Definition Of Done

`shopsathi-v1` will be considered a successful first rebuild when:

- all key storefront screens are rebuilt
- all content comes from local mock data
- there is no Sanity or backend coupling
- the codebase has clear feature boundaries
- major logic is testable or at least isolated into pure helpers
- onboarding into the repo is meaningfully easier than the current `shopsathi` repo

## Immediate Next Step

Start with Phase 1 execution:

1. define the canonical frontend data models
2. define the mock data structure
3. create the target folder structure
4. replace the boilerplate `shopsathi-v1` app shell with the new project baseline
