# Shopsathi V1

`shopsathi-v1` is the clean frontend-only rebuild of the existing `shopsathi` storefront.

The original `shopsathi` repo in this workspace is used as a product reference only. Its code structure is not the template for this rebuild.

## Current Status

Phase 1 is in progress.

Completed in this phase:

- migration plan
- canonical frontend domain model
- mock-data contracts and seed content
- target project structure baseline
- project-specific app shell replacing the default Next.js scaffold

## Rebuild Goal

Recreate the storefront experience with:

- homepage
- product catalog
- product modal
- cart drawer
- WhatsApp-first ordering flow

But do it with:

- mock data only
- clean feature boundaries
- maintainable types and helpers
- no Sanity or backend coupling

## Working Rules

- preserve product behavior, not old repo structure
- keep route files thin
- keep product logic outside large UI files
- use one canonical frontend data model
- use mock data as the only data source until later phases require otherwise

## Proposed Structure

```text
app/
src/
  data/
    mock/
  features/
    cart/
    catalog/
    home/
    product/
    shared/
  lib/
  types/
docs/
```

## Next Phase 1 Tasks

1. Start wiring feature modules against the canonical types.
2. Expand the mock dataset only where real UI needs it.
3. Replace the current placeholder landing screen with the real app shell in Phase 2.

## Commands

```bash
npm run dev
npm run lint
```
