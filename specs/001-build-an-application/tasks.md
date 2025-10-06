# Tasks: Sales and Client Management System

**Feature**: 001-build-an-application  
**Input**: Design documents from `/specs/001-build-an-application/`  
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Summary

**Total Tasks**: 65  
**Approach**: Test-Driven Development (TDD)  
**Tech Stack**: Next.js 15 + TypeScript + tRPC + Prisma + PostgreSQL (Docker)

## Task Execution Rules

1. **TDD Mandatory**: All tests (Phase 3.2) MUST be written and MUST FAIL before implementation (Phase 3.3-3.4)
2. **[P] = Parallel**: Tasks marked [P] can run concurrently (different files, no dependencies)
3. **Sequential**: Tasks without [P] must run in order
4. **Commit**: Commit after each task completion
5. **Validation**: Tests must pass before moving to next phase

---

## Phase 3.1: Setup & Configuration

### T001: Initialize Next.js 15 Project [X]
**Files**: `package.json`, `next.config.js`, `tsconfig.json`  
**Description**: Initialize Next.js 15 project with TypeScript and configure for App Router
```bash
npx create-next-app@latest client-product-manager --typescript --tailwind --app --no-src-dir
```
**Acceptance**: 
- Next.js 15.x installed
- TypeScript configured
- App Router structure created
- Initial build passes

---

### T002: Configure Docker Compose for PostgreSQL [X]
**Files**: `docker-compose.yml`, `.env.example`  
**Description**: Create Docker Compose configuration for PostgreSQL 15 development database
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: client_product_manager
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  postgres_data:
```
**Acceptance**:
- Docker Compose file created
- Database starts with `docker-compose up -d`
- Health check passes
- .env.example includes DATABASE_URL

---

### T003: Install Core Dependencies [X]
**Files**: `package.json`  
**Description**: Install and configure core dependencies with version pinning
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@trpc/server": "^10.45.0",
    "@trpc/client": "^10.45.0",
    "@trpc/react-query": "^10.45.0",
    "@tanstack/react-query": "^5.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0-beta",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "bcrypt": "^5.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/bcrypt": "^5.0.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.3.0"
  }
}
```
**Acceptance**:
- All dependencies installed
- No conflicting versions
- npm install completes successfully

---

### T004 [P]: Configure ESLint and Prettier [X]
**Files**: `.eslintrc.json`, `.prettierrc`, `.prettierignore`  
**Description**: Configure linting and formatting tools with Next.js and TypeScript rules
**Acceptance**:
- ESLint configured for Next.js + TypeScript
- Prettier configured with consistent style
- Scripts added to package.json: `lint`, `format`
- No linting errors on initial run

---

### T005 [P]: Setup Project Directory Structure [X]
**Files**: Create folder structure per plan.md  
**Description**: Create complete project structure following Next.js App Router conventions
```
src/
├── server/
│   ├── db.ts
│   ├── auth.ts
│   └── api/
│       ├── trpc.ts
│       ├── root.ts
│       └── routers/
│           ├── auth.ts
│           ├── clients.ts
│           ├── products.ts
│           └── sales.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── clients/...
│   ├── products/...
│   └── sales/...
├── components/
│   ├── ui/
│   ├── forms/
│   ├── layouts/
│   └── data-tables/
├── lib/
│   ├── utils.ts
│   ├── validations.ts
│   └── trpc.ts
└── types/
tests/
├── contract/
├── integration/
└── unit/
prisma/
└── schema.prisma
```
**Acceptance**:
- All directories created
- Placeholder files added
- No import errors

---

### T006: Initialize Prisma with PostgreSQL Schema [X]
**Files**: `prisma/schema.prisma`  
**Description**: Create complete Prisma schema with all 6 entities (User, Client, Address, Product, Sale, SaleItem)
**Schema**: Copy from data-model.md
**Acceptance**:
- Schema file created with all models
- Relations properly defined
- Indexes added per data-model.md
- `npx prisma generate` succeeds

