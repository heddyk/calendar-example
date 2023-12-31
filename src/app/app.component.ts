import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'ee-root',
  standalone: true,
  imports: [RouterOutlet],
  host: {
    class: 'block h-screen min-h-screen',
  },
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
