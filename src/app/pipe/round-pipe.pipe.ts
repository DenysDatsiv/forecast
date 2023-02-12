import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundPipe'
})
export class RoundPipePipe implements PipeTransform {

  transform(value: any): any {
    return Math.round(value) + '°C';
  }

}
