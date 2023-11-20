import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'ee-week-view',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'week-view.component.html',
})
export class WeekViewComponent {}
