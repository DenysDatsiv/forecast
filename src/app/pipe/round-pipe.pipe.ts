import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundPipe'
})
export class RoundPipePipe implements PipeTransform {

  transform(value: number): string {
    return Math.round(value) + '°C';
  }

}
