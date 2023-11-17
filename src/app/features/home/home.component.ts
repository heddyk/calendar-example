import { ChangeDetectionStrategy, Component } from '@angular/core'
import { EECalendarComponent } from '@shared/components/calendar/calendar.component'

@Component({
  selector: 'ee-home',
  standalone: true,
  imports: [EECalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <ee-calendar />
  `,
})
export class HomeComponent {}
