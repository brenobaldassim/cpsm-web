export interface ProductsListPageParams {
  page?: string
  search?: string
  inStockOnly?: string
  sortBy?: "name" | "priceInCents" | "stockQty" | "createdAt"
  sortOrder?: "asc" | "desc"
  viewMode?: "card" | "table"
}