---

### T007: Create Initial Database Migration [X]
**Files**: `prisma/migrations/`  
**Description**: Generate and run initial database migration
```bash
docker-compose up -d
npx prisma migrate dev --name init
```
**Acceptance**:
- Migration files created
- Database schema applied
- Prisma Client generated
- No migration errors

---

### T008 [P]: Configure Tailwind CSS [X]
**Files**: `tailwind.config.ts`, `src/app/globals.css`  
**Description**: Configure Tailwind with responsive breakpoints and custom theme
```typescript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '375px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
        '2xl': '1920px',
      },
    },
  },
}
```
**Acceptance**:
- Tailwind configured with breakpoints
- Global styles updated
- Test page shows Tailwind classes work

---

### T009 [P]: Setup Vitest Configuration [X]
**Files**: `vitest.config.ts`  
**Description**: Configure Vitest for unit and contract tests
**Acceptance**:
- Vitest configured
- Test command in package.json
- Sample test runs successfully

---

### T010 [P]: Setup Playwright Configuration [X]
**Files**: `playwright.config.ts`  
**Description**: Configure Playwright for E2E tests with responsive viewports
**Acceptance**:
- Playwright configured
- Multiple viewport sizes defined (320px, 375px, 768px, 1024px, 1440px, 1920px)
- Test command in package.json

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL**: These tests MUST be written and MUST FAIL before ANY implementation begins.

### Contract Tests (tRPC Procedures)

### T011 [P]: Contract Test - Auth Router (4 procedures) [X]
**Files**: `tests/contract/auth.test.ts`  
**Description**: Write contract tests for all auth procedures (login, signup, logout, getSession)
**Test Cases**:
- login: valid credentials → session, invalid → UNAUTHORIZED
- signup: new user → created, duplicate → CONFLICT
- logout: active session → success
- getSession: authenticated → session, not → null
**Acceptance**:
- All 4 procedures tested
- Tests FAIL (no implementation yet)
- Input/output schemas validated

---

### T012 [P]: Contract Test - Clients Router (5 procedures) [X]
**Files**: `tests/contract/clients.test.ts`  
**Description**: Write contract tests for all client procedures (create, update, delete, getById, list)
**Test Cases**:
- create: valid → created, duplicate CPF → CONFLICT, invalid CPF → validation error
- update: valid → updated, not found → NOT_FOUND
- delete: no sales → success, with sales → CONFLICT
- getById: exists → client, not exists → NOT_FOUND
- list: pagination, search, sorting work
**Acceptance**:
- All 5 procedures tested
- CPF and CEP validation tested
- Tests FAIL (no implementation yet)

---

### T013 [P]: Contract Test - Products Router (6 procedures) [X]
**Files**: `tests/contract/products.test.ts`  
**Description**: Write contract tests for all product procedures (create, update, delete, getById, list, checkStock)
**Test Cases**:
- create: valid → created, invalid price → validation error
- update: valid → updated, not found → NOT_FOUND
- delete: no sales → success, with sales → CONFLICT
- checkStock: sufficient → available=true, insufficient → available=false
- list: pagination, filtering, sorting work
**Acceptance**:
- All 6 procedures tested
- Price and stock validation tested
- Tests FAIL (no implementation yet)

---

### T014 [P]: Contract Test - Sales Router (5 procedures) [X]
**Files**: `tests/contract/sales.test.ts`  
**Description**: Write contract tests for all sales procedures (create, getById, list, filter, getSummary)
**Test Cases**:
- create: valid → created with stock deduction, insufficient stock → CONFLICT
- getById: exists → sale with items, not exists → NOT_FOUND
- list: default 30 days, date filtering, client filtering
- filter: date range, amount range work
- getSummary: returns correct statistics
**Acceptance**:
- All 5 procedures tested
- Stock deduction logic tested
- Price preservation tested
- Tests FAIL (no implementation yet)

