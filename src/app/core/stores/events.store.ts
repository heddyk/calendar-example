import { Injectable, inject, signal } from '@angular/core'
import { Event } from '@core/models/event'
import { EventsService } from '@core/services/events.service'
import { take } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class EventsStore {
  private readonly _eventsService = inject(EventsService)

  events = signal<Event[]>([])
  loading = signal<boolean>(false)

  getEventsByMonthAndYear(month: number, year: number) {
    this.loading.set(true)

    this._eventsService
      .getEventsByMonthAndYear(month, year)
      .pipe(take(1))
      .subscribe({
        next: (events) => {
          this.events.set(events)
          this.loading.set(false)
        },
        error: () => {
          this.loading.set(false)
        },
      })
  }

  getEventsByYear(year: number) {
    this.loading.set(true)

    this._eventsService
      .getEventsByYear(year)
      .pipe(take(1))
      .subscribe({
        next: (events) => {
          this.events.set(events)
          this.loading.set(false)
        },
        error: () => {
          this.loading.set(false)
        },
      })
  }
}
