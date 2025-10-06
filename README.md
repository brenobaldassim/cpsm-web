# Client & Product Manager

A sales and client management system with real-time inventory tracking, built with Next.js, tRPC, Prisma, and PostgreSQL.

## Features

- 🔐 **Multi-user Authentication** with NextAuth.js
- 👥 **Client Management** with Brazilian CPF and address validation
- 📦 **Product Management** with stock tracking
- 💰 **Sales Management** with automatic stock deduction and price preservation
- 📊 **Dashboard** with summary statistics
- 📱 **Responsive Design** (mobile, tablet, desktop)
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **API Layer**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose (for database)
- pnpm (install globally: `npm install -g pnpm` or use Corepack: `corepack enable`)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd client-product-manager

# Install dependencies with pnpm
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment variables template
cp .env.example .env.local
```

Edit `.env.local` and configure the following:

```env
# Database Connection (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/client_product_manager"

# NextAuth Configuration
NEXTAUTH_SECRET="your-random-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Optional: Production overrides
# NODE_ENV="production"
```

> **Note**: The `DATABASE_URL` shown above matches the Docker Compose configuration. If you're using a different database setup, update accordingly.

### 3. Start Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Verify database is running
docker-compose ps
```

### 4. Database Setup

```bash
# Run migrations to create tables
pnpm exec prisma migrate dev

# Seed database with test data
pnpm exec prisma db seed
```

### 5. Start Development Server

```bash
# Start Next.js development server
pnpm dev

# Application will be available at http://localhost:3000
```

### 6. Login

Use the seeded admin account:
- **Email**: `admin@example.com`
- **Password**: `password123`

## Available Scripts

```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm format         # Format code with Prettier
pnpm type-check     # Run TypeScript type checking
pnpm test           # Run unit tests (Vitest)
pnpm test:ui        # Run tests with UI
pnpm test:coverage  # Run tests with coverage
pnpm test:e2e       # Run E2E tests (Playwright)
pnpm test:e2e:ui    # Run E2E tests with UI
pnpm db:seed        # Seed database with test data
```

## Project Structure

```
client-product-manager/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── login/             # Login page
│   ├── DashboardContent.tsx
├── src/
│   ├── app/               # Additional pages
│   │   ├── clients/       # Client management
│   │   ├── products/      # Product management
│   │   └── sales/         # Sales management
│   ├── components/        # React components
│   │   ├── forms/         # Form components
│   │   ├── data-tables/   # Data table component
│   │   ├── layouts/       # Layout components
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── server/            # Backend code
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   └── api/           # tRPC routers
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed script
├── tests/                 # Test files
│   ├── contract/          # Contract tests
│   ├── integration/       # E2E tests
│   └── unit/              # Unit tests
└── specs/                 # Feature specifications
```

## Database Schema

- **User**: Authentication and user management
- **Client**: Customer information with CPF and addresses
- **Address**: Home and work addresses (Brazilian format with CEP)
- **Product**: Products with price and stock tracking
- **Sale**: Sales transactions with client and date
- **SaleItem**: Individual products in a sale (price snapshot for historical accuracy)

## Development Workflow

1. **Docker**: Start database with `docker-compose up -d`
2. **Development**: Run `pnpm dev` to start the development server
3. **Migrations**: Create with `pnpm exec prisma migrate dev --name description`
4. **Testing**: Run `pnpm test` for unit tests, `pnpm test:e2e` for E2E tests
5. **Type Safety**: Run `pnpm type-check` before committing
6. **Formatting**: Run `pnpm format` to format code

## Key Features

### Client Management
- Create clients with Brazilian CPF validation
- Add up to 2 addresses (HOME and WORK)
- Brazilian postal code (CEP) validation
- Edit client information
- Delete clients (only if no sales exist)

### Product Management
- Create products with name, price (in cents), and stock quantity
- Edit product information
- Track stock levels
- Delete products (only if no sales exist)

### Sales Management
- Create sales with multiple products
- Automatic stock deduction
- Price preservation (historical sales show original prices)
- View sales from last 30 days by default
- Filter sales by date range
- View detailed sale information

### Authentication
- Email/password login
- Protected routes
- Session management
- Multi-user support

## Testing

### Unit Tests
```bash
# Run all unit tests
pnpm test

# Run with watch mode
pnpm test --watch

# Run with coverage report
pnpm test:coverage

# Run specific test file
pnpm test tests/unit/cpf-validation.test.ts
```

### Contract Tests
```bash
# Contract tests validate tRPC API schemas
pnpm test tests/contract
```

### Integration Tests (E2E)
```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install

# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm exec playwright test tests/integration/auth.spec.ts
```

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to database
```bash
# Check if Docker is running
docker ps

# Check if PostgreSQL container is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart

# If port 5432 is already in use, stop local PostgreSQL
sudo service postgresql stop  # Linux
brew services stop postgresql # macOS
```

