# Research: Sales and Client Management System

**Date**: 2025-10-05  
**Feature**: 001-build-an-application

## Technical Decisions

### 1. Framework Selection: Next.js 15 (App Router)

**Decision**: Use Next.js 15 with App Router for full-stack development

**Rationale**:
- **SSR/SSG Support**: Native support for Server-Side Rendering and Static Site Generation for SEO optimization
- **Full-Stack**: Combines frontend and backend in single codebase, reducing deployment complexity
- **React Server Components**: Reduces client bundle size by rendering components on server
- **File-Based Routing**: Intuitive page structure with automatic code splitting
- **API Routes**: Built-in API support (will use with tRPC)
- **Performance**: Automatic optimizations (image, font, code splitting)
- **Minimal Dependencies**: Batteries-included framework reduces need for additional libraries

**Alternatives Considered**:
- **Create React App + Express**: Rejected due to separate deployment, manual SSR setup, more dependencies
- **Remix**: Similar features but smaller ecosystem, less mature tRPC integration
- **Gatsby**: Better for static sites, not ideal for dynamic dashboard with auth

**Best Practices**:
- Use App Router (not Pages Router) for React Server Components
- Implement route handlers for tRPC endpoints
- Leverage `generateMetadata` for dynamic SEO
- Use `loading.tsx` and `error.tsx` for loading/error states
- Implement middleware for auth protection

---

### 2. API Layer: tRPC 10

**Decision**: Use tRPC for type-safe client-server communication

**Rationale**:
- **End-to-End Type Safety**: Shared TypeScript types between client and server
- **No Code Generation**: Unlike OpenAPI/GraphQL, types are inferred automatically
- **Minimal Dependencies**: Eliminates need for REST client, GraphQL client, code generators
- **Excellent Next.js Integration**: First-class support for App Router and RSC
- **Developer Experience**: Autocomplete, refactoring, compile-time errors
- **Performance**: Request batching and deduplication built-in

**Alternatives Considered**:
- **REST API**: Rejected due to lack of type safety, requires OpenAPI codegen
- **GraphQL**: Rejected due to complexity overhead, more dependencies (Apollo/Relay)
- **Server Actions**: Not suitable for complex validation and business logic separation

**Best Practices**:
- Define routers in `src/server/api/routers/`
- Use Zod for input validation (shared with Prisma)
- Implement context with auth session
- Enable request batching for multiple queries
- Use React Query integration for client-side caching

---

### 3. Database: PostgreSQL 15+ with Prisma 5 (Docker for Development)

**Decision**: PostgreSQL as database with Prisma as ORM, Docker for local development

**Rationale**:
- **PostgreSQL**:
  - Robust relational model for complex business data
  - ACID compliance for financial/sales data integrity
  - JSON support for flexible fields if needed
  - Excellent performance with proper indexing
  - Strong community and tooling support
- **Prisma**:
  - Type-safe database queries
  - Automatic migration generation
  - Schema-first approach aligns with design phase
  - Connection pooling for performance
  - Introspection and seeding capabilities
- **Docker for Development**:
  - Consistent database environment across team members
  - Easy setup with docker-compose
  - Isolated from host system
  - Simple version management
  - No local PostgreSQL installation required

**Alternatives Considered**:
- **MySQL**: Similar features but PostgreSQL has better JSON support and constraints
- **MongoDB**: Rejected due to lack of referential integrity for sales data
- **Drizzle ORM**: Newer, less mature ecosystem, harder TypeScript integration
- **Raw SQL**: Rejected due to lack of type safety and manual migration management
- **Local PostgreSQL Installation**: Rejected in favor of Docker for consistency

**Best Practices**:
- Define schema with proper relations and cascading rules
- Create indexes on frequently queried fields (email, CPF, sale dates)
- Use connection pooling (PgBouncer in production)
- Implement soft deletes where appropriate
- Regular backups and point-in-time recovery
- Docker Compose for local development environment
- Volume persistence for database data
- Health checks in Docker configuration

---

### 4. Authentication: NextAuth.js 5

**Decision**: Use NextAuth.js v5 (Auth.js) for authentication

**Rationale**:
- **Industry Standard**: Most popular auth solution for Next.js
- **Next.js App Router Support**: First-class integration with middleware
- **Flexible**: Supports credentials, OAuth, email magic links
- **Session Management**: Secure JWT or database sessions
- **Middleware Integration**: Easy route protection
- **Type Safety**: Full TypeScript support

**Alternatives Considered**:
- **Custom JWT**: Rejected due to security complexity, need to implement session management
- **Clerk**: Third-party service, adds dependency and cost
- **Supabase Auth**: Requires Supabase ecosystem adoption

**Best Practices**:
- Use credentials provider for username/password
- Store sessions in database for multi-device support
- Hash passwords with bcrypt (cost factor 12)
- Implement CSRF protection via NextAuth
- Add rate limiting to login endpoint

---

