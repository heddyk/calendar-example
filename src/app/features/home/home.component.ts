import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CalendarComponent } from '@shared/components/calendar/calendar.component'

@Component({
  selector: 'ee-home',
  standalone: true,
  imports: [CalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <ee-calendar />
  `,
})
export class HomeComponent {}