---

### Integration Tests (E2E with Playwright)

### T015 [P]: Integration Test - Authentication Flow [X]
**Files**: `tests/integration/auth.spec.ts`  
**Description**: Write E2E test for complete authentication workflow (Scenario 1 from quickstart.md)
**Test Cases**:
- Redirect to login when unauthenticated
- Login fails with invalid credentials
- Login succeeds with valid credentials
- Session persists across refresh
- Logout terminates session
- Protected routes require auth
**Acceptance**:
- All test cases written
- Tests FAIL (no pages implemented yet)

---

### T016 [P]: Integration Test - Client Management [X]
**Files**: `tests/integration/client-management.spec.ts`  
**Description**: Write E2E test for client CRUD operations (Scenario 2 from quickstart.md)
**Test Cases**:
- View client list
- Create client with one address
- Create client with two addresses (HOME + WORK)
- CPF validation enforced
- Duplicate CPF rejected
- Edit client information
- Delete client without sales succeeds
- Delete client with sales fails
**Acceptance**:
- All test cases written
- Tests FAIL (no pages implemented yet)

---

### T017 [P]: Integration Test - Product Management [X]
**Files**: `tests/integration/product-management.spec.ts`  
**Description**: Write E2E test for product CRUD and stock tracking (Scenario 3 from quickstart.md)
**Test Cases**:
- Create product with stock
- Price validation enforced
- Stock validation enforced
- Edit product (price changes don't affect old sales)
- Search and filter products
- Delete product without sales succeeds
- Delete product with sales fails
**Acceptance**:
- All test cases written
- Tests FAIL (no pages implemented yet)

---

### T018 [P]: Integration Test - Sales Creation [X]
**Files**: `tests/integration/sales-creation.spec.ts`  
**Description**: Write E2E test for sales creation with stock management (Scenario 4 from quickstart.md)
**Test Cases**:
- Create sale with one product (stock decrements)
- Create sale with multiple products
- Insufficient stock validation
- Price preservation (historical sales show original price)
- Required field validation
**Acceptance**:
- All test cases written
- Tests FAIL (no pages implemented yet)

---

### T019 [P]: Integration Test - Sales Filtering [X]
**Files**: `tests/integration/sales-filtering.spec.ts`  
**Description**: Write E2E test for sales filtering and date ranges (Scenario 5 from quickstart.md)
**Test Cases**:
- Default shows last 30 days
- Filter by custom date range
- Filter by client
- Combined filters
- Clear filters
- View sale detail
- Empty results handled
**Acceptance**:
- All test cases written
- Tests FAIL (no pages implemented yet)

---

### T020 [P]: Integration Test - Responsive Design [X]
**Files**: `tests/integration/responsive.spec.ts`  
**Description**: Write responsive design tests across all breakpoints (Scenario 6 from quickstart.md)
**Test Cases**:
- Mobile (320px, 375px): Navigation, forms, tables adapt
- Tablet (768px): Two-column layouts
- Desktop (1024px, 1440px, 1920px): Full navigation
- Touch targets ≥ 44x44px
- No horizontal scrolling
**Acceptance**:
- All breakpoints tested
- Tests FAIL (no responsive implementation yet)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Database Layer

### T021 [P]: Implement Prisma Client Singleton [X]
**Files**: `src/server/db.ts`  
**Description**: Create Prisma Client singleton with connection pooling
**Acceptance**:
- Singleton pattern implemented
- Connection pooling configured
- Hot reload support in development
- Exports working Prisma client

---

### T022 [P]: Create Database Seed Script [X]
**Files**: `prisma/seed.ts`, `package.json`  
**Description**: Create seed script with test data (admin user, 5 clients, 10 products, 20 sales)
**Acceptance**:
- Seed script creates all test data
- Passwords properly hashed
- Relationships correctly established
- `npx prisma db seed` works

---

### Validation Layer

### T023 [P]: Implement CPF Validation Utility [X]
**Files**: `src/lib/validations.ts`  
**Description**: Create CPF validation function with Zod schema
**Code**: From contracts/clients.ts
**Acceptance**:
- Format validation (regex)
- Check digit validation (algorithm)
- Zod schema exports
- Unit tests pass (create in T045)

---

### T024 [P]: Implement CEP Validation Utility [X]
**Files**: `src/lib/validations.ts`  
**Description**: Create CEP validation function with Zod schema
**Acceptance**:
- Format validation (##### -###)
- Zod schema exports
- Unit tests pass (create in T045)

---

### Authentication Layer

### T025: Configure NextAuth.js [X]
**Files**: `src/server/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`  
**Description**: Setup NextAuth.js with credentials provider and database sessions
**Acceptance**:
- Credentials provider configured
- Password hashing with bcrypt
- Session stored in database
- JWT secret configured

---

### T026: Implement Auth Middleware [X]
**Files**: `src/middleware.ts`  
**Description**: Create middleware to protect routes requiring authentication
**Acceptance**:
- Unauthenticated users redirected to /login
- Public routes accessible
- Protected routes require session
- Contract tests T011 begin passing

---

### tRPC Layer

### T027: Setup tRPC Server [X]
**Files**: `src/server/api/trpc.ts`  
**Description**: Initialize tRPC with context (session, db) and error formatting
**Acceptance**:
- tRPC server configured
- Context includes session and Prisma
- Error handling middleware
- Type-safe procedures exported

---

### T028: Create tRPC Root Router [X]
**Files**: `src/server/api/root.ts`, `src/app/api/trpc/[trpc]/route.ts`  
**Description**: Create root router and Next.js API route handler
**Acceptance**:
- Root router merges all sub-routers
- API route handler configured
- Type exports working

---

### T029: Setup tRPC Client [X]
**Files**: `src/lib/trpc.ts`, `src/app/_trpc/Provider.tsx`  
**Description**: Create tRPC client with React Query integration
**Acceptance**:
- Client configured with proper URLs
- React Query provider setup
- Batching enabled
- Type inference working

---

### API Routers (tRPC Procedures)

### T030: Implement Auth Router [X]
**Files**: `src/server/api/routers/auth.ts`  
**Description**: Implement all 4 auth procedures (login, signup, logout, getSession)
**Acceptance**:
- All 4 procedures implemented
- Input validation with Zod
- Password hashing
- Session management
- Contract tests T011 PASS

---

### T031: Implement Clients Router - Create & List [X]
**Files**: `src/server/api/routers/clients.ts`  
**Description**: Implement create and list procedures for clients
**Acceptance**:
- create: validates CPF/CEP, creates client with addresses
- list: pagination, search, sorting work
- Duplicate CPF rejected
- Contract tests T012 (create, list) PASS

---

### T032: Implement Clients Router - Update, Delete, GetById [X]
**Files**: `src/server/api/routers/clients.ts`  
**Description**: Implement remaining client procedures
**Acceptance**:
- update: modifies client and addresses
- delete: checks for sales, prevents if exist
- getById: returns client with addresses
- Contract tests T012 (all) PASS

---

### T033: Implement Products Router - Create & List [X]
**Files**: `src/server/api/routers/products.ts`  
**Description**: Implement create and list procedures for products
**Acceptance**:
- create: validates price and stock
- list: pagination, filtering (inStockOnly), sorting
- Contract tests T013 (create, list) PASS

---

### T034: Implement Products Router - Update, Delete, GetById, CheckStock [X]
**Files**: `src/server/api/routers/products.ts`  
**Description**: Implement remaining product procedures
**Acceptance**:
- update: modifies product (price changes don't affect historical sales)
- delete: checks for sales, prevents if exist
- checkStock: returns availability
- getById: returns product
- Contract tests T013 (all) PASS

---

### T035: Implement Sales Router - Create [X]
**Files**: `src/server/api/routers/sales.ts`  
**Description**: Implement create sale with stock deduction and price preservation
**Acceptance**:
- Validates client and products exist
- Checks stock availability for all items
- Captures current prices (snapshots)
- Creates sale with items
- Decrements stock automatically
- Transaction (all or nothing)
- Contract tests T014 (create) PASS

---

### T036: Implement Sales Router - GetById, List, Filter, GetSummary [X]
**Files**: `src/server/api/routers/sales.ts`  
**Description**: Implement remaining sales procedures
**Acceptance**:
- getById: returns sale with items and client info
- list: default 30 days, date filtering, pagination
- filter: advanced filtering (date, client, amount)
- getSummary: calculates statistics
- Contract tests T014 (all) PASS

---

## Phase 3.4: Frontend Implementation

### UI Components (shadcn/ui)

### T037 [P]: Install and Configure shadcn/ui [X]
**Files**: `components.json`, `src/components/ui/`  
**Description**: Install shadcn/ui CLI and add base components
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label form table
```
**Acceptance**:
- Components installed in src/components/ui/
- Theme configured
- Sample components render

---

### T038 [P]: Create Reusable Form Components [X]
**Files**: `src/components/forms/FormField.tsx`, `src/components/forms/FormError.tsx`  
**Description**: Create form field wrappers with React Hook Form integration
**Acceptance**:
- FormField component with label, input, error
- Integration with React Hook Form
- Validation error display
- Reusable across all forms

---

### T039 [P]: Create Data Table Component [X]
**Files**: `src/components/data-tables/DataTable.tsx`  
**Description**: Create reusable data table with pagination, sorting, search
**Acceptance**:
- Responsive table component
- Pagination controls
- Sort indicators
- Search integration
- Mobile-friendly (cards on small screens)

---

### Layouts

### T040: Implement Root Layout [X]
**Files**: `src/app/layout.tsx`  
**Description**: Create root layout with providers (tRPC, NextAuth, theme)
**Acceptance**:
- HTML structure with metadata
- Providers wrapped correctly
- Global styles loaded
- Fonts optimized

---

### T041: Implement Navigation Component [X]
**Files**: `src/components/layouts/Navigation.tsx`  
**Description**: Create responsive navigation with mobile hamburger menu
**Acceptance**:
- Desktop: full navigation bar
- Mobile: hamburger menu
- Links to all main pages
- Logout button
- Responsive (≥320px breakpoint)

---

### Pages - Authentication

### T042: Implement Login Page [X]
**Files**: `src/app/login/page.tsx`  
**Description**: Create login page with form (email, password)
**Acceptance**:
- Form with validation
- Calls auth.login tRPC procedure
- Error handling
- Redirects to dashboard on success
- Integration test T015 (login) begins passing

---

### Pages - Dashboard

### T043: Implement Dashboard Page [X]
**Files**: `src/app/page.tsx`  
**Description**: Create dashboard with summary statistics and recent activity
**Acceptance**:
- Protected route (requires auth)
- Displays summary cards (total clients, products, recent sales)
- SSR for initial load
- Responsive layout
- Integration test T015 (auth redirect) passes

---

### Pages - Clients

### T044: Implement Clients List Page [X]
**Files**: `src/app/clients/page.tsx`  
**Description**: Create clients list with search, sort, pagination
**Acceptance**:
- Calls clients.list tRPC procedure
- DataTable component with clients
- Search by name/email
- Sort by name/email/date
- Pagination
- "Add Client" button
- SSR for initial load
- Integration test T016 (view list) passes

---

### T045: Implement Client Create/Edit Form [X]
**Files**: `src/app/clients/[id]/page.tsx`, `src/components/forms/ClientForm.tsx`  
**Description**: Create form for adding/editing clients with addresses
**Acceptance**:
- Form with all client fields
- CPF and CEP validation (inline)
- Add up to 2 addresses (HOME/WORK)
- React Hook Form integration
- Calls clients.create or clients.update
- Success/error feedback
- Integration test T016 (create, edit) passes

---

### Pages - Products

### T046: Implement Products List Page [X]
**Files**: `src/app/products/page.tsx`  
**Description**: Create products list with search, filter, pagination
**Acceptance**:
- Calls products.list tRPC procedure
- DataTable with products (name, price, stock)
- Search by name
- Filter: inStockOnly
- Sort by name/price/stock
- "Add Product" button
- SSR for initial load
- Integration test T017 (view list) passes

---

### T047: Implement Product Create/Edit Form [X]
**Files**: `src/app/products/[id]/page.tsx`, `src/components/forms/ProductForm.tsx`  
**Description**: Create form for adding/editing products
**Acceptance**:
- Form with name, price, stock
- Price validation (positive, in cents)
- Stock validation (non-negative)
- React Hook Form integration
- Calls products.create or products.update
- Success/error feedback
- Integration test T017 (create, edit) passes

---

### Pages - Sales

### T048: Implement Sales List Page [X]
**Files**: `src/app/sales/page.tsx`  
**Description**: Create sales list with date filtering (default: last 30 days)
**Acceptance**:
- Calls sales.list tRPC procedure
- Default: last 30 days
- Date range picker
- Client filter dropdown
- DataTable with sales (date, client, amount)
- Pagination
- "Create Sale" button
- SSR for initial load
- Integration test T019 (view, filter) passes

---

### T049: Implement Sale Creation Form [X]
**Files**: `src/app/sales/new/page.tsx`, `src/components/forms/SaleForm.tsx`  
**Description**: Create form for creating sales with multiple products
**Acceptance**:
- Select client (dropdown)
- Add multiple products (dynamic list)
- For each product: select product, enter quantity
- Stock validation on submit
- Price auto-filled from product
- Total calculated automatically
- Calls sales.create
- Success redirects to sales list
- Integration test T018 (create sale, stock deduction) passes

---

### T050: Implement Sale Detail Page [X]
**Files**: `src/app/sales/[id]/page.tsx`  
**Description**: Create page showing sale details with items
**Acceptance**:
- Calls sales.getById
- Shows client info
- Shows all items with quantities and prices
- Shows total amount
- Verifies price preservation (historical prices shown)
- SSR for initial load

---

## Phase 3.5: Polish & Validation

### Unit Tests

### T051 [P]: Unit Tests - CPF Validation
**Files**: `tests/unit/cpf-validation.test.ts`  
**Description**: Write unit tests for CPF validation utility
**Test Cases**:
- Valid CPF formats (with/without formatting)
- Invalid CPF (wrong check digits)
- Invalid CPF (all same digit)
- Invalid CPF (wrong length)
**Acceptance**:
- All edge cases covered
- 100% coverage for CPF validation
- Tests PASS

---

### T052 [P]: Unit Tests - CEP Validation
**Files**: `tests/unit/cep-validation.test.ts`  
**Description**: Write unit tests for CEP validation utility
**Test Cases**:
- Valid CEP formats (with/without dash)
- Invalid CEP (wrong length)
- Invalid CEP (non-numeric)
**Acceptance**:
- All edge cases covered
- 100% coverage for CEP validation
- Tests PASS

---

### T053 [P]: Unit Tests - Stock Management Logic
**Files**: `tests/unit/stock-management.test.ts`  
**Description**: Write unit tests for stock deduction and validation logic
**Test Cases**:
- Stock decrements correctly on sale
- Insufficient stock prevented
- Multiple products handled
- Stock validation before sale creation
**Acceptance**:
- All edge cases covered
- Tests PASS

---

### T054 [P]: Unit Tests - Price Preservation
**Files**: `tests/unit/price-preservation.test.ts`  
**Description**: Write unit tests for price snapshot logic
**Test Cases**:
- Price captured at time of sale
- Product price change doesn't affect historical sale
- Sale total calculated with snapshot prices
**Acceptance**:
- All edge cases covered
- Tests PASS

---

### Responsive Design Validation

### T055: Validate Mobile Responsiveness (320px, 375px)
**Files**: Run Playwright tests at mobile viewports  
**Description**: Manually verify responsive design at smallest breakpoints
**Checks**:
- Navigation collapses to hamburger
- Tables adapt (card layout)
- Forms stack vertically
- Touch targets ≥ 44x44px
- No horizontal scrolling
**Acceptance**:
- Integration test T020 (mobile) PASSES
- Manual testing confirms usability

---

### T056: Validate Tablet Responsiveness (768px)
**Files**: Run Playwright tests at tablet viewport  
**Description**: Verify responsive design at tablet breakpoint
**Checks**:
- Two-column layouts where appropriate
- Navigation adapts
- Touch-friendly
**Acceptance**:
- Integration test T020 (tablet) PASSES

---

### T057: Validate Desktop Responsiveness (1024px, 1440px, 1920px)
**Files**: Run Playwright tests at desktop viewports  
**Description**: Verify responsive design at desktop breakpoints
**Checks**:
- Full navigation visible
- Tables show all columns
- Optimal spacing
**Acceptance**:
- Integration test T020 (desktop) PASSES

---

### Accessibility

### T058 [P]: Add ARIA Labels and Roles
**Files**: All page components  
**Description**: Add accessibility attributes throughout the application
**Acceptance**:
- All interactive elements have labels
- Proper heading hierarchy (H1, H2, etc.)
- Form fields have associated labels
- Error messages announced to screen readers
- Focus management in modals

---

### T059 [P]: Validate Color Contrast
**Files**: Tailwind theme, all components  
**Description**: Ensure color contrast meets WCAG 2.1 AA standards
**Acceptance**:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Automated checks pass (Lighthouse)

---

### T060 [P]: Test Keyboard Navigation
**Files**: Manual testing across all pages  
**Description**: Verify complete keyboard accessibility
**Acceptance**:
- Tab order logical
- All interactive elements reachable
- Enter/Space activate buttons
- Escape closes modals
- Focus visible

---

### Performance Optimization

### T061: Optimize Bundle Size
**Files**: `next.config.js`, dynamic imports  
**Description**: Implement code splitting and lazy loading
**Acceptance**:
- Initial bundle <200KB gzipped
- Dynamic imports for forms
- next/image for images
- next/font for fonts
- Build analysis shows improvements

---

### T062: Validate API Performance
**Files**: Test tRPC procedures  
**Description**: Verify API response times meet targets
**Acceptance**:
- All procedures <200ms p95
- Prisma queries optimized
- Indexes utilized
- Connection pooling configured

---

### T063: Validate Core Web Vitals
**Files**: Run Lighthouse audits  
**Description**: Ensure SEO and performance metrics in "Good" range
**Acceptance**:
- LCP <2.5s
- FID <100ms
- CLS <0.1
- Performance score >80
- SEO score >90

---

### Documentation & Cleanup

### T064 [P]: Create README with Setup Instructions
**Files**: `README.md`  
**Description**: Document project setup, Docker, and development workflow
**Acceptance**:
- Prerequisites listed (Node, Docker)
- Setup steps (Docker Compose, migrations, seed)
- Development commands
- Testing commands
- Environment variables documented

---

### T065 [P]: Run Quickstart Validation
**Files**: Execute all scenarios from quickstart.md  
**Description**: Manually execute all 8 acceptance scenarios
**Acceptance**:
- Scenario 1 (Auth): PASS
- Scenario 2 (Clients): PASS
- Scenario 3 (Products): PASS
- Scenario 4 (Sales Creation): PASS
- Scenario 5 (Sales Filtering): PASS
- Scenario 6 (Responsive): PASS
- Scenario 7 (Performance): PASS
- Scenario 8 (Error Handling): PASS

---

## Task Dependencies

### Critical Path
```
T001 → T002 → T003 → T006 → T007 → T021 → T027 → T028 → T030-T036 → T042-T050 → T065
```

### Parallel Execution Groups

**Group 1: Setup (after T003)**
- T004 (ESLint)
- T005 (Directories)
- T008 (Tailwind)
- T009 (Vitest)
- T010 (Playwright)

**Group 2: Contract Tests (after T010)**
- T011 (Auth contracts)
- T012 (Clients contracts)
- T013 (Products contracts)
- T014 (Sales contracts)

**Group 3: Integration Tests (after T010)**
- T015 (Auth E2E)
- T016 (Clients E2E)
- T017 (Products E2E)
- T018 (Sales E2E)
- T019 (Sales filtering E2E)
- T020 (Responsive E2E)

**Group 4: Validation Utilities (after T021)**
- T023 (CPF validation)
- T024 (CEP validation)

**Group 5: UI Components (after T037)**
- T038 (Form components)
- T039 (Data table)

**Group 6: Unit Tests (after T051)**
- T051 (CPF tests)
- T052 (CEP tests)
- T053 (Stock tests)
- T054 (Price tests)

**Group 7: Accessibility (after T050)**
- T058 (ARIA)
- T059 (Contrast)
- T060 (Keyboard)

**Group 8: Final Polish (after T060)**
- T064 (README)
- T065 (Quickstart)

### Blocking Relationships
- T007 blocks T021 (DB must exist)
- T021 blocks T027 (Prisma needed for tRPC context)
- T027 blocks T030-T036 (tRPC setup before routers)
- T028 blocks T029 (server before client)
- T030-T036 block T042-T050 (API before UI)
- All implementation blocks polish (T051-T065)

---

## Validation Checklist

Before marking feature complete, verify:

- [ ] All 65 tasks completed
- [ ] All contract tests PASS (T011-T014)
- [ ] All integration tests PASS (T015-T020)
- [ ] All unit tests PASS (T051-T054)
- [ ] Test coverage >80% overall
- [ ] Test coverage >85% for services (tRPC routers)
- [ ] No linting errors
- [ ] All quickstart scenarios PASS (T065)
- [ ] Responsive design validated (320px to 1920px)
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance targets met (<200ms API, <2s page load)
- [ ] Core Web Vitals in "Good" range
- [ ] Initial bundle <200KB gzipped
- [ ] Docker setup documented
- [ ] README complete

---

## Execution Notes

1. **Start Docker First**: Always run `docker-compose up -d` before development
2. **TDD is Mandatory**: Never implement before tests are written and failing
3. **Commit Frequently**: Commit after each task completion
4. **Run Tests Often**: `npm test` after each implementation task
5. **Check Types**: `tsc --noEmit` before committing
6. **Lint Before Commit**: `npm run lint` before committing

---

## Parallel Execution Example

To maximize efficiency, run parallel tasks together:

```bash
# After T003, run setup tasks in parallel:
Task T004: Configure ESLint
Task T005: Create directories
Task T008: Configure Tailwind
Task T009: Setup Vitest
Task T010: Setup Playwright

# After T010, write all contract tests in parallel:
Task T011: Auth contract tests
Task T012: Clients contract tests
Task T013: Products contract tests
Task T014: Sales contract tests

# After T010, write all integration tests in parallel:
Task T015: Auth E2E tests
Task T016: Clients E2E tests
Task T017: Products E2E tests
Task T018: Sales E2E tests
Task T019: Sales filtering E2E tests
Task T020: Responsive E2E tests
```

---

**Tasks Generated**: 65  
**Ready for Execution**: ✅  
**Estimated Time**: 80-100 hours (with parallel execution)  
**Next Command**: Begin with T001

