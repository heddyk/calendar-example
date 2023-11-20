import { DatePipe, NgClass } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core'
import { DateAdapterService } from '@core/services/date-adapter.service'

interface DayOfCalendar {
  date: Date
  weekday: { long: string; short: string; narrow: string }
  isToday?: boolean
}

@Component({
  selector: 'ee-week-view',
  standalone: true,
  imports: [NgClass, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'isolate flex flex-auto flex-col overflow-auto bg-white',
  },
  templateUrl: 'week-view.component.html',
})
export class WeekViewComponent {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef)
  private readonly _dateAdapterService = inject(DateAdapterService)

  @Input()
  get activeDate(): Date {
    return this._activeDate
  }
  set activeDate(value: Date) {
    const validDate =
      this._dateAdapterService.getValidDateOrNull(this._dateAdapterService.deserialize(value)) ||
      this._dateAdapterService.today()

    this._activeDate = this._dateAdapterService.clone(validDate)

    this._init()
  }
  private _activeDate: Date

  _days: DayOfCalendar[]

  _init() {
    this._createCalendar()
    this._changeDetectorRef.markForCheck()
  }

  private _createCalendar() {
    const firstDayOfTheCalendar = this._dateAdapterService.firstDayOfWeek(this.activeDate)

    let temp = this._dateAdapterService.clone(+firstDayOfTheCalendar)
    const days = [this._dateAdapterService.clone(+temp)]

    while (days.length < 7) {
      temp = this._dateAdapterService.addDays(+temp, 1)
      days.push(this._dateAdapterService.clone(+temp))
    }

    this._days = days.map((d) => ({
      date: d,
      weekday: {
        long: new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'utc' }).format(d),
        narrow: new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow', timeZone: 'utc' }).format(d),
        short: new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'utc' }).format(d),
      },
      isToday: this._dateAdapterService.isToday(d),
    }))
  }
}
