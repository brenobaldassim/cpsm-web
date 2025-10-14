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

## Prerequisites

- Node.js 20+
- Docker & Docker Compose (for database)
- pnpm (install globally: `npm install -g pnpm` or use Corepack: `corepack enable`)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/brenobaldassim/cpsm-web
cd cpsm-web

# Install dependencies with pnpm
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment variables template
cp .env.example .env
```

### 3. Start Database

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d --build

# Verify database is running
docker-compose ps
```

### 4. Database Setup

```bash
# Generate prisma ORM
pnpm exec prisma generate

# Run migrations to create tables
pnpm exec prisma migrate dev

# Seed database with test data
pnpm exec prisma db seed
```

### 5. Start Development Server

```bash
# Start Next.js development server
pnpm dev

```

## Project Structure

```
cpms-web/
├── src/
│   ├── app/                            # Next.js App Router pages
│   │   ├── clients/                    # Client management
│   │   ├── products/                   # Product management
│   │   ├── sales/                      # Sales management
│   │   ├── login/                      # Login page
│   │   ├── page.tsx                    # Dashboard
│   │   └──components/                  # HomePage React components
│   │        └── DashboardContent.tsx
│   ├── components/                     # Global React components
│   │   ├── forms/                      # Form components
│   │   ├── data-tables/                # Data table component
│   │   ├── layouts/                    # Layout components
│   │   └── ui/                         # UI components (shadcn/ui)
│   ├── server/                         # Backend code
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── db.ts                       # Prisma client
│   │   └── api/                        # tRPC routers
│   ├── lib/                            # Utility functions
│   └── types/                          # TypeScript types
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── migrations/                     # Database migrations
│   └── seed.ts                         # Seed script
├── tests/                              # Test files
│   ├── contract/                       # Contract tests
│   ├── integration/                    # E2E tests
│   └── unit/                           # Unit tests
└── specs/                              # Feature specifications
```

## Database Schema

- **User**: Authentication and user management
- **Client**: Customer information with CPF and addresses
- **Address**: Home and work addresses (Brazilian format with CEP)
- **Product**: Products with price and stock tracking
- **Sale**: Sales transactions with client and date
- **SaleItem**: Individual products in a sale (price snapshot for historical accuracy)

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
