import { ProductsListPageParams } from '../products/types'
import { removePageFromParams } from './removePageFromParams'

export const returnParamsWithoutPage = (
  params?: ProductsListPageParams
): string => {
  if (!params) {
    return ''
  }
  return new URLSearchParams(removePageFromParams(params)).toString()
}
