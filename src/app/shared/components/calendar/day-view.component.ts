import { DatePipe, NgStyle } from '@angular/common'
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core'
import { Event } from '@core/models/event'
import { DateAdapterService } from '@core/services/date-adapter.service'
import { GridRowEnd } from '@shared/pipes/grid-row-end.pipe'
import { GridRowStart } from '@shared/pipes/grid-row-start.pipe'

@Component({
  selector: 'ee-day-view',
  standalone: true,
  imports: [GridRowStart, GridRowEnd, NgStyle, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'isolate flex flex-auto overflow-hidden bg-white',
  },
  templateUrl: 'day-view.component.html',
})
export class DayViewComponent {
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
  }
  private _activeDate: Date

  @Input()
  get events(): Event[] {
    return this._events.filter((e) =>
      this._dateAdapterService.isSameDay(e.startAt, this.activeDate),
    )
  }
  set events(value: Event[]) {
    this._events = value
  }
  private _events: Event[]
}
