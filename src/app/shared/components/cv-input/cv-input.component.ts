import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, Sanitizer, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CvService } from '../../../pages/create-cv/cv.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvInputActionComponent,
    CvInputToolbarComponent,
    OverlayPanelModule,
  ],
  templateUrl: './cv-input.component.html',
  styleUrl: './cv-input.component.scss',
})
export class CvInputComponent implements AfterViewChecked {


  // inject region
  cvService = inject(CvService);

  // input region

  @Input() themeColor: string = '';
  @Input({ required: true }) element!: IThanhPhan;

  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('editor') editor!: ElementRef;


  // declare region
  focus = false;

  // declare biến xử lý sự kiện scale hình
  resizing = false;
  startX = 0;
  startY = 0;
  startWidth = 0;
  startHeight = 0;
  activeCorner = '';
  width = 200;
  height = 200;


  @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.onMouseUpImageScale();
  }

  @HostListener('document:scroll', ['$event']) onScroll(event: any) {
    this.op.hide();
  }

  ngAfterViewChecked(): void {
    // this.cvService.restoreSelection()
  }

  checkBlank(event: any) {

    (this.element as any)._isBlank
      = this.cvService.isContentEditableEmpty(event.target.innerHTML);
  }

  onFocus(event: any) {
    if (this.element.cvInputConfig?.showToolbar) {
      this.op.show(event);
    }
  }

  onUpdateElementFromToolbar(event: { element: IThanhPhan, action: string }) {

    this.element = event.element;

  }

  onInputEditor(event: any) {
    this.element._isBlank
      = this.cvService.isContentEditableEmpty(event.target.innerHTML);
  }

  // Gọi hàm này khi editor focus hoặc selection thay đổi
  saveSelection() {
    this.cvService.saveSelection();
  }

  restoreSelection() {
    this.cvService.restoreSelection();
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  // Xử lý event scale hình
  onMouseDownImageScale(event: any, corner: string) {
    this.resizing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width ?? 200;
    this.startHeight = this.height ?? 200;
    this.activeCorner = corner;
  }

  onMouseUpImageScale() {
    this.resizing = false;
  }

  onMouseMoveImageScale(event: MouseEvent) {
    if (!this.resizing) return;

    const dx = event.clientX - this.startX;

    switch (this.activeCorner) {
      case 'se':
        this.element._css['element']['width'] = this.width = this.startWidth + dx;
        break;
      case 'ne':
        this.element._css['element']['width'] = this.width = this.startWidth + dx;
        break;
      case 'sw':
        this.element._css['element']['width'] = this.width = this.startWidth - dx;
        break;
      case 'nw':
        this.element._css['element']['width'] = this.width = this.startWidth - dx;
        break;
    }

    // giữ tỷ lệ ảnh 1/1
    this.element._css['element']['height'] = this.height = this.element._css['element']['width'] * (1 / 1);
  }
}

export interface IMoveEvent {
  index: number;
  groupId: string;
}

export interface ICvInputConfig {
  showAction: boolean;
  showToolbar: boolean;
  actionConfig: {
    showMoveUp: boolean;
    showMoveDown: boolean;
    showDelete: boolean;
    showAdd: boolean;
  };
  toolbarConfig: {
    showAlign: boolean;
    showOrderList: boolean;
  };
}
