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

# Edit .env.local and add:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000)
```

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

## Troubleshooting

### Database Connection Issues
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose restart

# View database logs
docker-compose logs postgres
```

### Prisma Issues
```bash
# Reset database
pnpm exec prisma migrate reset

# Generate Prisma client
pnpm exec prisma generate

# View database in browser
pnpm exec prisma studio
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Production Deployment

1. Set environment variables in your hosting platform
2. Run database migrations: `pnpm exec prisma migrate deploy`
3. Build the application: `pnpm build`
4. Start the server: `pnpm start`

## Contributing

1. Create a new branch from `main`
2. Make your changes
3. Run tests and type checking
4. Format code with Prettier
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
