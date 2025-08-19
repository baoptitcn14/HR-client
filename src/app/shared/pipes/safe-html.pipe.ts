import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(html: any): unknown {
    return html != undefined && html != null ? this.sanitizer.bypassSecurityTrustHtml(html) : 'Đang tải ...';
  }

}
