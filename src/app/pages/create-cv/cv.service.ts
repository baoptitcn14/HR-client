import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  // lưu vị trí trỏ chuột
  private range: Range | null = null;

  // theo dõi trạng thái của các button trên toolbar input
  bold$ = new BehaviorSubject<boolean>(false);
  italic$ = new BehaviorSubject<boolean>(false);
  underline$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  saveSelection() {

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      this.range = selection.getRangeAt(0);
    }

    // console.log(this.range);
    this.checkTagName();
  }

  private checkTagName() {
    const self = this;
    if (this.range) {

      const starContainer = this.range.startContainer.parentElement as HTMLElement;

      // checkParent(starContainer);
      if (starContainer.tagName == 'SPAN') {

        checkParent(starContainer);

      } else {

        if (starContainer) {

          this.bold$.next(starContainer.tagName === 'B');
          this.italic$.next(starContainer.tagName === 'I');
          this.underline$.next(starContainer.tagName === 'U');

        }

        const ancestor = this.range.commonAncestorContainer as HTMLElement;

        if (ancestor) {
          if (!this.bold$.value)
            this.bold$.next(ancestor.tagName === 'B');

          if (!this.italic$.value)
            this.italic$.next(ancestor.tagName === 'I');

          if (!this.underline$.value)
            this.underline$.next(ancestor.tagName === 'U');

          checkParent(ancestor);
        }
      }


    }


    // Kiểm tra cha có phải thẻ b, i, u không
    function checkParent(element: HTMLElement) {


      const parentNode = element.parentElement as HTMLElement;

      if (!parentNode || parentNode.tagName == 'SPAN') return;

      if (!self.bold$.value)
        self.bold$.next(parentNode.tagName === 'B');

      if (!self.italic$.value)
        self.italic$.next(parentNode.tagName === 'I');

      if (!self.underline$.value)
        self.underline$.next(parentNode.tagName === 'U');


      checkParent(parentNode);
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

  // set Font family
  setFontFamily(font: string) {
    if (this.range) {
      const span = document.createElement("span");
      span.style.fontFamily = font;
      this.range.surroundContents(span);
    }
  }

  //apply font weight
  applyBold() {
    if (this.bold$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('b');
  }

  //apply italic
  applyItalic() {
    if (this.italic$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('i');
  }

  //apply underline
  applyUnderline() {
    if (this.underline$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('u');
  }

  //apply text style
  private applyTextStyle(style: 'b' | 'i' | 'u') {

    if (this.range) {

      // kiểm tra có phải là thẻ DIV không
      if (
        (this.range.startContainer.parentElement && this.range.startContainer.parentElement.nodeName === 'DIV')
        || (this.range.startContainer && this.range.startContainer.nodeName === 'DIV')
      ) {

        // nếu đúng thì ...
        // kiểm tra state của style

        let value = null;

        if (style === 'b') {
          value = this.bold$.value;
          this.bold$.next(!this.bold$.value);
        } else if (style === 'i') {
          value = this.italic$.value;
          this.italic$.next(!this.italic$.value);
        } else {
          value = this.underline$.value;
          this.underline$.next(!this.underline$.value);
        }

        if (value == false) {
          //  nếu chưa thì kích hoạt và thêm thẻ vào
          const tag = document.createElement(style);
          this.range.surroundContents(tag);

        } else {

          // nếu đang kích hoạt thì xóa thẻ đi
          const childNodes = this.range.startContainer.childNodes;

          let node = null;

          for (let i = 0; i < childNodes.length; i++) {

            if (
              childNodes[i].nodeName === style.toUpperCase()
              && childNodes[i].textContent == this.range.cloneContents().textContent
            ) {
              node = childNodes[i];
              break;
            }
          }

          if (node) {
            var childNodess = node.childNodes;
            node.replaceWith(...childNodess as any);
          }
          else {

            //nếu không thấy node, dò tìm con của các node không phải #text
            const nodes = (this.range.startContainer as HTMLDivElement).querySelectorAll(style.toUpperCase());

            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].textContent == this.range.cloneContents().textContent) {
                const childNodes = nodes[i].childNodes;
                nodes[i].replaceWith(...childNodes as any);
                break;
              }
            }
          }


        }

      } else {
        // nếu không phải là DIV => SPAN, U, I, B

        if (this.range.startContainer && this.range.startContainer.parentElement?.tagName === 'SPAN') {


        } else {

          if (style === 'b' && this.range.startContainer.parentElement?.tagName === 'B') {

            const childNodes = this.range.startContainer.parentElement.childNodes;
            this.range.startContainer.parentElement.replaceWith(...childNodes as any);
            this.bold$.next(false);

          } else if (style === 'i' && this.range.startContainer.parentElement?.tagName === 'I') {

            const childNodes = this.range.startContainer.parentElement.childNodes;
            this.range.startContainer.parentElement.replaceWith(...childNodes as any);
            this.italic$.next(false);

          } else if (style === 'i' && this.range.startContainer.parentElement?.tagName === 'U') {

            const childNodes = this.range.startContainer.parentElement.childNodes;
            this.range.startContainer.parentElement.replaceWith(...childNodes as any);
            this.underline$.next(false);

          }

        }

      }


      // // kiểm tra parent có thẻ style không
      // if (
      //   this.range.startContainer.parentElement &&
      //   this.range.startContainer.parentElement.tagName === style.toUpperCase()
      // ) {

      //   // nếu có thì xóa thẻ style đi, để lại bình thường

      //   const childNodes = this.range.startContainer.parentElement.childNodes;

      //   this.range.startContainer.parentElement.replaceWith(...childNodes as any);


      //   if (style === 'b')
      //     this.bold$.next(false);

      //   if (style === 'i')
      //     this.italic$.next(false);

      //   if (style === 'u')
      //     this.underline$.next(false);

      // } else {

      //   // kiểm tra cha
      //   if (!checkParent(this.range.commonAncestorContainer as HTMLElement, style)) {


      //     // kiểm tra con
      //     // const childNodes = this.range.startContainer.childNodes;

      //     // if (childNodes.length > 0) {

      //     //   let flag = false;

      //     //   childNodes.forEach((node: any) => {

      //     //     if (node.tagName === style.toUpperCase()) {
      //     //       const childNodes = node.childNodes;
      //     //       node.replaceWith(...childNodes as any);

      //     //       flag = true;
      //     //     }

      //     //   })

      //     //   if (!flag) {
      //     //     const tag = document.createElement(style);
      //     //     this.range.surroundContents(tag);

      //     //     if (style === 'b')
      //     //       this.bold$.next(false);

      //     //     if (style === 'i')
      //     //       this.italic$.next(false);

      //     //     if (style === 'u')
      //     //       this.underline$.next(false);
      //     //   } else {
      //     //     if (style === 'b')
      //     //       this.bold$.next(true);

      //     //     if (style === 'i')
      //     //       this.italic$.next(true);

      //     //     if (style === 'u')
      //     //       this.underline$.next(true);
      //     //   }


      //     // } else {
      //     const tag = document.createElement(style);
      //     this.range.surroundContents(tag);


      //     if (style === 'b')
      //       this.bold$.next(true);

      //     if (style === 'i')
      //       this.italic$.next(true);

      //     if (style === 'u')
      //       this.underline$.next(true);
      //     // }

      //   } else {
      //     if (style === 'b')
      //       this.bold$.next(false);

      //     if (style === 'i')
      //       this.italic$.next(false);

      //     if (style === 'u')
      //       this.underline$.next(false);
      //   };
      // }

    }

    // Kiểm tra cha có phải thẻ b, i, u không
    function checkParent(element: HTMLElement, style: string) {

      let parentNode = element.parentElement as HTMLElement;

      if (!parentNode || parentNode.tagName == 'div') return false;

      if (parentNode.tagName === style.toUpperCase()) {
        const childNodes = parentNode.childNodes;
        parentNode.replaceWith(...childNodes as any);
        return true;
      } else
        return checkParent(parentNode, style);

    }
  }

  //set Font size
  setFontSize(size: number) {

    if (this.range) {

      const container = this.range.startContainer.parentElement as HTMLElement;

      const l = this.range.startContainer.textContent!.trim().length;

      if (
        container && container.tagName === 'SPAN'
      ) {
        container.className = "font-size-" + size; // đổi class
      } else {
        const span = document.createElement("span");
        span.classList.add("font-size-" + size);
        this.range.surroundContents(span);
      }

      this.restoreSelection();

    }
  }
}
