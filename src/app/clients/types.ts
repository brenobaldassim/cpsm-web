export interface ClientsListPageParams {
  page?: string
  search?: string
  sortBy?: "firstName" | "lastName" | "email" | "createdAt"
  sortOrder?: "asc" | "desc"
}
