import { ProductsListPageParams } from '../products/types'

export const removePageFromParams = (params: ProductsListPageParams) => {
  return Object.fromEntries(
    Object.entries(params || {}).filter(([key]) => key !== 'page')
  )
}
