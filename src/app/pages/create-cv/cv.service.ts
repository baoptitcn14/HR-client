import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  // lưu vị trí trỏ chuột
  private range: Range | null = null;

  constructor() { }

  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.range = selection.getRangeAt(0);
    }
  }
  getRange() {
    return this.range;
  }

  restoreSelection() {
    if (this.range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.range);
      }
    }
  }

  // Kiểm tra editor có rỗng không
  isContentEditableEmpty(innerTextHTML: string): boolean {
    if (!innerTextHTML) return true;

    // innerHTML có thể chứa <br> khi trống
    const html = innerTextHTML.replace(/<br\s*\/?>/gi, '').trim();
    return html === "";
  }
}
