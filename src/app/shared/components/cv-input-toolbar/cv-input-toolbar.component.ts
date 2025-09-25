import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { CvService } from '../../../pages/create-cv/cv.service';
import { IThanhPhan } from '../../../pages/page-viec-lam/ung-tuyen-dialog/ung-tuyen-dialog.component';

@Component({
  selector: 'app-cv-input-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerModule, ButtonModule],
  templateUrl: './cv-input-toolbar.component.html',
  styleUrl: './cv-input-toolbar.component.scss',
})
export class CvInputToolbarComponent implements OnInit {
  // inject region
  private cvService = inject(CvService);
  private destroyRef = inject(DestroyRef);
  // input region
  @Input({ required: true }) element!: IThanhPhan;

  // output region
  @Output() onUpdateElementEvent = new EventEmitter<{
    element: IThanhPhan;
    action: string;
  }>();
  @Output() onRestoreSelectionEvent = new EventEmitter();

  // declare region
  fontSizes = Array.from({ length: 48 }, (_, index) => index + 1).slice(11);
  fonts = ['Arial', 'Times New Roman', 'Inter', 'Roboto'];
  textAlignButtons = ['left', 'center', 'right', 'justify'];

  textStyleButtons = [
    { label: 'B', styleClass: '', active: false },
    { label: 'I', styleClass: 'italic', active: false },
    { label: 'U', styleClass: 'underline', active: false },
  ];

  ngOnInit(): void {
    // this.subscribeStateButtons();
  }

  // Theo dõi state của các textStyleButtons
  // private subscribeStateButtons() {
  //   // bold button
  //   this.cvService.b$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((data) => {
  //       this.textStyleButtons[0].active = data;
  //       this.textStyleButtons[0].styleClass = data ? 'active' : '';
  //     });

  //   // italic button
  //   this.cvService.i$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((data) => {
  //       this.textStyleButtons[1].active = data;
  //       this.textStyleButtons[1].styleClass = data ? 'active italic' : 'italic';
  //     });

  //   // underline button
  //   this.cvService.u$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((data) => {
  //       this.textStyleButtons[2].active = data;
  //       this.textStyleButtons[2].styleClass = data
  //         ? 'active underline'
  //         : 'underline';
  //     });
  // }

  onUpdateElement(action: string) {
    this.onUpdateElementEvent.emit({ element: this.element, action });
  }

  onChangeTextAlign(textAlign: string) {
    this.element._css!['element']['textAlign'] = textAlign;
    // this.onUpdateElement();
  }

  onActionToolbar(action: string, data: any) {
    this.cvService.restoreSelection();

    if (action == 'textStyle') {
      if (data.label == 'B') {
        this.cvService.applyBold();
      } else if (data.label == 'I') {
        this.cvService.applyItalic();
      } else if (data.label == 'U') {
        this.cvService.applyUnderline();
      }
    } else if (action == 'font') {
      this.cvService.setFontFamily(data);
    } else if (action == 'fs') {
      this.cvService.setFontSize(data);
    } else if (action == 'orderList') {
      if (data == 'bullet') {
        this.cvService.applyOrderListBullet();
      } else if (data == 'number') {
        this.cvService.applyOrderListNumber();
      }
    } else if (action == 'color') {
      this.cvService.applyFontColor(data.value);
    } else if (action == 'align') {
      this.cvService.applyAlignment(data);
    }
  }

  onShowColorPicker(event: any) {
    this.onRestoreSelectionEvent.emit();
  }

  // onChangeOrderList(type: string) {
  //   this.element._css['element']['listStyleType'] = type;
  //   // this.onUpdateElement();
  // }
}
