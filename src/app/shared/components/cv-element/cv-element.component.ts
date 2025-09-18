import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupActionComponent } from '../cv-group-action/cv-group-action.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputComponent } from '../cv-input/cv-input.component';
import { CvElementBaseDirective } from '../../../pages/create-cv/cv-element-base.directive';

@Component({
  selector: 'app-cv-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupActionComponent,
    CdkDrag,
    CvInputActionComponent,
    CvInputComponent,
  ],
  templateUrl: './cv-element.component.html',
  styleUrl: './cv-element.component.scss',
})
export class CvElementComponent extends CvElementBaseDirective {}
