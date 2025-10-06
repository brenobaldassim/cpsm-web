# Quickstart: Sales and Client Management System

**Feature**: 001-build-an-application  
**Date**: 2025-10-05  
**Purpose**: Acceptance test scenarios for validating feature completion

## Prerequisites

1. **Docker Setup**:
   ```bash
   # Start PostgreSQL database with Docker Compose
   docker-compose up -d
   
   # Verify database is running
   docker-compose ps
   
   # View database logs (optional)
   docker-compose logs postgres
   ```

2. **Environment Setup**:
   ```bash
   # Copy environment variables template
   cp .env.example .env.local
   
   # Install dependencies
   npm install
   
   # Setup database (migrations)
   npx prisma migrate dev
   
   # Seed database with test data
   npx prisma db seed
   
   # Start development server
   npm run dev
   ```

3. **Test Data**: Seed script creates:
   - Admin user: `admin` / `password123`
   - 5 sample clients with addresses
   - 10 sample products with stock
   - 20 sample sales (last 60 days)

4. **Access Application**: http://localhost:3000

5. **Stopping Services**:
   ```bash
   # Stop development server: Ctrl+C
   
   # Stop database (keeps data)
   docker-compose stop
   
   # Stop and remove database (removes data)
   docker-compose down
   
   # Stop and remove database with volumes (full cleanup)
   docker-compose down -v
   ```

---

## Scenario 1: User Authentication

**Objective**: Verify multi-user authentication with username/password.

### Steps:

1. **Navigate to Application**
   - Open http://localhost:3000
   - Expected: Redirected to login page (/login)

2. **Login with Invalid Credentials**
   - Enter username: `invalid`
   - Enter password: `wrongpass`
   - Click "Login"
   - Expected: Error message "Invalid username or password"
   - Expected: Remain on login page

3. **Login with Valid Credentials**
   - Enter username: `admin`
   - Enter password: `password123`
   - Click "Login"
   - Expected: Redirected to dashboard (/)
   - Expected: See "Welcome, admin" or similar greeting

4. **Verify Session Persistence**
   - Refresh the page
   - Expected: Remain logged in
   - Expected: Still on dashboard

5. **Logout**
   - Click "Logout" button
   - Expected: Redirected to login page
   - Expected: Session terminated

6. **Verify Protected Routes**
   - Try accessing /clients directly
   - Expected: Redirected to login page

**Acceptance Criteria**:
- ✅ Unauthenticated users cannot access protected pages
- ✅ Login works with valid credentials
- ✅ Login fails with invalid credentials
- ✅ Session persists across page refreshes
- ✅ Logout terminates session

---

## Scenario 2: Client Management

**Objective**: Verify complete CRUD operations for clients with Brazilian validation.

### Steps:

1. **Navigate to Clients**
   - Login as admin
   - Click "Clients" in navigation
   - Expected: See list of existing clients
   - Expected: URL: /clients

2. **View Client List**
   - Expected: Table with columns: Name, Email, CPF, Actions
   - Expected: Pagination controls visible
   - Expected: "Add Client" button present

3. **Create Client with One Address**
   - Click "Add Client"
   - Fill form:
     - First Name: `João`
     - Last Name: `Silva`
     - Email: `joao.silva@example.com`
     - CPF: `123.456.789-09` (valid format)
     - Social Media: `@joaosilva`
     - Address Type: HOME
     - Street: `Rua das Flores`
     - Number: `123`
     - City: `São Paulo`
     - State: `SP`
     - CEP: `01234-567`
   - Click "Save"
   - Expected: Success message
   - Expected: Redirected to client list
   - Expected: New client visible in list

4. **Create Client with Two Addresses**
   - Click "Add Client"
   - Fill basic info:
     - First Name: `Maria`
     - Last Name: `Santos`
     - Email: `maria@example.com`
     - CPF: `987.654.321-00`
   - Add HOME address (complete all fields)
   - Click "Add Another Address"
   - Add WORK address (complete all fields)
   - Click "Save"
   - Expected: Client created with both addresses

