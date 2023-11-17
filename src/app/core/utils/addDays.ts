export function addDays(date: Date, amount: number): Date {
  if (!amount) return date

  date.setDate(date.getDate() + amount)
  return date
}
