# Data Model: Sales and Client Management System

**Date**: 2025-10-05  
**Feature**: 001-build-an-application  
**Database**: PostgreSQL 15+  
**ORM**: Prisma 5

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id          │
│ email       │──┐
│ password    │  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
                 │
┌─────────────┐  │
│   Client    │  │
│─────────────│  │
│ id          │  │
│ firstName   │  │
│ lastName    │  │
│ email       │  │
│ cpf         │  │
│ socialMedia │  │
│ createdBy   │◀─┘
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│   Address   │
│─────────────│
│ id          │
│ clientId    │──┐
│ type        │  │ (HOME | WORK)
│ street      │  │
│ number      │  │
│ city        │  │
│ state       │  │
│ cep         │  │
└─────────────┘  │
                 │
┌─────────────┐  │
│   Product   │  │
│─────────────│  │
│ id          │  │
│ name        │  │
│ priceInCents│  │
│ stockQty    │  │
│ createdBy   │◀─┘
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │
       │ N:M (via SaleItem)
       │
┌──────▼──────┐
│    Sale     │
│─────────────│
│ id          │
│ clientId    │──┐
│ saleDate    │  │
│ totalAmount │  │
│ createdBy   │◀─┘
│ createdAt   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐
│  SaleItem   │
│─────────────│
│ id          │
│ saleId      │
│ productId   │
│ quantity    │
│ priceInCents│ (snapshot at sale time)
└─────────────┘
```

## Prisma Schema

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// Authentication & Users
// ============================================================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  clients  Client[]
  products Product[]
  sales    Sale[]

  @@index([email])
  @@map("users")
}

// ============================================================================
// Client Management
// ============================================================================

model Client {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String
  cpf         String   @unique // Brazilian tax ID (format: XXX.XXX.XXX-XX)
  socialMedia String?  // Optional social media handle
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  addresses Address[]
  sales     Sale[]
  createdBy String
  creator   User     @relation(fields: [createdBy], references: [id])

  @@index([email])
  @@index([cpf])
  @@index([lastName])
  @@map("clients")
}

enum AddressType {
  HOME
  WORK
}

model Address {
  id       String      @id @default(cuid())
  type     AddressType // HOME or WORK
  street   String
  number   String
  city     String
  state    String      // Brazilian state (e.g., SP, RJ)
  cep      String      // Brazilian postal code (format: #####-###)
  clientId String

  // Relations
  client Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([clientId])
  @@index([cep])
  @@map("addresses")
}

// ============================================================================
// Product Management
// ============================================================================

model Product {
  id           String   @id @default(cuid())
  name         String
  priceInCents Int      // Price in cents to avoid floating point issues
  stockQty     Int      @default(0) // Current stock quantity
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  saleItems SaleItem[]
  createdBy String
  creator   User       @relation(fields: [createdBy], references: [id])

  @@index([name])
  @@map("products")
}

// ============================================================================
// Sales Management
// ============================================================================

model Sale {
  id          String   @id @default(cuid())
  saleDate    DateTime @default(now()) // Date of the sale
  totalAmount Int      // Total amount in cents (calculated from SaleItems)
  clientId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  client    Client     @relation(fields: [clientId], references: [id], onDelete: Restrict)
  saleItems SaleItem[]
  createdBy String
  creator   User       @relation(fields: [createdBy], references: [id])

  @@index([clientId])
  @@index([saleDate])
  @@index([createdAt])
  @@map("sales")
}

model SaleItem {
  id           String @id @default(cuid())
  quantity     Int    // Quantity of product sold
  priceInCents Int    // Price at time of sale (snapshot for historical accuracy)
  saleId       String
  productId    String

  // Relations
  sale    Sale    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)

  @@index([saleId])
  @@index([productId])
  @@map("sale_items")
}
```

## Entity Descriptions

### User
Represents an authenticated user of the system who can perform CRUD operations on clients, products, and sales.

**Fields**:
- `id`: Unique identifier (CUID for URL safety)
- `email`: Unique email address for login
- `password`: Hashed password (bcrypt with cost factor 12)
- `createdAt`: Timestamp of user creation
- `updatedAt`: Timestamp of last update

**Relations**:
- One-to-many with Client (tracks who created each client)
- One-to-many with Product (tracks who created each product)
- One-to-many with Sale (tracks who created each sale)

