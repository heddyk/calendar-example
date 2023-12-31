import { DatePipe, NgClass, NgStyle } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  Pipe,
  PipeTransform,
} from '@angular/core'
import { Event } from '@core/models/event'
import { DateAdapterService } from '@core/services/date-adapter.service'
import { GridRowEnd } from '@shared/pipes/grid-row-end.pipe'
import { GridRowStart } from '@shared/pipes/grid-row-start.pipe'

interface DayOfCalendar {
  date: Date
  weekday: { long: string; short: string; narrow: string }
  isToday?: boolean
  events: Event[]
}

@Component({
  selector: 'ee-week-view',
  standalone: true,
  imports: [NgClass, NgStyle, DatePipe, GridRowStart, GridRowEnd],
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

  @Input()
  get events(): Event[] {
    return this._events
  }
  set events(value: Event[]) {
    this._events = value
    this._setEvents(value)
  }
  private _events: Event[] = []

  _days: DayOfCalendar[]

  _init() {
    this._createCalendar()
    this._setEvents(this.events)
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
      events: [],
    }))
  }

  private _setEvents(events: Event[]) {
    this._days = this._days.map((d) => ({
      ...d,
      events: events.filter((e) => this._dateAdapterService.isSameDay(d.date, e.startAt)),
    }))
  }
}
