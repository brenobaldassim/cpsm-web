import { ProductsListPageParams } from '../products/types'

export const updatePageInParams = (
  page: number,
  searchParams?: ProductsListPageParams
): string => {
  if (!searchParams) {
    return ''
  }
  const params = new URLSearchParams(searchParams as Record<string, string>)
  params.set('page', page.toString())
  return params.toString()
}