**Business Rules**:
- Username must be unique
- Password must be hashed before storage
- Users cannot be deleted if they have associated data

---

### Client
Represents a customer or buyer who purchases products through sales transactions.

**Fields**:
- `id`: Unique identifier
- `firstName`: Client's first name (required)
- `lastName`: Client's last name (required)
- `email`: Client's email address (required)
- `cpf`: Brazilian tax ID (required, unique, format: XXX.XXX.XXX-XX)
- `socialMedia`: Social media handle (optional)
- `createdBy`: Reference to the user who created this client
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relations**:
- One-to-many with Address (can have up to 2 addresses: HOME and WORK)
- One-to-many with Sale (purchase history)
- Many-to-one with User (creator)

**Business Rules**:
- CPF must be unique across all clients
- CPF must pass validation algorithm
- Email must be valid format
- Can have maximum 2 addresses (one HOME, one WORK)
- Cannot be deleted if associated sales exist (referential integrity)
- All fields except socialMedia are required

**Indexes**:
- email (for quick lookups)
- cpf (for unique constraint and lookups)
- lastName (for alphabetical sorting)

---

### Address
Represents a physical location (home or work) associated with a client. Brazilian address format.

**Fields**:
- `id`: Unique identifier
- `type`: Enum (HOME | WORK) - address type
- `street`: Street name and details
- `number`: Building/house number
- `city`: City name
- `state`: Brazilian state code (e.g., SP, RJ, MG)
- `cep`: Brazilian postal code (format: #####-###)
- `clientId`: Reference to parent client

**Relations**:
- Many-to-one with Client (belongs to one client)

**Business Rules**:
- CEP must match format: #####-###
- All fields are required
- A client can have at most one HOME and one WORK address
- Cascade delete when client is deleted

**Indexes**:
- clientId (for efficient joins)
- cep (for postal code lookups)

---

### Product
Represents an item available for sale with current pricing and stock information.

**Fields**:
- `id`: Unique identifier
- `name`: Product name (required)
- `priceInCents`: Current price in cents (integer to avoid floating point issues)
- `stockQty`: Current quantity in stock
- `createdBy`: Reference to the user who created this product
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relations**:
- One-to-many with SaleItem (sale history)
- Many-to-one with User (creator)

**Business Rules**:
- Price must be positive (> 0)
- Stock quantity must be non-negative (>= 0)
- Stock automatically decrements when sales are created
- Price changes only affect future sales (historical prices preserved in SaleItem)
- Cannot be deleted if associated sales exist (referential integrity)
- All fields are required

**Indexes**:
- name (for search and sorting)

---

### Sale
Represents a transaction where a client purchases one or more products. Contains sale date and calculated total amount.

**Fields**:
- `id`: Unique identifier
- `saleDate`: Date/time of the sale transaction
- `totalAmount`: Total sale amount in cents (sum of all SaleItems)
- `clientId`: Reference to the client who made the purchase
- `createdBy`: Reference to the user who created this sale
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relations**:
- Many-to-one with Client (buyer)
- One-to-many with SaleItem (products in this sale)
- Many-to-one with User (creator)

**Business Rules**:
- Must have at least one SaleItem
- Total amount is automatically calculated from SaleItems
- Sale date defaults to creation time but can be set manually
- Cannot delete associated Client (referential integrity with RESTRICT)
- Historical data immutability (sales should not be deleted; consider soft delete if needed)
- Stock quantities must be validated before sale creation

**Indexes**:
- clientId (for customer purchase history)
- saleDate (for date range filtering)
- createdAt (for recent sales queries)

---

### SaleItem
Represents a line item in a sale, linking a specific product with quantity and price snapshot.

**Fields**:
- `id`: Unique identifier
- `quantity`: Number of units sold
- `priceInCents`: Price per unit at time of sale (snapshot)
- `saleId`: Reference to parent sale
- `productId`: Reference to the product sold

**Relations**:
- Many-to-one with Sale (belongs to one sale)
- Many-to-one with Product (references one product)

**Business Rules**:
- Quantity must be positive (> 0)
- Price is captured from Product at time of sale
- Price snapshot ensures historical accuracy even if product price changes
- Cannot delete associated Product (referential integrity with RESTRICT)
- Cascade delete when parent Sale is deleted
- Line total = quantity × priceInCents

**Indexes**:
- saleId (for efficient joins)
- productId (for product sales history)

---

## Validation Rules

### CPF Validation
```typescript
// Format: XXX.XXX.XXX-XX (11 digits)
function validateCPF(cpf: string): boolean {
  // Remove formatting
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false; // All same digit
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit1 = 11 - (sum % 11);
  if (checkDigit1 >= 10) checkDigit1 = 0;
  
  if (parseInt(cleanCPF.charAt(9)) !== checkDigit1) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let checkDigit2 = 11 - (sum % 11);
  if (checkDigit2 >= 10) checkDigit2 = 0;
  
  return parseInt(cleanCPF.charAt(10)) === checkDigit2;
}
```

### CEP Validation
```typescript
// Format: #####-### (8 digits)
const cepRegex = /^\d{5}-?\d{3}$/;

function validateCEP(cep: string): boolean {
  return cepRegex.test(cep);
}
```

### Email Validation
```typescript
// Standard email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Price and Quantity Validation
```typescript
// Prices must be positive integers (cents)
function validatePrice(priceInCents: number): boolean {
  return Number.isInteger(priceInCents) && priceInCents > 0;
}

// Stock quantity must be non-negative integer
function validateStockQty(qty: number): boolean {
  return Number.isInteger(qty) && qty >= 0;
}

// Sale quantity must be positive integer
function validateSaleQty(qty: number): boolean {
  return Number.isInteger(qty) && qty > 0;
}
```

---

## Cascading Rules

| Parent | Child | On Delete | Rationale |
|--------|-------|-----------|-----------|
| User | Client | RESTRICT | Preserve creator information |
| User | Product | RESTRICT | Preserve creator information |
| User | Sale | RESTRICT | Preserve creator information |
| Client | Address | CASCADE | Addresses have no meaning without client |
| Client | Sale | RESTRICT | Prevent data loss, preserve sales history |
| Product | SaleItem | RESTRICT | Prevent data loss, preserve sales history |
| Sale | SaleItem | CASCADE | Sale items have no meaning without sale |

---

## Indexes Strategy

**Performance Considerations**:

1. **Unique Constraints**:
   - `User.email` - Login lookups
   - `Client.cpf` - Prevent duplicates, enable fast lookup

2. **Foreign Key Indexes**:
   - `Address.clientId` - Join performance
   - `Sale.clientId` - Customer history queries
   - `SaleItem.saleId` - Sale detail queries
   - `SaleItem.productId` - Product sales history

3. **Query Optimization**:
   - `Client.email` - Email-based searches
   - `Client.lastName` - Alphabetical sorting
   - `Product.name` - Product searches
   - `Sale.saleDate` - Date range filtering
   - `Sale.createdAt` - Recent sales queries
   - `Address.cep` - Postal code lookups

---

## Migration Strategy

1. **Initial Migration**: Create all tables and relationships
2. **Seed Data**: Create default admin user, sample clients/products (for development)
3. **Production Setup**: 
   - Enable connection pooling
   - Configure backup schedule
   - Set up monitoring for slow queries
   - Implement point-in-time recovery

---

## Sample Queries (for reference)

```typescript
// Get client with addresses
const client = await prisma.client.findUnique({
  where: { id: clientId },
  include: { addresses: true }
});

// Get sales for last 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const recentSales = await prisma.sale.findMany({
  where: {
    saleDate: { gte: thirtyDaysAgo }
  },
  include: {
    client: true,
    saleItems: {
      include: { product: true }
    }
  },
  orderBy: { saleDate: 'desc' }
});

// Create sale with multiple products
const sale = await prisma.sale.create({
  data: {
    clientId,
    saleDate: new Date(),
    totalAmount: calculatedTotal,
    createdBy: userId,
    saleItems: {
      create: [
        { productId: prod1, quantity: 2, priceInCents: prod1Price },
        { productId: prod2, quantity: 1, priceInCents: prod2Price }
      ]
    }
  }
});

// Check if client can be deleted
const salesCount = await prisma.sale.count({
  where: { clientId }
});
const canDelete = salesCount === 0;
```

---

*Data model complete and ready for implementation*

