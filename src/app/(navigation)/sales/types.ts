export interface SalesListPageParams {
  search?: string
  page?: string
  sortBy?: "saleDate" | "totalAmount" | "createdAt"
  sortOrder?: "asc" | "desc"
  viewMode?: "card" | "table"
}
