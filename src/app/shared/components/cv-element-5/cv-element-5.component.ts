import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupActionComponent } from '../cv-group-action/cv-group-action.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputComponent, IMoveEvent } from '../cv-input/cv-input.component';
import { CvElementBaseDirective } from '../../../pages/create-cv/cv-element-base.directive';
import { IThanhPhan } from '../../../pages/page-viec-lam/ung-tuyen-dialog/ung-tuyen-dialog.component';

@Component({
  selector: 'app-cv-element-5',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupActionComponent,
    CdkDrag,
    CvInputActionComponent,
    CvInputComponent,
  ],
  templateUrl: './cv-element-5.component.html',
  styleUrl: './cv-element-5.component.scss',
})
export class CvElement5Component extends CvElementBaseDirective {
  // input region
  @Input() override typeCode = 'cv-element-5';
  @Input() override label = 'cv-element-5';

}

export interface IUpdateElement {
  groupId: string;
  data: IThanhPhan[];
}
