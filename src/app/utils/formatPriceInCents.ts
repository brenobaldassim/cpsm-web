import { formatPrice } from "./formatPrice"

export const formatPriceInCents = (priceInCents: number) => {
  return formatPrice(priceInCents / 100)
}
