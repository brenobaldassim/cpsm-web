export const formatPrice = (priceInCents: number) => {
  return `R$ ${priceInCents.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
