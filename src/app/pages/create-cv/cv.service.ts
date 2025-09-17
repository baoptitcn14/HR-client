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

  constructor() {}

  saveSelection() {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      this.range = selection.getRangeAt(0);
    }

    // nếu là bôi đen text
    if (this.range?.collapsed == false) {
      const span = document.createElement('span');
      span.classList.add('active-text');
      this.range.surroundContents(span);
    } else {
      document.activeElement
        ?.querySelectorAll('.active-text')
        .forEach((item) => {
          const childNodes = item.childNodes;
          item.replaceWith(...(childNodes as any));
        });

      document.activeElement?.normalize();
    }

    this.checkTagName();
  }

  private checkTagName() {
    const self = this;
    if (this.range) {
      const starContainer = this.range.startContainer
        .parentElement as HTMLElement;

      // checkParent(starContainer);
      if (starContainer.tagName == 'SPAN') {
        checkParent(starContainer);
      } else {
        if (starContainer) {
          this.b$.next(starContainer.tagName === 'B');
          this.i$.next(starContainer.tagName === 'I');
          this.u$.next(starContainer.tagName === 'U');
        }

        const ancestor = this.range.commonAncestorContainer as HTMLElement;

        if (ancestor) {
          if (!this.b$.value) this.b$.next(ancestor.tagName === 'B');

          if (!this.i$.value) this.i$.next(ancestor.tagName === 'I');

          if (!this.u$.value) this.u$.next(ancestor.tagName === 'U');

          checkParent(ancestor);
        }
      }
    }

    // Kiểm tra cha có phải thẻ b, i, u không
    function checkParent(element: HTMLElement) {
      const parentNode = element.parentElement as HTMLElement;

      if (!parentNode || parentNode.tagName == 'SPAN') return;

      if (!self.b$.value) self.b$.next(parentNode.tagName === 'B');

      if (!self.i$.value) self.i$.next(parentNode.tagName === 'I');

      if (!self.u$.value) self.u$.next(parentNode.tagName === 'U');

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
    return html === '';
  }

  // set Font family
  setFontFamily(font: string) {
    if (this.range) {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      this.range.surroundContents(span);
    }
  }

  //apply font weight
  applyBold() {
    if (this.b$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('b');
  }

  //apply italic
  applyItalic() {
    if (this.i$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('i');
  }

  //apply underline
  applyUnderline() {
    if (this.u$.value || (this.range && this.range.collapsed == false))
      this.applyTextStyle('u');
  }

  //apply text style
  private applyTextStyle(style: 'b' | 'i' | 'u') {
    const self = this;

    if (this.range) {
      // nếu là bôi đen text
      if (this.range.collapsed == false) {
        let text = document.activeElement?.querySelector('.active-text');

        if (text) {
          let value = this[`${style}$`].value;
          this[`${style}$`].next(!this[`${style}$`].value);

          if (value == false) {
            const tag = document.createElement(style);
            this.range.surroundContents(tag);
          } else {
            // const childNodes = text.childNodes;
            // text.replaceWith(...(childNodes as any));
            checkParent(text as HTMLElement, style);
          }
        }
        
      }
      // chỉ là con trỏ
      else {
      }

      // // kiểm tra có phải là thẻ DIV không
      // if (
      //   (this.range.startContainer.parentElement &&
      //     this.range.startContainer.parentElement.nodeName === 'DIV') ||
      //   (this.range.startContainer &&
      //     this.range.startContainer.nodeName === 'DIV')
      // ) {
      //   // nếu đúng thì ...
      //   // kiểm tra state của style

      //   // lấy value của style hiện tại
      //   let value = this[`${style}$`].value;

      //   // đổi trạng thái
      //   this[`${style}$`].next(!this[`${style}$`].value);

      //   if (value == false) {
      //     //  nếu chưa thì kích hoạt và thêm thẻ vào
      //     const tag = document.createElement(style);
      //     this.range.surroundContents(tag);
      //   } else {
      //     // nếu đang kích hoạt thì xóa thẻ đi
      //     const childNodes = this.range.startContainer.childNodes;

      //     let node = null;

      //     for (let i = 0; i < childNodes.length; i++) {
      //       if (
      //         childNodes[i].nodeName === style.toUpperCase() &&
      //         childNodes[i].textContent ==
      //           this.range.cloneContents().textContent
      //       ) {
      //         node = childNodes[i];
      //         break;
      //       }
      //     }

      //     if (node) {
      //       var childNodess = node.childNodes;
      //       node.replaceWith(...(childNodess as any));
      //     } else {
      //       //nếu không thấy node, dò tìm con của các node không phải #text
      //       const nodes = (
      //         this.range.startContainer as HTMLDivElement
      //       ).querySelectorAll(style.toUpperCase());

      //       for (let i = 0; i < nodes.length; i++) {
      //         if (nodes[i].nodeName === 'text') continue;

      //         if (this.range.collapsed == false) {
      //           if (
      //             nodes[i].textContent == this.range.cloneContents().textContent
      //           ) {
      //             const childNodes = nodes[i].childNodes;
      //             nodes[i].replaceWith(...(childNodes as any));
      //             break;
      //           }
      //         } else {
      //           console.log(nodes[i], this.range);
      //         }
      //       }
      //     }
      //   }
      // } else {
      //   // nếu không phải là DIV => SPAN, U, I, B

      //   if (
      //     this.range.startContainer &&
      //     this.range.startContainer.parentElement?.tagName === 'SPAN'
      //   ) {
      //   } else proccess(style);
      // }
    }

    function proccess(style: 'u' | 'i' | 'b') {
      if (
        self.range!.startContainer.parentElement?.tagName ===
        style.slice(0, 1).toUpperCase()
      ) {
        if (self[`${style}$`].value) {
          const childNodes =
            self.range!.startContainer.parentElement.childNodes;
          self.range!.startContainer.parentElement.replaceWith(
            ...(childNodes as any)
          );
        } else {
          //  nếu chưa thì kích hoạt và thêm thẻ vào
          const tag = document.createElement(style);
          self.range!.surroundContents(tag);
        }

        self[`${style}$`].next(!self[`${style}$`].value);
      } else {
        if (self[`${style}$`].value) {
          checkParent(
            self.range!.startContainer.parentElement as any,
            style.slice(0, 1).toUpperCase()
          );
        } else {
          //  nếu chưa thì kích hoạt và thêm thẻ vào
          const tag = document.createElement(style);
          self.range!.surroundContents(tag);
        }
        self[`${style}$`].next(!self[`${style}$`].value);
      }
    }

    // Kiểm tra cha có phải thẻ b, i, u không
    function checkParent(element: HTMLElement, style: string) {
      let parentNode = element.parentElement as HTMLElement;

      if (!parentNode || parentNode.tagName == 'div') return;

      if (parentNode.tagName === style.toUpperCase()) {
        const childNodes = parentNode.childNodes;
        parentNode.replaceWith(...(childNodes as any));

        document.activeElement?.normalize();

      } else checkParent(parentNode, style);
    }
  }

  //set Font size
  setFontSize(size: number) {
    if (this.range) {
      const container = this.range.startContainer.parentElement as HTMLElement;

      const l = this.range.startContainer.textContent!.trim().length;

      if (container && container.tagName === 'SPAN') {
        container.className = 'font-size-' + size; // đổi class
      } else {
        const span = document.createElement('span');
        span.classList.add('font-size-' + size);
        this.range.surroundContents(span);
      }

      this.restoreSelection();
    }
  }
}
