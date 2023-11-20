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

  get activeDate(): Date {
    return this._activeDate
  }
  set activeDate(value: Date) {
    this._activeDate = this._dateAdapterService.clone(value)
    console.log('Data alterada =>', this._activeDate)
    this._changeDetectorRef.markForCheck()
  }
  private _activeDate: Date

  get currentView(): CalendarView {
    return this._currentView
  }
  set currentView(value: CalendarView) {
    this._currentView = value
    this._changeDetectorRef.markForCheck()
  }
  private _currentView: CalendarView

  ngAfterContentInit(): void {
    this.activeDate = this._dateAdapterService.today()
    this.currentView = 'day'
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
}