5. **Test CPF Validation**
   - Click "Add Client"
   - Enter CPF: `123.456.789-00` (invalid check digits)
   - Try to save
   - Expected: Validation error "Invalid CPF check digits"
   - Expected: Form not submitted

6. **Test Duplicate CPF**
   - Try creating client with CPF: `123.456.789-09` (already exists)
   - Expected: Error "CPF already registered"

7. **Edit Client**
   - Click "Edit" on João Silva
   - Change Last Name to: `Silva Santos`
   - Update Social Media to: `@joaosilvasantos`
   - Click "Save"
   - Expected: Changes saved
   - Expected: Updated info visible in list

8. **Delete Client Without Sales**
   - Create a new client (no sales)
   - Click "Delete" on that client
   - Confirm deletion
   - Expected: Client deleted
   - Expected: Removed from list

9. **Try to Delete Client With Sales**
   - Find a client with existing sales
   - Click "Delete"
   - Expected: Error message "Cannot delete client with sales history"
   - Expected: Client NOT deleted

**Acceptance Criteria**:
- ✅ Can create clients with 1 or 2 addresses
- ✅ CPF validation enforced (format + check digits)
- ✅ CEP validation enforced
- ✅ Cannot have duplicate CPF
- ✅ Can edit client information
- ✅ Can delete clients without sales
- ✅ Cannot delete clients with sales
- ✅ All fields validated properly

---

## Scenario 3: Product Management with Stock Tracking

**Objective**: Verify product CRUD and stock management.

### Steps:

1. **Navigate to Products**
   - Click "Products" in navigation
   - Expected: List of products with stock levels
   - Expected: URL: /products

2. **Create Product**
   - Click "Add Product"
   - Fill form:
     - Name: `Laptop Dell Inspiron`
     - Price: `2500.00` (will be stored as 250000 cents)
     - Stock Quantity: `15`
   - Click "Save"
   - Expected: Product created
   - Expected: Visible in list with correct price and stock

3. **Test Price Validation**
   - Click "Add Product"
   - Enter price: `0`
   - Expected: Validation error "Price must be positive"
   - Enter price: `-100`
   - Expected: Validation error "Price must be positive"

4. **Test Stock Validation**
   - Enter stock: `-5`
   - Expected: Validation error "Stock cannot be negative"

5. **Edit Product Price**
   - Note current product price (e.g., Laptop = R$ 2,500.00)
   - Click "Edit" on Laptop
   - Change price to: `2800.00`
   - Click "Save"
   - Expected: Price updated
   - Expected: Historical sales still show old price (verify in Scenario 4)

6. **Edit Product Stock**
   - Edit Laptop product
   - Change stock from 15 to 20
   - Click "Save"
   - Expected: Stock updated

7. **Search Products**
   - Enter "Laptop" in search box
   - Expected: Filtered results showing only matching products

8. **Filter In-Stock Products**
   - Toggle "In Stock Only" filter
   - Expected: Only products with stock > 0 displayed

9. **Delete Product Without Sales**
   - Create a new product (no sales yet)
   - Click "Delete"
   - Confirm deletion
   - Expected: Product deleted

10. **Try to Delete Product With Sales**
    - Find a product used in sales
    - Click "Delete"
    - Expected: Error "Cannot delete product with sales history"
    - Expected: Product NOT deleted

**Acceptance Criteria**:
- ✅ Can create products with valid price and stock
- ✅ Price and stock validation enforced
- ✅ Can edit product information
- ✅ Price changes don't affect historical sales
- ✅ Can delete products without sales
- ✅ Cannot delete products with sales
- ✅ Search and filtering work correctly

---

## Scenario 4: Sales Creation with Stock Management

**Objective**: Verify sales creation, stock deduction, and price preservation.

