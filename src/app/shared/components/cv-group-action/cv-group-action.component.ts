import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cv-group-action',
  standalone: true,
  imports: [
    CdkDragHandle,
    TooltipModule
  ],
  templateUrl: './cv-group-action.component.html',
  styleUrl: './cv-group-action.component.scss'
})
export class CvGroupActionComponent {
}
