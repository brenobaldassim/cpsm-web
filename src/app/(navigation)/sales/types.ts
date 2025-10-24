export interface SalesListPageParams {
  startDate?: string
  endDate?: string
  search?: string
  page?: string
  sortBy?: "saleDate" | "totalAmount" | "createdAt"
  sortOrder?: "asc" | "desc"
  viewMode?: "card" | "table"
}
