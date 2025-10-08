export const formatPrice = (priceInCents: number) => {
  return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
