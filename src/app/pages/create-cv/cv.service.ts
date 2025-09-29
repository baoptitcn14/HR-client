import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  // lưu vị trí trỏ chuột
  private range: Range | null = null;

  // theo dõi trạng thái của các button trên toolbar input
  b$ = new BehaviorSubject<boolean>(false);
  i$ = new BehaviorSubject<boolean>(false);
  u$ = new BehaviorSubject<boolean>(false);


  // Theo dõi undo, redo
  undo: IAction[] = [];
  redo: IAction[] = [];

  constructor() { }

  saveSelection() {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      this.range = selection.getRangeAt(0);
    }

    // this.checkTagName();
  }

  // private checkTagName() {
  //   const self = this;
  //   if (this.range) {
  //     const starContainer = this.range.startContainer
  //       .parentElement as HTMLElement;

  //     // checkParent(starContainer);
  //     if (starContainer.tagName == 'SPAN') {
  //       checkParent(starContainer);
  //     } else {
  //       if (starContainer) {
  //         this.b$.next(starContainer.tagName === 'B');
  //         this.i$.next(starContainer.tagName === 'I');
  //         this.u$.next(starContainer.tagName === 'U');
  //       }

  //       const ancestor = this.range.commonAncestorContainer as HTMLElement;

  //       if (ancestor) {
  //         if (!this.b$.value) this.b$.next(ancestor.tagName === 'B');

  //         if (!this.i$.value) this.i$.next(ancestor.tagName === 'I');

  //         if (!this.u$.value) this.u$.next(ancestor.tagName === 'U');

  //         checkParent(ancestor);
  //       }
  //     }
  //   }

  //   // Kiểm tra cha có phải thẻ b, i, u không
  //   function checkParent(element: HTMLElement) {
  //     const parentNode = element.parentElement as HTMLElement;

  //     if (!parentNode || parentNode.tagName == 'SPAN') return;

  //     if (!self.b$.value) self.b$.next(parentNode.tagName === 'B');

  //     if (!self.i$.value) self.i$.next(parentNode.tagName === 'I');

  //     if (!self.u$.value) self.u$.next(parentNode.tagName === 'U');

  //     checkParent(parentNode);
  //   }
  // }

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

  setRange(range: Range) {
    this.range = range;
  }

  // Kiểm tra editor có rỗng không
  isContentEditableEmpty(innerTextHTML: string): boolean {
    if (!innerTextHTML) return true;

    // innerHTML có thể chứa <br> khi trống
    const html = innerTextHTML.replace(/<br\s*\/?>/gi, '').trim();
    return html === '';
  }

  // set Font family
  setFontFamily(font: string) {
    document.execCommand('fontName', false, font);
    this.keepSelectionText();
  }

  //apply font weight
  applyBold() {
    document.execCommand('bold');
    this.keepSelectionText();
  }

  //apply italic
  applyItalic() {
    document.execCommand('italic');

    this.keepSelectionText();
  }

  //apply underline
  applyUnderline() {
    document.execCommand('underline');
    this.keepSelectionText();
  }

  //applyOrderListBullet
  applyOrderListBullet() {
    document.execCommand('insertUnorderedList');
    this.keepSelectionText();
  }

  //applyOrderListNumber
  applyOrderListNumber() {
    document.execCommand('insertOrderedList');
    this.keepSelectionText();
  }

  // apply font color
  applyFontColor(color: string) {
    document.execCommand('foreColor', false, color);

    this.keepSelectionText();
  }

  //apply align
  applyAlignment(align: string) {
    if (align == 'justify') align = 'full';

    document.execCommand('justify' + align.toUpperCase());

    if (
      document.activeElement?.firstElementChild?.firstElementChild &&
      document.activeElement?.firstElementChild?.firstElementChild.tagName ==
      'BR'
    ) {
      document.activeElement?.firstElementChild?.firstElementChild.remove();
    }

    this.keepSelectionText();
  }

  private keepSelectionText() {
    const selection = window.getSelection();
    if (!selection!.rangeCount) return;

    const range = selection!.getRangeAt(0);
    let node = range.commonAncestorContainer;

    // Nếu node là Text thì lấy node cha
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode!;
    }

    if (node && node.nodeName != 'DIV') {
      this.range = document.createRange();
      this.range.selectNodeContents(node);
      this.restoreSelection();
    }

    document.activeElement?.normalize();
  }

  //set Font size
  setFontSize(size: number) {
    const self = this;

    if (this.range) {
      const textContent = this.range!.cloneContents().textContent;

      // kiểm tra text đc bôi đen có chung 1 container không

      const startContainer = this.range.startContainer
        .parentElement as HTMLElement;
      const endContainer = this.range.endContainer.parentElement as HTMLElement;

      if (startContainer == endContainer) {
        if (
          (startContainer &&
            startContainer.nodeName === 'SPAN' &&
            isFullSelection(startContainer)) ||
          ((this.range.startContainer as HTMLElement).nodeName === 'SPAN' &&
            isFullSelection(this.range.startContainer as HTMLElement))
        ) {
          startContainer.className = 'font-size-' + size; // đổi class

          if (
            startContainer.childNodes.length == 1 &&
            startContainer.firstChild?.nodeType === Node.TEXT_NODE
          ) {
            this.range.selectNodeContents(startContainer.firstChild);
            this.range.setStart(startContainer.firstChild, 0);
            this.range.setEnd(
              startContainer.firstChild,
              (startContainer.firstChild as Text).length
            );
          } else {
            this.range.selectNodeContents(startContainer);
            this.range.setStart(startContainer, 0);
            this.range.setEnd(startContainer, startContainer.childNodes.length);
          }

          this.restoreSelection();
        } else {
          const span = document.createElement('span');
          span.classList.add('font-size-' + size);
          this.range.surroundContents(span);

          // selection đang ở span
          this.range = document.createRange();

          if (
            span.childNodes.length == 1 &&
            span.firstChild?.nodeType === Node.TEXT_NODE
          ) {
            this.range.selectNodeContents(span.firstChild);
            this.range.setStart(span.firstChild, 0);
            this.range.setEnd(
              span.firstChild,
              (span.firstChild as Text).length
            );
          } else {
            this.range.selectNodeContents(span);
            this.range.setStart(span, 0);
            this.range.setEnd(span, span.childNodes.length);
          }

          this.restoreSelection();
        }
      } else {
        const startOffset = this.range.startOffset;
        const endOffset = this.range.endOffset;

        // nếu startContainer chỉ có 1 textNode con
        if (
          startContainer.childNodes.length == 1 &&
          startContainer.firstChild?.nodeType === Node.TEXT_NODE
        ) {
          //Xóa đoạn text đc bôi đen dựa vào startOffset
          const textNode = startContainer.firstChild as Text;
          textNode.deleteData(startOffset, textNode.length);
        }

        //Xóa đoạn text đc bôi đen dựa vào endOffset
        const textNodeEnd = endContainer.firstChild as Text;
        textNodeEnd.deleteData(0, endOffset);

        //Thêm span

        const span = document.createElement('span');
        span.classList.add('font-size-' + size);
        span.innerText = textContent!;

        this.range.deleteContents();
        this.range.insertNode(span);

        // document.activeElement!.insertBefore(span, endContainer);
      }
    }

    function isFullSelection(span: HTMLElement): boolean {
      // Nếu span chỉ có 1 textNode con
      if (
        span.childNodes.length === 1 &&
        span.firstChild?.nodeType === Node.TEXT_NODE
      ) {
        const textNode = span.firstChild as Text;
        return (
          self.range!.startContainer === textNode &&
          self.range!.endContainer === textNode &&
          self.range!.startOffset === 0 &&
          self.range!.endOffset === textNode.length
        );
      }

      // Nếu span có nhiều node con (text + element)
      // => kiểm tra selection bao hết từ đầu đến cuối
      const startOk =
        (self.range!.startContainer === span &&
          self.range!.startOffset === 0) ||
        (span.contains(self.range!.startContainer) &&
          self.range!.startOffset === 0);

      const endOk =
        (self.range!.endContainer === span &&
          self.range!.endOffset === span.childNodes.length) ||
        (span.contains(self.range!.endContainer) &&
          self.range!.endOffset ===
          self.range!.endContainer.textContent?.length);

      return startOk && endOk;
    }
  }

  // Lấy tất cả innerHtml của editors trong tất cả group thuộc hashMap này 
  getInnerHtmlInputsByHashCode(hashCode: string, groupIds: string[], getGroupLabel?: boolean) {

    let result = {} as any;

    const hashCodeElement = document.getElementById(hashCode) as HTMLElement;
    const groupLabel = hashCodeElement.querySelector('.cv-group-name .editor');


    if (hashCodeElement) {

      groupIds.forEach((groupId) => {

        const group = document.getElementsByClassName(groupId);

        if (group.length > 0) {

          if (hashCode.toLowerCase() == 'avatar') {

            const image = group[0].querySelector('img');

            result[groupId] = [{
              groupLabel: getGroupLabel ? groupLabel?.innerHTML : undefined,
              value: image!.src,
              code: image!.getAttribute('data-code'),
            }];

          } else {

            const editor = group[0].querySelectorAll('.editor');

            result[groupId] = Array.from(editor).map((e) => ({
              groupLabel: getGroupLabel ? groupLabel?.innerHTML : undefined,
              value: e.innerHTML,
              code: e.getAttribute('data-code'),
            }));

          }

        }

      })

      return result;

    }

    return undefined;

  }
}

export interface IAction {
  type: 'delete_group' | 'delete_hashCode' | 'add_group' | 'add_hashCode' | 'update_input';
  data: any;
}
