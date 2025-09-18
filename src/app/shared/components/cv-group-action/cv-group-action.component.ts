import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cv-group-action',
  standalone: true,
  imports: [CdkDragHandle, TooltipModule, CommonModule],
  templateUrl: './cv-group-action.component.html',
  styleUrl: './cv-group-action.component.scss',
})
export class CvGroupActionComponent {
  // input region
  @Input() first = false;
  @Input() last = false;

  // output region
  @Output() onMoveUpEvent = new EventEmitter();
  @Output() onMoveDownEvent = new EventEmitter();
  @Output() onDeleteEvent = new EventEmitter();

  onDelete(event: any) {
    event.stopPropagation();
    this.onDeleteEvent.emit();
  }

  onMoveUp(event: any) {
    event.stopPropagation();
    this.onMoveUpEvent.emit();
  }

  onMoveDown(event: any) {
    event.stopPropagation();
    this.onMoveDownEvent.emit();
  }
}
