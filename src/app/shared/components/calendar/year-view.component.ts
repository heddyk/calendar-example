import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'ee-year-view',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'year-view.component.html',
})
export class YearViewComponent {}