### Steps:

1. **Navigate to Sales**
   - Click "Sales" in navigation
   - Expected: List of sales from last 30 days
   - Expected: URL: /sales

2. **View Sales List**
   - Expected: Table with: Date, Client, Total Amount, Actions
   - Expected: Default showing last 30 days
   - Expected: "Create Sale" button visible

3. **Create Sale with One Product**
   - Click "Create Sale"
   - Select Client: `João Silva`
   - Set Sale Date: Today
   - Add Product:
     - Product: `Laptop Dell Inspiron`
     - Quantity: `2`
   - Expected: Price auto-filled from product (R$ 2,800.00)
   - Expected: Line total calculated: R$ 5,600.00
   - Expected: Sale total: R$ 5,600.00
   - Click "Save"
   - Expected: Sale created
   - Expected: Stock decreased by 2 (20 → 18)

4. **Verify Stock Deduction**
   - Navigate to Products
   - Find Laptop Dell Inspiron
   - Expected: Stock now shows 18 (was 20)

5. **Create Sale with Multiple Products**
   - Create new sale
   - Select Client: `Maria Santos`
   - Add multiple products:
     - Product A: Quantity 1
     - Product B: Quantity 3
     - Product C: Quantity 2
   - Expected: Total amount = sum of all line totals
   - Click "Save"
   - Expected: All product stocks decremented correctly

6. **Test Stock Validation**
   - Find a product with stock = 5
   - Try to create sale with quantity = 6
   - Expected: Error "Insufficient stock available"
   - Expected: Sale NOT created
   - Expected: Stock unchanged

7. **Verify Price Preservation**
   - Note the Laptop price in a previous sale (R$ 2,500.00)
   - Go to Products and verify current price (R$ 2,800.00)
   - View the old sale detail
   - Expected: Sale still shows R$ 2,500.00 per unit
   - Expected: Total calculated with old price, not new price

8. **Test Required Fields**
   - Try to create sale without client
   - Expected: Validation error "Client is required"
   - Try to create sale without products
   - Expected: Validation error "At least one product required"

**Acceptance Criteria**:
- ✅ Can create sales with one or multiple products
- ✅ Stock automatically decremented on sale creation
- ✅ Cannot sell more than available stock
- ✅ Price captured at time of sale (snapshot)
- ✅ Historical sales show original prices
- ✅ Total amount calculated correctly
- ✅ All validations enforced

---

## Scenario 5: Sales Filtering and Date Ranges

**Objective**: Verify sales filtering by date and client.

### Steps:

1. **View Default Sales (Last 30 Days)**
   - Navigate to /sales
   - Expected: Sales from last 30 days displayed
   - Note the count

2. **Filter by Date Range**
   - Click "Filter" or date picker
   - Select date range: Last 7 days
   - Apply filter
   - Expected: Only sales from last 7 days shown
   - Expected: Count less than or equal to 30-day view

3. **Filter by Custom Date Range**
   - Select specific dates (e.g., 2025-09-01 to 2025-09-30)
   - Apply filter
   - Expected: Only sales in that range displayed

4. **Filter by Client**
   - Select client: `João Silva`
   - Expected: Only João's sales displayed
   - Expected: Client name shown in all rows

5. **Combined Filters**
   - Select date range: Last 30 days
   - Select client: `Maria Santos`
   - Apply filters
   - Expected: Maria's sales in last 30 days only

6. **Clear Filters**
   - Click "Clear Filters" or remove filter chips
   - Expected: Return to default view (last 30 days, all clients)

7. **View Sale Detail**
   - Click on any sale
   - Expected: See full details:
     - Client information
     - Sale date
     - All products with quantities
     - Individual line totals
     - Grand total

8. **Test Empty Results**
   - Filter with date range that has no sales
   - Expected: Empty state message
   - Expected: No errors

