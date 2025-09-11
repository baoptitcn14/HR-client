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
    CvInputToolbarComponent,
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
