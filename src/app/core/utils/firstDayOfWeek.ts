export function firstDayOfWeek(date: Date): Date {
  /*
    0 - Sunday
    1 - Monday
  */
  const weekStartsOn = 0
  const day = date.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}
