export const parseLocalDate = (date: string | undefined) => {
  if (!date) return
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}
