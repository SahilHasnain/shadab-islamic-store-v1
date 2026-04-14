# Backend Access Layer

This folder contains the Appwrite read layer for `shopsathi-v1`.

## Structure

- `appwrite/`
  low-level Appwrite configuration, request helpers, and storage URL helpers
- `mappers/`
  converts Appwrite document shapes into frontend-safe application types
- `repositories/`
  read-focused domain access functions for storefront features

## Rules

- UI components should not build raw Appwrite URLs
- UI components should not consume Appwrite document shapes directly
- repositories should return app-facing types from `src/types`
- API keys stay server-only

## Current Scope

Phase B is read-only scaffolding.

Implemented:

- Appwrite config
- REST request helper
- file URL resolver
- category repository
- product repository
- settings, hero, testimonial, and FAQ repositories

Not implemented yet:

- storefront route integration
- admin auth
- write operations
- uploads
