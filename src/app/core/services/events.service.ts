import { DateAdapterService } from './date-adapter.service'
import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Event } from '@core/models/event'

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient)
  private readonly dateAdapterService = inject(DateAdapterService)
  private readonly url = 'http://localhost:3000/events'

  /*
    ROUTES json-server
    GET    /posts
    GET    /posts/1
    POST   /posts
    PUT    /posts/1
    PATCH  /posts/1
    DELETE /posts/1

  */

  getEventsByMonthAndYear(month: number, year: number) {
    const startAt = this.dateAdapterService.toIso8601(new Date(year, month, 1))
    const endAt = this.dateAdapterService.toIso8601(new Date(year, month + 1, 0))

    const params = new HttpParams().set('startAt_gte', startAt).set('endAt_lte', endAt)

    return this.http.get<Event[]>(`${this.url}`, { params })
  }

  getEventsByYear(year: number) {
    const startAt = this.dateAdapterService.toIso8601(new Date(year, 0, 1))
    const endAt = this.dateAdapterService.toIso8601(new Date(year, 12, 0))

    const params = new HttpParams().set('startAt_gte', startAt).set('endAt_lte', endAt)

    return this.http.get<Event[]>(`${this.url}`, { params })
  }

  getEventById(id: string) {
    return this.http.get<Event>(`${this.url}/${id}`)
  }

  createEvent(event: Event) {
    return this.http.post<Event>(`${this.url}`, event)
  }

  updateEvent(id: string, event: Event) {
    return this.http.put<Event>(`${this.url}/${id}`, event)
  }

  deleteEvent(id: string) {
    return this.http.delete(`${this.url}/${id}`)
  }
}
