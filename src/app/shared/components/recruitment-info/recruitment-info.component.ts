import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupActionComponent } from '../cv-group-action/cv-group-action.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';
import { CvInputComponent } from '../cv-input/cv-input.component';

@Component({
  selector: 'app-recruitment-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupActionComponent,
    CdkDrag,
    CdkDropList,
    CvInputActionComponent,
    CvInputToolbarComponent,
    CvInputComponent
  ],
  templateUrl: './recruitment-info.component.html',
  styleUrl: './recruitment-info.component.scss',
})
export class RecruitmentInfoComponent implements OnChanges {
  // input region
  @Input({ required: true }) template: any;
  @Input() typeCode = 'recruitment-info';
  @Input() label = 'recruitment-info';
  @Input() focus = false;
  @Input() listElement: { [key: string]: any[] } = {};

  // output region
  @Output() onFocusEvent = new EventEmitter<string>();

  // variable region
  listElementProcessed: { [key: string]: IThanhPhan[] } = {};
  listElementGroupId: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listElement']) {
      this.processListElement();
    }
  }

  private processListElement() {
    // get unique list groupId
    if (!this.listElement) return;
    this.listElementGroupId = Object.keys(this.listElement).filter(
      (k, i, arr) => arr.indexOf(k) === i
    );
  }

  onFocus() {
    this.onFocusEvent.emit(this.typeCode);
  }
}
