export interface SalesListPageParams {
  page?: string
  sortBy?: "saleDate" | "totalAmount" | "createdAt"
  sortOrder?: "asc" | "desc"
  viewMode?: "card" | "table"
}