**Acceptance Criteria**:
- ✅ Default view shows last 30 days
- ✅ Can filter by date range
- ✅ Can filter by client
- ✅ Filters work in combination
- ✅ Can clear filters
- ✅ Empty results handled gracefully
- ✅ Sale details show complete information

---

## Scenario 6: Responsive Design Validation

**Objective**: Verify responsive design across device sizes.

### Device Breakpoints to Test:
- Mobile Small: 320px
- Mobile: 375px
- Tablet: 768px
- Desktop Small: 1024px
- Desktop: 1440px
- Desktop Large: 1920px

### Steps:

1. **Mobile View (375px)**
   - Resize browser to 375px width
   - Expected: Navigation collapses to hamburger menu
   - Expected: Tables adapt (card layout or horizontal scroll)
   - Expected: Forms stack vertically
   - Expected: Buttons are at least 44×44px (touch-friendly)
   - Expected: No horizontal scrolling for content

2. **Tablet View (768px)**
   - Resize to 768px
   - Expected: Navigation may still be hamburger or expand
   - Expected: Tables show in responsive mode
   - Expected: Two-column forms where appropriate
   - Expected: Touch targets remain accessible

3. **Desktop View (1440px)**
   - Resize to 1440px
   - Expected: Full navigation visible
   - Expected: Tables show all columns
   - Expected: Optimal spacing and layout
   - Expected: No wasted space

4. **Test Touch Interactions (Mobile)**
   - On mobile device or emulator
   - Test:
     - Tap buttons (should respond immediately)
     - Swipe to delete (if implemented)
     - Tap form fields (keyboard appears)
     - Scroll lists smoothly

5. **Verify Text Readability**
   - At 320px: Text should be readable without zoom
   - At all breakpoints: No text cutoff
   - Contrast meets accessibility standards

**Acceptance Criteria**:
- ✅ Navigation adapts to screen size
- ✅ Tables responsive on small screens
- ✅ Forms usable on mobile
- ✅ Touch targets meet 44×44px minimum
- ✅ No horizontal scrolling required
- ✅ Text readable at all sizes
- ✅ Images scale appropriately

---

## Scenario 7: Performance and SEO

**Objective**: Verify SSR/SSG and performance targets.

### Steps:

1. **Test Server-Side Rendering**
   - Disable JavaScript in browser
   - Navigate to /sales
   - Expected: Content visible (rendered on server)
   - Expected: No blank page

2. **Verify Page Load Performance**
   - Open Chrome DevTools → Lighthouse
   - Run audit on dashboard page
   - Expected: Performance score > 80
   - Expected: LCP < 2.5s
   - Expected: FID < 100ms
   - Expected: CLS < 0.1

3. **Check Initial Bundle Size**
   - Run: `npm run build`
   - Check build output
   - Expected: Initial JS bundle < 200KB (gzipped)

4. **Verify SEO Tags**
   - View page source on dashboard
   - Expected: `<title>` tag present
   - Expected: `<meta name="description">` present
   - Expected: Proper heading hierarchy (H1, H2, etc.)

5. **Test API Response Times**
   - Open Network tab
   - Perform actions (list clients, create sale)
   - Expected: API responses < 200ms (p95)

**Acceptance Criteria**:
- ✅ Pages render on server (SSR)
- ✅ Core Web Vitals in "Good" range
- ✅ Initial bundle < 200KB gzipped
- ✅ SEO metadata present
- ✅ API responses fast

---

## Scenario 8: Error Handling and Edge Cases

**Objective**: Verify graceful error handling.

### Steps:

1. **Test Network Errors**
   - Simulate offline mode
   - Try to save a client
   - Expected: User-friendly error message
   - Expected: No technical errors exposed

2. **Test Validation Errors**
   - Enter invalid email format
   - Expected: Inline validation message
   - Expected: Field highlighted in red