**Problem**: Database health check failing
```bash
# Wait 10-15 seconds for PostgreSQL to initialize
# Check health status
docker-compose ps

# If still unhealthy, restart with clean state
docker-compose down -v
docker-compose up -d
```

### Prisma Issues

**Problem**: Schema changes not reflected
```bash
# Generate Prisma client
pnpm exec prisma generate

# Create and apply migration
pnpm exec prisma migrate dev --name description

# Reset database (WARNING: destroys all data)
pnpm exec prisma migrate reset
```

**Problem**: Type errors in Prisma client
```bash
# Regenerate Prisma client and restart TypeScript server
pnpm exec prisma generate
# In your IDE: Restart TypeScript Server
```

**Useful Prisma Commands**
```bash
# View database in browser (GUI)
pnpm exec prisma studio

# Validate schema without applying
pnpm exec prisma validate

# Check migration status
pnpm exec prisma migrate status

# Deploy migrations (production)
pnpm exec prisma migrate deploy
```

### Port Already in Use

**Port 3000 (Next.js)**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
pnpm dev -- -p 3001
```

**Port 5432 (PostgreSQL)**
```bash
# Stop local PostgreSQL
sudo service postgresql stop  # Linux
brew services stop postgresql # macOS

# Or change port in docker-compose.yml to 5433:5432
# Then update DATABASE_URL to localhost:5433
```

### pnpm Issues

**Problem**: pnpm not found
```bash
# Install pnpm globally
npm install -g pnpm

# Or enable via Corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

**Problem**: Dependency installation fails
```bash
# Clear pnpm cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Authentication Issues

**Problem**: Cannot login / "Invalid credentials"
```bash
# Verify seed data was created
pnpm exec prisma studio
# Check if admin@example.com exists in User table

# Re-seed database
pnpm exec prisma db seed
```

**Problem**: "NEXTAUTH_SECRET not found"
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Build Issues

**Problem**: Type errors during build
```bash
# Run type check to see all errors
pnpm type-check

# Check for missing dependencies
pnpm install
```

**Problem**: Linting errors
```bash
# Run linter
pnpm lint

# Auto-fix linting issues
pnpm lint --fix
```

## Performance & Optimization

- **Bundle Size**: Optimized to <200KB gzipped for initial load
- **API Response Time**: <200ms p95 for all tRPC procedures
- **Page Load**: <2s desktop, <3s mobile on 3G
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Code Splitting**: Automatic route-based splitting by Next.js
- **Image Optimization**: Using Next.js Image component
- **Database**: Connection pooling via Prisma

## Accessibility

This application follows WCAG 2.1 AA standards:
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Color contrast ratios (4.5:1 for text, 3:1 for large text)
- ✅ Touch targets ≥ 44×44px on mobile
- ✅ Semantic HTML and ARIA labels
- ✅ Focus indicators on interactive elements

## Production Deployment

### Environment Variables
Configure these in your hosting platform:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Deployment Steps
```bash
# 1. Run database migrations
pnpm exec prisma migrate deploy

# 2. Build the application
pnpm build

# 3. Start the production server
pnpm start
```

### Recommended Hosting Platforms
- **Vercel**: Zero-config deployment for Next.js (recommended)
- **Railway**: Includes PostgreSQL database
- **Render**: Supports Docker and PostgreSQL
- **AWS**: EC2 + RDS or ECS + RDS
- **DigitalOcean**: App Platform or Droplet + Managed PostgreSQL

### Docker Deployment (Optional)
```bash
# Build Docker image
docker build -t client-product-manager .

# Run with docker-compose (production)
docker-compose -f docker-compose.prod.yml up -d
```

## Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **HTTPS**: Required in production (enforced by middleware)
- **SQL Injection**: Protected by Prisma (parameterized queries)
- **XSS**: Protected by React (automatic escaping)
- **CSRF**: Protected by NextAuth (CSRF tokens)
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Zod schemas on client and server

## Contributing

1. Fork the repository
2. Create a new branch from `main`: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `pnpm test` and `pnpm test:e2e`
5. Run type checking: `pnpm type-check`
6. Format code: `pnpm format`
7. Run linter: `pnpm lint`
8. Commit with descriptive message
9. Push to your fork and submit a pull request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR

## Architecture

### Tech Stack Rationale
- **Next.js 15**: Server-side rendering, App Router, automatic code splitting
- **tRPC**: End-to-end type safety without code generation
- **Prisma**: Type-safe database access with migrations
- **PostgreSQL**: Robust relational database with ACID compliance
- **NextAuth.js**: Industry-standard authentication
- **Tailwind CSS**: Utility-first CSS for rapid development
- **Zod**: Runtime validation with TypeScript type inference

### Design Patterns
- **Repository Pattern**: Prisma acts as the data access layer
- **tRPC Routers**: Domain-driven API organization (auth, clients, products, sales)
- **React Server Components**: Reduced client-side JavaScript
- **Optimistic Updates**: Immediate UI feedback with React Query
- **Price Snapshot**: Historical data accuracy for sales

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, tRPC, Prisma, and PostgreSQL**
