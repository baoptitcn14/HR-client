import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longToDatePipe',
  pure: false,
  standalone: true,
})
export class LongToDayPipe implements PipeTransform {
  constructor() {}

  transform(number: number, format?: string): any {
    try {
      if (!number) return null;

      var str = number.toString();

      var y: any = parseInt(str.substring(0, 4));
      var m: any = parseInt(str.substring(4, 6));
      var d: any = parseInt(str.substring(6, 8));
      var hh: any = parseInt(str.substring(8, 10));
      var mm: any = parseInt(str.substring(10, 12));
      var ss: any = parseInt(str.substring(12, 14));

      if (d < 10) {
        d = '0' + d;
      }

      if (m < 10) {
        m = '0' + m;
      }

      if (hh < 10) {
        hh = '0' + hh;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      if (ss < 10) {
        ss = '0' + ss;
      }

      var result = '';

      if (format == 'dd/MM/yyyy') {
        result = d + '/' + m + '/' + y;
      } else if (format == 'DD/MM/YYYY') {
        result = d + '/' + m + '/' + y;
      } else if (format == 'hh:mm') {
        result = hh + ':' + mm;
      } else if (format == 'hh:mm:ss') {
        result = hh + ':' + mm + ':' + ss;
      }

      return result;
    } catch {
      return null;
    }
  }
}