3. **Test Loading States**
   - Slow down network (DevTools → Network → Slow 3G)
   - Navigate between pages
   - Expected: Loading spinners or skeletons
   - Expected: No blank pages

4. **Test Empty States**
   - Filter sales with no results
   - Expected: "No sales found" message
   - Expected: Helpful suggestions (clear filters, create sale)

5. **Test Browser Back Button**
   - Create a client
   - Click browser back
   - Expected: Return to previous page
   - Expected: No errors

**Acceptance Criteria**:
- ✅ Network errors handled gracefully
- ✅ Validation errors clear and helpful
- ✅ Loading states shown for async operations
- ✅ Empty states user-friendly
- ✅ Browser navigation works correctly

---

## Validation Checklist

### Functional Requirements
- [ ] Multi-user authentication works
- [ ] Client CRUD with CPF and address validation
- [ ] Product CRUD with price and stock management
- [ ] Sales creation with multiple products
- [ ] Automatic stock deduction
- [ ] Price preservation in historical sales
- [ ] Deletion protection for entities with sales
- [ ] Date range filtering (default: last 30 days)
- [ ] Client filtering

### Non-Functional Requirements
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Touch targets ≥ 44×44px
- [ ] Page load < 2s desktop, < 3s mobile
- [ ] API responses < 200ms
- [ ] Initial bundle < 200KB gzipped
- [ ] SSR/SSG implemented
- [ ] SEO metadata present
- [ ] Accessibility standards met

### User Experience
- [ ] Loading states for async operations
- [ ] Error messages user-friendly
- [ ] Form validation inline
- [ ] Success/error feedback consistent
- [ ] Navigation intuitive
- [ ] Empty states helpful

---

## Troubleshooting

### Common Issues:

1. **Docker Not Running**
   - Error: "Cannot connect to the Docker daemon"
   - Solution: Start Docker Desktop or Docker service
   - Verify: `docker --version`

2. **Database Container Not Starting**
   - Solution: Check if port 5432 is already in use
   - Check logs: `docker-compose logs postgres`
   - Restart: `docker-compose down && docker-compose up -d`

3. **Database Connection Error**
   - Error: "Can't reach database server"
   - Solution: Verify Docker container is running: `docker-compose ps`
   - Check DATABASE_URL in .env.local: `postgresql://postgres:postgres@localhost:5432/client_product_manager`
   - Wait for health check: Database takes ~5 seconds to be ready

4. **Port 5432 Already in Use**
   - Solution: Stop local PostgreSQL if installed: `sudo service postgresql stop`
   - Or change port in docker-compose.yml to `5433:5432`
   - Update DATABASE_URL in .env.local accordingly

5. **Port 3000 Already in Use (Next.js)**
   - Solution: Kill process on port 3000
   - Or change port: `npm run dev -- -p 3001`

6. **Authentication Not Working**
   - Solution: Check NEXTAUTH_SECRET in .env.local
   - Clear browser cookies
   - Verify NEXTAUTH_URL is set correctly

7. **Seed Data Not Loading**
   - Solution: Run `npx prisma db seed` manually
   - Check seed script for errors
   - Verify database is accessible

8. **Prisma Migration Errors**
   - Solution: Reset database: `npx prisma migrate reset`
   - Or manually: `docker-compose down -v && docker-compose up -d`
   - Then run: `npx prisma migrate dev`

9. **Docker Volume Issues**
   - Error: "Permission denied" or data persistence issues
   - Solution: Remove volumes: `docker-compose down -v`
   - Restart fresh: `docker-compose up -d`
   - Re-run migrations and seed

---

## Success Criteria

All 8 scenarios must pass for feature acceptance:

1. ✅ Authentication
2. ✅ Client Management
3. ✅ Product Management
4. ✅ Sales Creation
5. ✅ Sales Filtering
6. ✅ Responsive Design
7. ✅ Performance & SEO
8. ✅ Error Handling

**Feature Complete**: All acceptance criteria met ✅