### 5. Styling: Tailwind CSS 3 + shadcn/ui

**Decision**: Tailwind CSS for styling with shadcn/ui component library

**Rationale**:
- **Tailwind CSS**:
  - Utility-first approach with minimal CSS overhead
  - Purges unused styles for small bundle size
  - Responsive design with mobile-first breakpoints
  - No CSS-in-JS runtime overhead
  - Excellent IDE support (IntelliSense)
- **shadcn/ui**:
  - Copy-paste components (not an npm dependency)
  - Built on Radix UI (accessible primitives)
  - Customizable with Tailwind
  - Consistent design system

**Alternatives Considered**:
- **Material-UI**: Heavy bundle size, opinionated design
- **Chakra UI**: CSS-in-JS runtime overhead
- **Plain CSS Modules**: More boilerplate, manual responsive design
- **Bootstrap**: Harder to customize, larger bundle

**Best Practices**:
- Define custom theme in `tailwind.config.ts`
- Use semantic color names (primary, destructive, etc.)
- Implement dark mode if needed
- Create reusable component variants
- Follow mobile-first responsive design

---

### 6. Form Management: React Hook Form + Zod

**Decision**: React Hook Form for forms with Zod validation

**Rationale**:
- **React Hook Form**:
  - Minimal re-renders (uncontrolled components)
  - Small bundle size (~8KB)
  - Excellent performance for large forms
  - Built-in validation and error handling
- **Zod**:
  - Runtime type validation
  - Shared schemas between tRPC and Prisma
  - Composable validation rules
  - Excellent error messages

**Alternatives Considered**:
- **Formik**: Larger bundle, more re-renders
- **React Final Form**: Less active maintenance
- **Controlled Components**: Performance issues with many fields

**Best Practices**:
- Define Zod schemas in `src/lib/validations.ts`
- Use `@hookform/resolvers/zod` for integration
- Implement custom validators for CPF and CEP
- Show inline validation errors
- Use form state for loading/success feedback

---

### 7. Testing Strategy

**Decision**: Vitest (unit/integration) + Playwright (E2E) + tRPC test utilities (contract)

**Rationale**:
- **Vitest**:
  - Fast (built on Vite)
  - Jest-compatible API
  - Native ESM support
  - Excellent TypeScript support
  - Watch mode for TDD
- **Playwright**:
  - Cross-browser testing
  - Built-in test runner
  - Visual regression testing
  - Mobile viewport emulation
  - Network interception
- **tRPC Test Utilities**:
  - Test procedures without HTTP
  - Mock context easily
  - Full type safety in tests

**Alternatives Considered**:
- **Jest**: Slower than Vitest, requires more configuration
- **Cypress**: Good but Playwright has better API and performance
- **Testing Library**: Used alongside Vitest for component tests

**Best Practices**:
- Write contract tests for all tRPC procedures
- Integration tests for complete user workflows
- Unit tests for business logic (validations, calculations)
- Mock database calls in unit tests
- Use factories for test data

---

### 8. Brazilian-Specific Validations

**Decision**: Implement custom validators for CPF and CEP

**CPF (Cadastro de Pessoas Físicas)**:
- Format: XXX.XXX.XXX-XX (11 digits)
- Algorithm: Two check digits with weighted sum validation
- Implementation: Custom Zod refinement function
- Store as string in database (preserve formatting)

**CEP (Código de Endereçamento Postal)**:
- Format: #####-### (8 digits)
- Validation: Format check + optional API lookup (ViaCEP)
- Implementation: Zod regex validation
- Store as string in database

**Best Practices**:
- Normalize input (remove formatting before validation)
- Store formatted values for display
- Create reusable validation utilities
- Handle edge cases (all zeros, known invalid CPFs)

---

### 9. Performance Optimization Strategy

**Server-Side Rendering (SSR)**:
- Dashboard: Fetch summary data on server
- List pages: Paginated data loaded on server
- Detail pages: Data fetched per request

**Static Site Generation (SSG)**:
- Public pages (if any): Login, landing
- Revalidate with ISR (Incremental Static Regeneration)

**Client-Side Optimization**:
- Code splitting via dynamic imports for forms
- React Server Components for non-interactive UI
- Image optimization with next/image
- Font optimization with next/font

**Database Optimization**:
- Connection pooling (Prisma)
- Indexes on: client email/CPF, product name, sale date
- Avoid N+1 queries with Prisma `include`
- Pagination for large lists

**Bundle Optimization**:
- Tree shaking (automatic with Next.js)
- Remove unused Tailwind classes (purge)
- Lazy load modals and forms
- Target: Initial bundle <200KB gzipped

---

### 10. SEO Strategy

**Metadata Management**:
- Use `generateMetadata` in page files
- Dynamic titles: "Client: John Doe | Sales Manager"
- Descriptions based on page content
- Open Graph tags for social sharing

**Server-Side Rendering**:
- All public pages rendered on server
- Fast initial paint for search engines
- No client-side content flashing

