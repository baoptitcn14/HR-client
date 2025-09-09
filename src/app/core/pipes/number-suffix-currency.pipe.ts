import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSuffixCurrency',
  standalone: true
})
export class NumberSuffixCurrencyPipe implements PipeTransform {

  transform(value: number | string | null | undefined, fractionDigits: number = 1): string {
    if (value === null || value === undefined || value === '') return '';

    // Chuyển thành số, loại bỏ dấu phẩy
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return '';

    // Định nghĩa đơn vị
    const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ'];

    let unitIndex = 0;
    let displayNum = num;

    while (displayNum >= 1000 && unitIndex < units.length - 1) {
      displayNum = displayNum / 1000;
      unitIndex++;
    }

    // Làm tròn số thập phân
    const formatted = parseFloat(displayNum.toFixed(fractionDigits));

    return `${formatted}${units[unitIndex]}`;
  }

}
