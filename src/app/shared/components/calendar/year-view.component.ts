import { DatePipe, NgClass, TitleCasePipe } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core'
import { Event } from '@core/models/event'
import { DateAdapterService } from '@core/services/date-adapter.service'

interface MonthOfCalendar {
  description: string
  days: DayOfCalendar[]
}

interface DayOfCalendar {
  date: Date
  isToday?: boolean
  isCurrentMonth?: boolean
}

@Component({
  selector: 'ee-year-view',
  standalone: true,
  imports: [NgClass, DatePipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  templateUrl: 'year-view.component.html',
})
export class YearViewComponent {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef)
  private readonly _dateAdapterService = inject(DateAdapterService)

  @Input()
  get activeDate(): Date {
    return this._activeDate
  }
  set activeDate(value: Date) {
    const oldActiveDate = this._activeDate

    const validDate =
      this._dateAdapterService.getValidDateOrNull(this._dateAdapterService.deserialize(value)) ||
      this._dateAdapterService.today()

    this._activeDate = this._dateAdapterService.clone(validDate)

    if (!this._hasSameYear(oldActiveDate, this._activeDate)) {
      this._init()
    }
  }
  private _activeDate: Date

  @Input()
  get events(): Event[] {
    return this._events
  }
  set events(value: Event[]) {
    this._events = value
  }
  private _events: Event[]

  _months: MonthOfCalendar[]
  _weekdays: { long: string; short: string; narrow: string }[]

  _init() {
    this._initWeekdays()
    this._createCalendar()
    this._changeDetectorRef.markForCheck()
  }

  private _initWeekdays() {
    const firstDayOfWeek = this._dateAdapterService.getFirstDayOfWeek()

    const narrowWeekdays = this._dateAdapterService.getDayOfWeekNames('narrow')
    const shortWeekdays = this._dateAdapterService.getDayOfWeekNames('short')
    const longWeekdays = this._dateAdapterService.getDayOfWeekNames('long')

    const weekdays = longWeekdays.map((long, i) => {
      return { long, narrow: narrowWeekdays[i], short: shortWeekdays[i] }
    })
    this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek))
  }

  private _createCalendar() {
    const year = this._dateAdapterService.getYear(this.activeDate)

    const months = Array.from({ length: 12 }, (_, i) => ({
      description: this._dateAdapterService.getMonthName(new Date(year, i, 1), 'long'),
      days: this.getDaysOfMonth(i, year),
    }))

    this._months = months
  }

  getDaysOfMonth(month: number, year: number) {
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

  private _hasSameYear(d1: Date | null, d2: Date | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this._dateAdapterService.getYear(d1) == this._dateAdapterService.getYear(d2)
    )
  }
}
