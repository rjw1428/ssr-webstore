import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(list: any[]): any {
    if (list) {
      console.log(list)
      let backwards = list.slice().reverse();
      console.log(backwards)
      return backwards
    }
  }

}
