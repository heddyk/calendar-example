import { Pipe, PipeTransform } from '@angular/core'
import { Event } from '@core/models/event'

@Pipe({
  standalone: true,
  name: 'gridRowStart',
})
export class GridRowStart implements PipeTransform {
  transform(value: Event, ...args: any[]): number {
    const hours = value.startAt.getHours()
    const minutes = value.startAt.getMinutes()
    const time = minutes / 60 + hours

    return Math.floor(time * 12 + 2)
  }
}
