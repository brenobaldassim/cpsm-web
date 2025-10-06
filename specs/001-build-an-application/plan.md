# Implementation Plan: Sales and Client Management System

**Branch**: `001-build-an-application` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-an-application/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ COMPLETE - Spec loaded with clarifications
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ COMPLETE - Project Type: web (Next.js full-stack)
3. Fill the Constitution Check section
   → ✅ COMPLETE - All checks documented
4. Evaluate Constitution Check section
   → ✅ PASS - No violations, all standards met
5. Execute Phase 0 → research.md
   → ✅ COMPLETE - All technical decisions documented
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent file
   → ✅ COMPLETE - All design artifacts generated
7. Re-evaluate Constitution Check section
   → ✅ PASS - No new violations introduced
8. Plan Phase 2 → Task generation approach described
   → ✅ COMPLETE - Ready for /tasks command
9. STOP - Ready for /tasks command
   → ✅ Status: READY FOR /tasks
```

**IMPORTANT**: The /plan command STOPS at step 8. Phase 2 is executed by the /tasks command.

## Summary

Building a sales and client management system with real-time inventory tracking, multi-user authentication, and responsive design. The application enables business owners to manage clients (with CPF and Brazilian addresses), products (with stock tracking), and sales (with historical price preservation). Key features include automatic stock deduction on sales, deletion protection for entities with sales history, and comprehensive data filtering capabilities.

**Technical Approach**: Full-stack Next.js application with TypeScript, using tRPC for type-safe API communication, Prisma ORM for database access, and PostgreSQL for data persistence. Development environment uses Docker Compose for consistent database setup across all developers. The application leverages SSR/SSG for SEO optimization, Tailwind CSS for responsive design, and NextAuth.js for authentication. Architecture follows a layered design pattern with clear separation between data, business logic, and presentation layers.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.x (App Router)
**Primary Dependencies**: 
- Next.js 15 (full-stack framework with SSR/SSG)
- tRPC 10 (type-safe API layer)
- Prisma 5 (ORM with PostgreSQL)
- Tailwind CSS 3 (utility-first styling)
- NextAuth.js 5 (authentication)
- Zod (runtime validation)
- React Hook Form (form management)

**Storage**: PostgreSQL 15+ with Docker Compose for local development (relational database for structured business data)
**Testing**: Vitest (unit/integration), Playwright (E2E), tRPC's test utilities (contract tests)
**Target Platform**: Web application (mobile, tablet, desktop via responsive design)
**Project Type**: web (Next.js full-stack with frontend + backend in single codebase)
**Development Environment**: Docker Compose for PostgreSQL database
**Performance Goals**: 
- API response <200ms p95
- Page load <2s desktop, <3s mobile (3G)
- Initial bundle <200KB gzipped
- SEO: Core Web Vitals in "Good" range (LCP <2.5s, FID <100ms, CLS <0.1)

**Constraints**: 
- Minimal dependencies (leverage Next.js ecosystem)
- Database schema must support Brazilian CPF and CEP formats
- Historical sales data immutability (price preservation)
- Referential integrity for cascading operations

**Scale/Scope**: 
- Target: 100-500 concurrent users
- Data volume: ~10k clients, ~5k products, ~50k sales/year
- 8 main pages/screens (login, dashboard, 3 CRUD pages, sales filter views)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality Standards
- [x] Dependencies explicitly declared with version pinning
- [x] Each dependency justified (necessity, maintenance, license, bundle size)
- [x] Native/standard library solutions preferred over external dependencies
- [x] Linting rules configured for language/framework
- [x] Code organization follows single responsibility principle

**Justification**: Next.js/React ecosystem chosen for minimal dependencies while meeting requirements. tRPC eliminates need for REST/GraphQL client libraries. Prisma replaces manual SQL. Tailwind avoids CSS framework overhead. Zod serves dual purpose (Prisma validation + tRPC schemas). NextAuth.js is industry standard for Next.js auth. Total core dependencies: 6 (excluding dev tools).

### Testing Standards (NON-NEGOTIABLE)
- [x] TDD approach planned: tests before implementation
- [x] Contract tests planned for all API endpoints
- [x] Integration tests planned for all user workflows
- [x] Test coverage target >80% for business logic

**Approach**: 
1. Contract tests via tRPC's test utilities for all procedures
2. Integration tests with Playwright for user workflows (authentication, CRUD operations, sales filtering)
3. Unit tests for business logic (stock validation, price preservation, CPF/CEP validation)
4. Coverage target: 85% for services, 80% overall

### User Experience Consistency
- [x] Responsive design planned for mobile and desktop
- [x] Breakpoints defined (mobile: 320px, 375px, 768px; desktop: 1024px, 1440px, 1920px)
- [x] Touch targets minimum 44×44px for mobile
- [x] Design system or UI patterns defined
- [x] Error handling strategy ensures user-friendly messages
- [x] Accessibility requirements (WCAG 2.1 AA) considered
- [x] Loading/feedback states planned for async operations
- [x] Visual hierarchy and white space strategy defined

**Design System**: Tailwind + shadcn/ui components for consistency. Mobile-first approach with hamburger navigation, collapsible tables, and touch-optimized forms. Loading states via Suspense boundaries. Error boundaries for graceful failure handling. Form validation with inline feedback via React Hook Form + Zod.

### Performance Requirements
- [x] Response time targets defined (API <200ms p95, UI <100ms)
- [x] Mobile performance targets defined (<3s on 3G)
- [x] Client-side bundle optimization planned (code splitting, lazy loading)
- [x] Initial JS bundle target <200KB gzipped (for web apps)
- [x] Resource constraints identified (memory, connections)
- [x] Scalability approach (horizontal scaling, stateless design)
- [x] Monitoring and health check endpoints planned

**Optimization Strategy**:
- Next.js App Router with SSR for initial load, client-side navigation
- RSC (React Server Components) for dashboard and list views
- Dynamic imports for CRUD forms (lazy loaded)
- Prisma connection pooling (max 10 connections)
- tRPC batching for multiple queries
- Static generation for public pages (if any)
- Image optimization via next/image
- Monitoring: Next.js built-in analytics + custom health endpoint

## Project Structure

### Documentation (this feature)
```
specs/001-build-an-application/
├── plan.md              # This file
├── research.md          # Technology decisions and patterns
├── data-model.md        # Database schema and relationships
├── quickstart.md        # Acceptance test scenarios
├── contracts/           # tRPC procedure definitions
│   ├── auth.ts         # Authentication procedures
│   ├── clients.ts      # Client management procedures
│   ├── products.ts     # Product management procedures
│   └── sales.ts        # Sales management procedures
└── tasks.md             # Generated by /tasks command
```

### Source Code (repository root)
```
client-product-manager/
├── prisma/
│   ├── schema.prisma          # Data model
│   └── migrations/            # Database migrations
│
├── src/
│   ├── server/
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── api/
│   │       ├── trpc.ts       # tRPC setup
│   │       ├── root.ts       # Root router
│   │       └── routers/
│   │           ├── auth.ts   # Auth procedures
│   │           ├── clients.ts
│   │           ├── products.ts
│   │           └── sales.ts
│   │
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Dashboard (SSR)
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── clients/
│   │   │   ├── page.tsx      # Client list (SSR)
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Client detail/edit
│   │   ├── products/
│   │   │   ├── page.tsx      # Product list (SSR)
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Product detail/edit
│   │   └── sales/
│   │       ├── page.tsx      # Sales list with filters (SSR)
│   │       └── [id]/
│   │           └── page.tsx  # Sale detail
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── forms/            # Form components
│   │   ├── layouts/          # Layout components
│   │   └── data-tables/      # Reusable table components
│   │
│   ├── lib/
│   │   ├── utils.ts          # Utility functions
│   │   ├── validations.ts    # Zod schemas (CPF, CEP, etc.)
│   │   └── trpc.ts           # tRPC client
│   │
│   └── types/                # Shared TypeScript types
│
├── tests/
│   ├── contract/             # tRPC procedure tests
│   │   ├── auth.test.ts
│   │   ├── clients.test.ts
│   │   ├── products.test.ts
│   │   └── sales.test.ts
│   ├── integration/          # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   ├── client-management.spec.ts
│   │   ├── product-management.spec.ts
│   │   └── sales-management.spec.ts
│   └── unit/                 # Business logic tests
│       ├── validations.test.ts
│       ├── stock-management.test.ts
│       └── price-preservation.test.ts
│
├── public/                   # Static assets
├── docker-compose.yml       # Docker Compose configuration for PostgreSQL
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables (not committed)
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── playwright.config.ts     # Playwright configuration
```

**Structure Decision**: Next.js App Router structure with tRPC integration. The `src/server/` directory contains all backend logic (database, auth, API), while `src/app/` contains the frontend pages using React Server Components. This structure leverages Next.js's file-based routing and colocation benefits while maintaining clear separation between client and server code through the "use client" directive where needed.

## Phase 0: Outline & Research

Completed research on technical decisions and patterns. All findings documented in `research.md`.

**Key Decisions**:
1. **Framework**: Next.js 15 with App Router for SSR/SSG capabilities and SEO optimization
2. **API Layer**: tRPC for end-to-end type safety, eliminating need for OpenAPI/REST clients
3. **Database**: PostgreSQL with Prisma ORM for type-safe queries and migrations
4. **Development Environment**: Docker Compose for consistent PostgreSQL setup
5. **Authentication**: NextAuth.js v5 for industry-standard auth patterns
6. **Styling**: Tailwind CSS with shadcn/ui for minimal dependencies and consistent design
7. **Forms**: React Hook Form + Zod for performant validation
8. **Testing**: Vitest (fast), Playwright (E2E), tRPC test utilities (contracts)

**Output**: research.md with all technical decisions justified (including Docker setup)

## Phase 1: Design & Contracts

Completed design artifacts for database schema, API contracts, and acceptance tests.

**Artifacts Generated**:
1. **data-model.md**: Complete Prisma schema with User, Client, Address, Product, Sale, SaleItem entities. Includes Brazilian-specific validations (CPF, CEP), cascading rules, and indexes.

2. **contracts/**: tRPC router definitions for all procedures:
   - auth.ts: login, logout, getSession
   - clients.ts: create, update, delete, list, getById (with validation)
   - products.ts: create, update, delete, list, getById (with stock checks)
   - sales.ts: create, list, getById, filter (with price preservation)

3. **quickstart.md**: Acceptance test scenarios covering:
   - Authentication flow
   - Client CRUD with dual addresses
   - Product CRUD with stock management
   - Sales creation with multiple products
   - Filtering and validation scenarios

4. **Agent file**: Updated CLAUDE.md with project context (Next.js, tRPC, Prisma patterns)

**Output**: All Phase 1 artifacts complete and verified against constitution

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base template
2. Generate tasks from Phase 1 artifacts in TDD order:

**Contract Tests** (generated from contracts/):
- Task 1: Auth contract tests [P]
- Task 2: Clients contract tests [P]
- Task 3: Products contract tests [P]
- Task 4: Sales contract tests [P]

**Data Layer** (generated from data-model.md):
- Task 5: Prisma schema implementation
- Task 6: Database migrations
- Task 7: Seed data script

**Business Logic** (generated from functional requirements):
- Task 8: CPF/CEP validation utilities [P]
- Task 9: Stock management service
- Task 10: Price preservation logic
- Task 11: Deletion protection rules

**API Implementation** (generated from contracts/):
- Task 12: tRPC setup and context
- Task 13: Auth router implementation
- Task 14: Clients router implementation
- Task 15: Products router implementation
- Task 16: Sales router implementation

**Integration Tests** (generated from quickstart.md):
- Task 17: Authentication flow tests
- Task 18: Client management tests
- Task 19: Product management tests
- Task 20: Sales creation tests
- Task 21: Filtering tests

**Frontend Components** (generated from UI requirements):
- Task 22: Layout and navigation [P]
- Task 23: Login page
- Task 24: Dashboard page (SSR)
- Task 25: Clients pages
- Task 26: Products pages
- Task 27: Sales pages
- Task 28: Form components
- Task 29: Responsive design validation

**Ordering Strategy**:
- TDD: Contract tests → Data layer → Business logic → API → Integration tests → UI
- Dependencies: Schema before routers, routers before pages
- [P] marker: Parallel execution for independent tasks (e.g., multiple contract test files)

**Estimated Output**: 29 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md with detailed implementation steps)
**Phase 4**: Implementation (execute tasks.md following TDD and constitutional principles)
**Phase 5**: Validation (run all tests, execute quickstart scenarios, validate Core Web Vitals)

## Complexity Tracking

No constitutional violations. All standards met:

- **Minimal Dependencies**: 6 core libraries, each justified and necessary
- **TDD**: Full test coverage planned before implementation
- **Responsive Design**: Mobile-first approach with defined breakpoints
- **Performance**: SSR/SSG strategy meets targets
- **Code Quality**: TypeScript + ESLint + Prettier configured

No complexity deviations to document.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command) - Ready to execute
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented (none) ✅

**Artifacts Generated**:
- [x] plan.md (this file) - Updated with Docker requirements
- [x] research.md (11 technical decisions documented, including Docker setup)
- [x] data-model.md (6 entities with Prisma schema)
- [x] contracts/auth.ts (4 authentication procedures)
- [x] contracts/clients.ts (5 client management procedures)
- [x] contracts/products.ts (6 product management procedures)
- [x] contracts/sales.ts (5 sales management procedures)
- [x] quickstart.md (8 acceptance scenarios with Docker setup instructions)
- [x] .cursor/rules/specify-rules.mdc (agent context updated)

---
*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
