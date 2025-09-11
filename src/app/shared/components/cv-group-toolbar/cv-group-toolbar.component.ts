import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cv-group-toolbar',
  standalone: true,
  imports: [
    CdkDragHandle,
    TooltipModule
  ],
  templateUrl: './cv-group-toolbar.component.html',
  styleUrl: './cv-group-toolbar.component.scss'
})
export class CvGroupToolbarComponent {
}
