import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'ee-day-view',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'day-view.component.html',
})
export class DayViewComponent {}
