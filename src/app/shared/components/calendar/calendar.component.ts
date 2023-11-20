import { DatePipe, NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core'
import { DateAdapterService } from '@core/services/date-adapter.service'

interface DayOfCalendar {
  date: Date
  isCurrentMonth: boolean
  isSelected?: boolean
  isToday?: boolean
}

@Component({
  selector: 'ee-calendar',
  standalone: true,
  imports: [UpperCasePipe, DatePipe, NgClass, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
})
export class EECalendarComponent {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef)
  private readonly _dateAdapterService = inject(DateAdapterService)

  days: DayOfCalendar[] = []
  selectedDay = this.days.find((day) => day.isSelected)

  today = this._dateAdapterService.today()
  currentMonth = this.today.getMonth()
  currentYear = this.today.getFullYear()

  weekdays = this._dateAdapterService.getDayOfWeekNames()
  months = this._dateAdapterService.getMonthNames()

  constructor() {
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

    this.days = [...this.getDaysForCalendarMonth(month, year)]
    this._changeDetectorRef.markForCheck()
  }

  getDaysForCalendarMonth(month: number, year: number): DayOfCalendar[] {
    const firstDayOfTheMonth = new Date(year, month, 1)

    const firstDayOfTheCalendar = this._dateAdapterService.firstDayOfWeek(firstDayOfTheMonth)

    let temp = this._dateAdapterService.clone(+firstDayOfTheCalendar)
    const days = [this._dateAdapterService.clone(+temp)]

    while (days.length < 42) {
      temp = this._dateAdapterService.addDays(+temp, 1)
      days.push(this._dateAdapterService.clone(+temp))
    }

    return days.map((d) => ({
      date: d,
      isCurrentMonth: d.getMonth() === month,
      isToday: this._dateAdapterService.isToday(d),
    }))
  }
}
