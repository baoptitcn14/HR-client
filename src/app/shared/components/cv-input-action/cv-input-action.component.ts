import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv-input-action',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule
  ],
  templateUrl: './cv-input-action.component.html',
  styleUrl: './cv-input-action.component.scss'
})
export class CvInputActionComponent {
  // input region
  @Input({required: true}) element!: IThanhPhan;


}
