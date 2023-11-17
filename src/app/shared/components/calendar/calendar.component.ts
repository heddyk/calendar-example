import { DatePipe, NgClass, UpperCasePipe } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core'

const WEEKDAYS = [
  { long: 'Domingo', narrow: 'Dom' },
  { long: 'Segunda', narrow: 'Seg' },
  { long: 'Terça', narrow: 'Ter' },
  { long: 'Quarta', narrow: 'Qua' },
  { long: 'Quinta', narrow: 'Qui' },
  { long: 'Sexta', narrow: 'Sex' },
  { long: 'Sábado', narrow: 'Sáb' },
]

interface DayOfCalendar {
  date: Date
  isCurrentMonth: boolean
  isSelected?: boolean
  isToday?: boolean
}

@Component({
  selector: 'ee-calendar',
  standalone: true,
  imports: [UpperCasePipe, DatePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
})
export class EECalendarComponent {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef)

  title: string
  days: DayOfCalendar[] = []
  selectedDay = this.days.find((day) => day.isSelected)
  today = new Date()
  currentMonth = this.today.getMonth()
  currentYear = this.today.getFullYear()
  weekdays: { long: string; narrow: string }[] = WEEKDAYS
  months = this.getAllMonths()

  constructor() {
    this.init()
  }

  init() {
    this.createCalendar(this.currentMonth, this.currentYear)
  }

  returnCurrentMonth() {
    this.createCalendar(this.today.getMonth(), this.today.getFullYear())
  }

  nextMonth() {
    const month = (this.currentMonth + 1) % 12
    const year = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
    this.createCalendar(month, year)
  }

  previousMonth() {
    const month = this.currentMonth === 0 ? 11 : this.currentMonth - 1
    const year = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
    this.createCalendar(month, year)
  }

  createCalendar(month: number, year: number) {
    this.currentMonth = month
    this.currentYear = year
    this.title = `${this.months[month]} ${year}`
    this.days = [...this.getDaysForCalendarMonth(month, year)]
    this._changeDetectorRef.markForCheck()
  }

  getAllMonths(
    format: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' = 'long',
    locale: string = 'pt-BR',
  ) {
    return Array.from({ length: 12 }, (_, i) => {
      return new Intl.DateTimeFormat(locale, { month: format }).format(
        new Date(this.currentYear, i),
      )
    })
  }

  getDaysForCalendarMonth(month: number, year: number): DayOfCalendar[] {
    const firstDayOfTheMonth = new Date(year, month, 1)
    const lastDayOfTheMonth = new Date(year, month + 1, 0)

    const firstDayOfTheCalendar = this.firstDayOfWeek(firstDayOfTheMonth)
    const lastDayOfTheCalendar = this.lastDayOfWeek(lastDayOfTheMonth)

    let temp = new Date(+firstDayOfTheCalendar)
    const days = [new Date(+temp)]

    while (this.isBefore(temp, lastDayOfTheCalendar) && days.length < 42) {
      temp = this.addDays(temp, 1)
      days.push(new Date(+temp))
    }

    while (days.length < 42) {
      temp = this.addDays(temp, 1)
      days.push(new Date(+temp))
    }

    return days.map((d) => ({
      date: d,
      isCurrentMonth: d.getMonth() === month,
      isToday: this.isSameDate(d, new Date()),
    }))
  }

  firstDayOfWeek(date: Date): Date {
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

  lastDayOfWeek(date: Date): Date {
    /*
      0 - Sunday
      1 - Monday
    */
    const weekStartsOn = 0
    const day = date.getDay()
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)

    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
  }

  addDays(date: Date, amount: number): Date {
    if (!amount) return date

    date.setDate(date.getDate() + amount)
    return date
  }

  isBefore(date: Date, dateToCompare: Date): boolean {
    return +date < +dateToCompare
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
}