**Performance**:
- Optimize Core Web Vitals (LCP, FID, CLS)
- Use `loading.tsx` for Suspense boundaries
- Implement skeleton loaders

**Structured Data**:
- JSON-LD for business information (if applicable)
- Breadcrumb navigation

---

### 11. Docker Setup for Development

**Decision**: Use Docker Compose for local development environment

**Rationale**:
- **Consistency**: All developers use same database version and configuration
- **Simplicity**: Single command to start all services (`docker-compose up`)
- **Isolation**: Database runs in container, no conflicts with host system
- **Portability**: Easy to share and reproduce development environment
- **Clean**: No need to install PostgreSQL locally

**Docker Compose Services**:
- **postgres**: PostgreSQL 15 database
  - Port: 5432
  - Volume: Persistent data storage
  - Health check: pg_isready
- **postgres-test**: Separate test database (optional)
  - Port: 5433
  - Isolated from development data

**Configuration**:
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
```

**Best Practices**:
- Use alpine images for smaller size
- Persist data with named volumes
- Include health checks
- Environment variables in .env.local (not committed)
- Separate test database for parallel testing
- Document startup commands in README

---

## Resolved Ambiguities

All technical contexts have been resolved:

1. ✅ Language/Framework: TypeScript + Next.js 15
2. ✅ Database: PostgreSQL with Prisma
3. ✅ Authentication: NextAuth.js v5
4. ✅ Styling: Tailwind CSS + shadcn/ui
5. ✅ API Pattern: tRPC
6. ✅ Testing: Vitest + Playwright
7. ✅ Validation: Zod (CPF, CEP, forms)
8. ✅ Performance: SSR/SSG strategy defined
9. ✅ SEO: Metadata and rendering strategy defined
10. ✅ Development Environment: Docker Compose for database
11. ✅ Local Setup: Docker-based PostgreSQL (no local install needed)

---

## Dependencies Justification

| Dependency | Purpose | Why Needed | Bundle Impact |
|------------|---------|------------|---------------|
| Next.js | Full-stack framework | SSR/SSG, routing, API | Core framework |
| React | UI library | Required by Next.js | Core framework |
| tRPC | API layer | Type safety, no codegen | ~15KB |
| Prisma | ORM | Type-safe DB queries | Server-only |
| NextAuth.js | Authentication | Secure session mgmt | ~30KB |
| Tailwind CSS | Styling | Minimal CSS, responsive | ~5KB (purged) |
| Zod | Validation | Runtime types, shared | ~10KB |
| React Hook Form | Forms | Performance, validation | ~8KB |

**Total Client Bundle Impact**: ~68KB (well under 200KB target)
**Server Dependencies**: Prisma, Bcrypt, database drivers (no client impact)

---

## Architecture Patterns

**Layered Architecture**:
```
Presentation Layer (React Components)
        ↓
API Layer (tRPC Procedures)
        ↓
Service Layer (Business Logic)
        ↓
Data Layer (Prisma Models)
        ↓
Database (PostgreSQL)
```

**Separation of Concerns**:
- `src/app/`: Pages and layouts (presentation)
- `src/server/api/routers/`: tRPC procedures (API)
- `src/lib/`: Business logic and utilities (services)
- `prisma/`: Data model and migrations (data)

**Type Safety Flow**:
- Prisma generates types from schema
- Zod validates runtime data
- tRPC infers types from Zod schemas
- React components use inferred tRPC types

---

## Security Considerations

1. **Authentication**: Secure password hashing, session management
2. **Authorization**: Middleware protection for authenticated routes
3. **Input Validation**: Zod validation on all inputs (client + server)
4. **SQL Injection**: Prevented by Prisma (parameterized queries)
5. **XSS**: React escapes by default, validate HTML if needed
6. **CSRF**: NextAuth.js provides CSRF tokens
7. **Rate Limiting**: Implement on login endpoint
8. **Environment Variables**: Never expose secrets to client

---

## Deployment Considerations

**Development Environment**:
- Docker Compose for local PostgreSQL
- Commands:
  - `docker-compose up -d` - Start database
  - `docker-compose down` - Stop database
  - `docker-compose logs postgres` - View logs
  - `docker-compose exec postgres psql -U postgres` - Access database shell
- DATABASE_URL in .env.local: `postgresql://postgres:postgres@localhost:5432/client_product_manager`

**Production Environment**:
- Vercel (recommended for Next.js)
- Database: Vercel Postgres or external PostgreSQL (managed service)
- Environment variables: Stored securely in platform
- HTTPS: Automatic with Vercel
- No Docker needed (managed database)

**CI/CD Pipeline**:
1. Start test database (Docker in CI)
2. Run tests (Vitest + Playwright)
3. Type checking (TypeScript)
4. Linting (ESLint)
5. Build verification
6. Deploy to staging
7. Run E2E tests on staging
8. Deploy to production

---

*Research complete - all technical decisions documented and justified*

