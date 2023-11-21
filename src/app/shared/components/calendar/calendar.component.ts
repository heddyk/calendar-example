import { DatePipe, TitleCasePipe } from '@angular/common'
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core'
import { DateAdapterService } from '@core/services/date-adapter.service'
import { DayViewComponent } from './day-view.component'
import { MonthViewComponent } from './month-view.component'
import { WeekViewComponent } from './week-view.component'
import { YearViewComponent } from './year-view.component'
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu'
import { EventsStore } from '@core/stores/events.store'

type CalendarView = 'day' | 'week' | 'month' | 'year'

@Component({
  selector: 'ee-calendar',
  standalone: true,
  imports: [
    DatePipe,
    TitleCasePipe,
    DayViewComponent,
    MonthViewComponent,
    WeekViewComponent,
    YearViewComponent,

    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements AfterContentInit {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef)
  private readonly _dateAdapterService = inject(DateAdapterService)
  private readonly _eventsStore = inject(EventsStore)

  events = this._eventsStore.events.asReadonly()

  get activeDate(): Date {
    return this._activeDate
  }
  set activeDate(value: Date) {
    const oldActiveDate = this._activeDate
    this._activeDate = this._dateAdapterService.clone(value)

    this._getEvents(this.activeDate, oldActiveDate)

    this._changeDetectorRef.markForCheck()
  }
  private _activeDate: Date

  get currentView(): CalendarView {
    return this._currentView
  }
  set currentView(value: CalendarView) {
    this._currentView = value

    if (value === 'year') this._getEvents(this.activeDate, null)

    this._changeDetectorRef.markForCheck()
  }
  private _currentView: CalendarView

  ngAfterContentInit(): void {
    this.activeDate = this._dateAdapterService.today()
    this.currentView = 'week'
  }

  previous() {
    switch (this.currentView) {
      case 'year':
        this.activeDate = this._dateAdapterService.subYears(this.activeDate, 1)
        break
      case 'month':
        this.activeDate = this._dateAdapterService.subMonths(this.activeDate, 1)
        break
      case 'week':
        this.activeDate = this._dateAdapterService.subDays(this.activeDate, 7)
        break
      case 'day':
        this.activeDate = this._dateAdapterService.subDays(this.activeDate, 1)
        break
    }
    this._changeDetectorRef.markForCheck()
  }

  next() {
    switch (this.currentView) {
      case 'year':
        this.activeDate = this._dateAdapterService.addYears(this.activeDate, 1)
        break
      case 'month':
        this.activeDate = this._dateAdapterService.addMonths(this.activeDate, 1)
        break
      case 'week':
        this.activeDate = this._dateAdapterService.addDays(this.activeDate, 7)
        break
      case 'day':
        this.activeDate = this._dateAdapterService.addDays(this.activeDate, 1)
        break
    }
    this._changeDetectorRef.markForCheck()
  }

  backViewToday() {
    this.activeDate = this._dateAdapterService.today()
    this._changeDetectorRef.markForCheck()
  }

  changeView(value: CalendarView) {
    this.currentView = value
  }

  private _getEvents(dateActive: Date, oldActiveDate: Date | null) {
    if (this.currentView === 'year' && !this._hasSameYear(oldActiveDate, dateActive)) {
      this._eventsStore.getEventsByYear(this._dateAdapterService.getYear(dateActive))
    } else if (
      this.currentView !== 'year' &&
      !this._hasSameMonthAndYear(oldActiveDate, dateActive)
    ) {
      this._eventsStore.getEventsByMonthAndYear(
        this._dateAdapterService.getMonth(dateActive),
        this._dateAdapterService.getYear(dateActive),
      )
    }
  }

  private _hasSameMonthAndYear(d1: Date | null, d2: Date | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this._dateAdapterService.getMonth(d1) == this._dateAdapterService.getMonth(d2) &&
      this._dateAdapterService.getYear(d1) == this._dateAdapterService.getYear(d2)
    )
  }

  private _hasSameYear(d1: Date | null, d2: Date | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this._dateAdapterService.getYear(d1) == this._dateAdapterService.getYear(d2)
    )
  }
}
