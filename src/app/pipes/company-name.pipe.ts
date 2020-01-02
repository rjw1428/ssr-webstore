import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyName'
})
export class CompanyNamePipe implements PipeTransform {

  transform(value: string, name: string): any {
    return value.replace(/{{company}}/g, name)
  }

}
