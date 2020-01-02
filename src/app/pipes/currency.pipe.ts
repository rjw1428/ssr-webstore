import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    return "$"+value.toFixed(2).toString();
  }

}
