import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class DateAdapterService {
  private _locale: string = 'pt-BR'
  /*

    0 - Sunday
    1 - Monday

  */
  private _firstDayOfWeek: number = 0

  getYear(date: Date): number {
    return date.getFullYear()
  }

  getMonth(date: Date): number {
    return date.getMonth()
  }

  getDay(date: Date): number {
    return date.getDate()
  }

  getDayOfWeek(date: Date): number {
    return date.getDay()
  }

  getMonthNames(): {
    long: string
    short: string
    narrow: string
    numeric: string
  }[] {
    return Array.from({ length: 12 }, (_, i) => ({
      long: this._format(
        new Intl.DateTimeFormat(this._locale, { month: 'long', timeZone: 'utc' }),
        new Date(2023, i, 1),
      ),
      short: this._format(
        new Intl.DateTimeFormat(this._locale, { month: 'short', timeZone: 'utc' }),
        new Date(2023, i, 1),
      ),
      narrow: this._format(
        new Intl.DateTimeFormat(this._locale, { month: 'narrow', timeZone: 'utc' }),
        new Date(2023, i, 1),
      ),
      numeric: this._format(
        new Intl.DateTimeFormat(this._locale, { month: 'numeric', timeZone: 'utc' }),
        new Date(2023, i, 1),
      ),
    }))
  }

  getDateNames(): string[] {
    const dtf = new Intl.DateTimeFormat(this._locale, { day: 'numeric', timeZone: 'utc' })
    return Array.from({ length: 31 }, (_, i) => this._format(dtf, new Date(2023, 0, i + 1)))
  }

  getDayOfWeekNames(): { long: string; short: string; narrow: string }[] {
    return Array.from({ length: 7 }, (_, i) => ({
      long: this._format(
        new Intl.DateTimeFormat(this._locale, { weekday: 'long', timeZone: 'utc' }),
        new Date(2023, 0, i + 1),
      ),
      short: this._format(
        new Intl.DateTimeFormat(this._locale, { weekday: 'short', timeZone: 'utc' }),
        new Date(2023, 0, i + 1),
      ),
      narrow: this._format(
        new Intl.DateTimeFormat(this._locale, { weekday: 'narrow', timeZone: 'utc' }),
        new Date(2023, 0, i + 1),
      ),
    }))
  }

  getYearName(date: Date): string {
    const dtf = new Intl.DateTimeFormat(this._locale, { year: 'numeric', timeZone: 'utc' })
    return this._format(dtf, date)
  }

  getFirstDayOfWeek(): number {
    return this._firstDayOfWeek
  }

  clone(date: Date | number | string): Date {
    return new Date(date)
  }

  today(): Date {
    return new Date()
  }

  parse(date: any): Date {
    const argStr = Object.prototype.toString.call(date)

    if (
      date instanceof Date ||
      (typeof date === 'object' && Object.prototype.toString.call(date) === '[object Date]')
    ) {
      return new Date(+date)
    }

    if (typeof date === 'number' || argStr === '[object Number]') {
      return new Date(date)
    }

    if (typeof date === 'string' || argStr === '[object String]') {
      return new Date(Date.parse(date + ''))
    }

    return new Date(NaN)
  }

  format(value: Date | number | string, format?: Intl.DateTimeFormatOptions): string {
    const date = this.parse(value)

    if (!this.isValid(date)) {
      throw Error('Invalid date.')
    }

    const dtf = Intl.DateTimeFormat(this._locale, { ...format, timeZone: 'utc' })

    return this._format(dtf, date)
  }

  addYears(date: Date | number | string, years: number): Date {
    return this.addMonths(date, years * 12)
  }

  addMonths(date: Date | number | string, months: number): Date {
    const _date = this.parse(date)

    if (!months) return _date

    const dayOfMonth = _date.getDate()

    const endOfDesiredMonth = this.clone(_date.getTime())
    endOfDesiredMonth.setMonth(_date.getMonth() + months + 1, 0)
    const daysInMonth = endOfDesiredMonth.getDate()

    if (dayOfMonth >= daysInMonth) {
      return endOfDesiredMonth
    }

    _date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth)
    return _date
  }

  addDays(date: Date | number | string, days: number): Date {
    const _date = this.parse(date)

    if (!days) return _date

    _date.setDate(_date.getDate() + days)

    return _date
  }

  isDateInstance(date: any): boolean {
    return (
      date instanceof Date ||
      (typeof date === 'object' && Object.prototype.toString.call(date) === '[object Date]')
    )
  }

  isValid(date: any): boolean {
    if (!this.isDateInstance(date) && typeof date !== 'number' && typeof date !== 'string') {
      return false
    }

    const _date = this.parse(date)

    return !isNaN(Number(_date))
  }

  isEqual(first: Date | number | string, second: Date | number | string): boolean {
    const date1 = this.parse(first)
    const date2 = this.parse(second)
    return +date1 == +date2
  }

  isSameDay(first: Date | number | string, second: Date | number | string): boolean {
    const firstStartOfDay = this.startOfDay(first)
    const secondStartOfDay = this.startOfDay(second)

    return +firstStartOfDay === +secondStartOfDay
  }

  isToday(date: Date | number | string): boolean {
    return this.isSameDay(date, Date.now())
  }

  isBefore(date: Date | number | string, dateCompare: Date | number | string): boolean {
    const _date = this.parse(date)
    const _dateCompare = this.parse(dateCompare)

    return _date.getTime() < _dateCompare.getTime()
  }

  isAfter(date: Date | number | string, dateCompare: Date | number | string): boolean {
    const _date = this.parse(date)
    const _dateCompare = this.parse(dateCompare)

    return _date.getTime() > _dateCompare.getTime()
  }

  startOfDay(date: Date | number | string): Date {
    const _date = this.parse(date)
    _date.setHours(0, 0, 0, 0)
    return _date
  }

  firstDayOfWeek(date: Date): Date {
    const weekStartsOn = this.getFirstDayOfWeek()

    const day = date.getDay()

    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

    return this._createDate(date.getFullYear(), date.getMonth(), date.getDate() - diff)
  }

  lastDayOfWeek(date: Date): Date {
    const weekStartsOn = this.getFirstDayOfWeek()

    const day = date.getDay()

    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)

    return this._createDate(date.getFullYear(), date.getMonth(), date.getDate() + diff)
  }

  /**
   *
   * 0 se as datas forem iguais, um número menor que 0 se a primeira data for anterior, um número maior que 0 se a primeira data for posterior.
   *
   */
  compareDate(first: Date, second: Date): number {
    return (
      this.getYear(first) - this.getYear(second) ||
      this.getMonth(first) - this.getMonth(second) ||
      this.getDay(first) - this.getDay(second)
    )
  }

  private _createDate(year: number, month: number, date: number) {
    const d = new Date()
    d.setFullYear(year, month, date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  private _format(dtf: Intl.DateTimeFormat, date: Date) {
    const d = new Date()
    d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate())
    d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
    return dtf.format(d)
  }
}
