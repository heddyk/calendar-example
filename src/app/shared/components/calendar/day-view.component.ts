import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core'
import { DateAdapterService } from '@core/services/date-adapter.service'

@Component({
  selector: 'ee-day-view',
  standalone: true,
  imports: [],
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
}
