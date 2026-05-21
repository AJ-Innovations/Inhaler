# Spirox Application Architecture Rules

This document defines the strict, mandatory architecture and coding standards for the `spirox` Next.js application. All developers and AI agents must adhere to these guidelines to ensure maximum scalability, maintainability, and high-level security.

---

## 1. Directory Structure & Layers (Feature-Sliced Design)

The `src/` directory is strictly divided into the following layers. Dependencies can only flow **inwards** (a layer can only import from layers below it, never above it).

```text
src/
├── app/            # 1. Routing Layer (Top Level)
├── features/       # 2. Business Logic Layer
├── components/     # 3. Shared UI Layer
├── lib/            # 4. Infrastructure & Utilities Layer
├── types/          # 5. Global Types Layer
└── store/          # 6. Global State (Optional)
```

### Layer Details

#### `src/app/` (Routing Layer)

- **Responsibility:** Next.js pages, layouts, loading, and error states.
- **Rules:** Contains almost zero business logic. Simply imports components from `features/` and renders them.

#### `src/features/` (Business Logic Layer)

- **Responsibility:** Domain-specific modules (e.g., `auth`, `profile`, `journal`).
- **Internal Feature Structure:**
  - `components/`: UI specific to the feature. No business logic.
  - `hooks/`: Custom React hooks containing the business logic and state.
  - `api/`: API calls (Supabase, external REST, etc.).
  - `types/`: Types specific to the feature.
  - `utils/`: Feature-specific helpers.
  - `data/`: Static mocks and constants.
  - `index.tsx`: The ONLY public API barrel file for the feature.
- **Rules:** Features are **isolated**. They should never deep-import from each other. Cross-feature communication happens via the `app/` layer or global state.

#### `src/components/` (Shared UI Layer)

- **Responsibility:** Generic, reusable, "dumb" UI components (e.g., `Button`, `Modal`, `Card`).
- **Rules:** **Zero domain knowledge.** A `Button` should not know about user authentication.

#### `src/lib/` (Infrastructure Layer)

- **Responsibility:** Third-party integrations, global utility functions, API clients.
- **Rules:** No React components belong here.

#### `src/types/` (Global Types Layer)

- **Responsibility:** Interfaces and types shared across the _entire_ application.

---

## 2. Clean Code Standards

To maintain high readability and allow easy onboarding, strict clean code rules apply:

1. **Naming Conventions:**
   - Strict `camelCase` for variables and standard functions.
   - Strict `PascalCase` for React components, interfaces, and types.
   - Strict `UPPER_SNAKE_CASE` for global constants.
2. **Modularity (Single Responsibility):**
   - Functions and components must do exactly one thing. If a component exceeds 150 lines, evaluate it for splitting.
3. **No Magic Strings/Numbers:**
   - Do not hardcode raw values in the UI. All constants, configuration arrays, or mapping dictionaries must be extracted to the `data/` or `utils/` folders.
4. **DRY (Don't Repeat Yourself):**
   - Any logic repeated more than twice must be abstracted into a generic hook or utility function.

---

## 3. Security Standards

As a highly scalable application, security must be baked in from the ground up:

### High Concern

- **Strict Data Validation:** All API inputs, forms, and external data must be strictly validated (e.g., using Zod schemas) before processing or sending to the database.
- **Authentication & Authorization:**
  - Never trust the client. Verify user sessions and roles on the server-side for any protected route or API action.
  - Never expose sensitive user data (passwords, tokens, hidden profile data) to the client payload unnecessarily.

### Medium Concern

- **XSS & Injection Prevention:**
  - Rely on React's default escaping.
  - Use extreme caution with `dangerouslySetInnerHTML`.
  - Always sanitize user-generated content or external URLs before rendering them.

### Low Concern

- **Environment Variables:** Maintain a strict separation between public keys (`NEXT_PUBLIC_`) and secret server keys. Never prefix a secret key with `NEXT_PUBLIC_`.
