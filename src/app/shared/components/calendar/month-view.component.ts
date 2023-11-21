import { DatePipe, NgClass, TitleCasePipe } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core'
import { Event } from '@core/models/event'
import { DateAdapterService } from '@core/services/date-adapter.service'

interface DayOfCalendar {
  date: Date
  isCurrentMonth: boolean
  isSelected?: boolean
  isToday?: boolean
  events: Event[]
}

@Component({
  selector: 'ee-month-view',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col',
  },
  templateUrl: 'month-view.component.html',
})
export class MonthViewComponent {
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

    if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
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
    this._setEvents(value)
  }
  private _events: Event[]

  _days: DayOfCalendar[]
  _weekdays: { long: string; short: string; narrow: string }[]

  _init() {
    this._initWeekdays()
    this._createCalendar()
    this._changeDetectorRef.markForCheck()
  }

  private _setEvents(events: Event[]) {
    this._days = this._days.map((d) => ({
      ...d,
      events: events.filter((e) => this._dateAdapterService.isSameDay(d.date, e.startAt)),
    }))
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
    const month = this._dateAdapterService.getMonth(this.activeDate)
    const year = this._dateAdapterService.getYear(this.activeDate)
    const firstDayOfTheMonth = new Date(year, month, 1)

    const firstDayOfTheCalendar = this._dateAdapterService.firstDayOfWeek(firstDayOfTheMonth)

    let temp = this._dateAdapterService.clone(+firstDayOfTheCalendar)
    const days = [this._dateAdapterService.clone(+temp)]

    while (days.length < 42) {
      temp = this._dateAdapterService.addDays(+temp, 1)
      days.push(this._dateAdapterService.clone(+temp))
    }

    this._days = days.map((d) => ({
      date: d,
      isCurrentMonth: d.getMonth() === month,
      isToday: this._dateAdapterService.isToday(d),
      events: [],
    }))
  }

  private _hasSameMonthAndYear(d1: Date | null, d2: Date | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this._dateAdapterService.getMonth(d1) == this._dateAdapterService.getMonth(d2) &&
      this._dateAdapterService.getYear(d1) == this._dateAdapterService.getYear(d2)
    )
  }
}
