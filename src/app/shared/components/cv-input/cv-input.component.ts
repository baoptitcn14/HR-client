import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CvService } from '../../../pages/create-cv/cv.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CropImageComponent } from '../crop-image/crop-image.component';
import { IThanhPhan } from '../../../pages/page-viec-lam/ung-tuyen-dialog/ung-tuyen-dialog.component';
import { ICv } from '../../../pages/create-cv/create-cv.component';


@Component({
  selector: 'app-cv-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvInputToolbarComponent,
    OverlayPanelModule,
    ButtonModule,
    DialogModule,
    CropImageComponent
  ],
  templateUrl: './cv-input.component.html',
  styleUrl: './cv-input.component.scss',
})
export class CvInputComponent implements OnChanges {

  // inject region
  cvService = inject(CvService);

  // input region

  @Input() themeColor: string = '';
  @Input({ required: true }) element!: ICv;

  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('editor') editor!: ElementRef;

  // declare region
  focus = false;
  showDialogUploadImage = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['element'] && this.element?.code?.toLowerCase() === 'avatar') {
      this.width = parseInt(this.element._css!['element']['width']) || 200;
      this.height = parseInt(this.element._css!['element']['height']) || 200;
    }
  }

  onShowDialog() {
    this.showDialogUploadImage = true;
  }

  checkBlank(event: any) {
    (this.element as any)._isBlank = this.cvService.isContentEditableEmpty(
      event.target.innerHTML
    );
  }

  onFocus(event: any) {
    if (this.element._inputConfigOpenJson?.showToolbar) {
      this.op.show(event);
    }
  }

  onUpdateElementFromToolbar(event: { element: ICv; action: string }) {
    this.element = event.element;
  }

  onInputEditor(event: any) {
    this.element._isBlank = this.cvService.isContentEditableEmpty(
      event.target.innerHTML
    );
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
        this.element._css!['element']['width'] = this.width =
          this.startWidth + dx;
        break;
      case 'ne':
        this.element._css!['element']['width'] = this.width =
          this.startWidth + dx;
        break;
      case 'sw':
        this.element._css!['element']['width'] = this.width =
          this.startWidth - dx;
        break;
      case 'nw':
        this.element._css!['element']['width'] = this.width =
          this.startWidth - dx;
        break;
    }

    // giữ tỷ lệ ảnh 1/1
    this.element._css!['element']['height'] = this.height = this.width * (1 / 1);
  }

  //save Image
  onSaveImage(event: string) {
    this.element.value = event;
    this.showDialogUploadImage = false;
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
