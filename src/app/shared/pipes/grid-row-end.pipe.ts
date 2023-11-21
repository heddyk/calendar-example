import { Pipe, PipeTransform, inject } from '@angular/core'
import { Event } from '@core/models/event'
import { DateAdapterService } from '@core/services/date-adapter.service'

@Pipe({
  standalone: true,
  name: 'gridRowEnd',
})
export class GridRowEnd implements PipeTransform {
  private readonly dateAdapterService = inject(DateAdapterService)

  transform(value: Event, ...args: any[]): number {
    if (!this.dateAdapterService.isSameDay(value.startAt, value.endAt)) {
      return -1
    }

    const hours = value.endAt.getHours()
    const minutes = value.endAt.getMinutes()
    const time = minutes / 60 + hours

    return Math.floor(time * 12 + 2)
  }
}
