import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupToolbarComponent } from '../cv-group-toolbar/cv-group-toolbar.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';

@Component({
  selector: 'app-recruitment-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupToolbarComponent,
    CdkDrag,
    CdkDropList,
    CvInputToolbarComponent
  ],
  templateUrl: './recruitment-info.component.html',
  styleUrl: './recruitment-info.component.scss'
})
export class RecruitmentInfoComponent {

  // input region
  @Input() typeCode = 'recruitment-info';
  @Input() label = 'recruitment-info';
  @Input() focus = false;
  @Input() listElement: IThanhPhan[] = [];

  // output region
  @Output() onFocusEvent = new EventEmitter<string>();

  onFocus() {
    this.onFocusEvent.emit(this.typeCode);
  }

}
