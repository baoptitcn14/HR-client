import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CommonModule } from '@angular/common';
import { IMoveEvent } from '../cv-input/cv-input.component';

@Component({
  selector: 'app-cv-input-action',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './cv-input-action.component.html',
  styleUrl: './cv-input-action.component.scss',
})
export class CvInputActionComponent {
  // input region
  @Input({ required: true }) groupId!: any;
  @Input() first = false;
  @Input() last = false;
  @Input() index = 0;

  // output region
  @Output() onMoveUpEvent = new EventEmitter<IMoveEvent>();
  @Output() onMoveDownEvent = new EventEmitter<IMoveEvent>();
  @Output() onAddEvent = new EventEmitter<IMoveEvent>();
  @Output() onDeleteEvent = new EventEmitter<IMoveEvent>();

  // di chuyển lên trên
  onMoveUp(event: any) {
    event.stopPropagation();
    this.onMoveUpEvent.emit({
      index: this.index,
      groupId: this.groupId,
    });
  }
  // di chuyển xuong duoi
  onMoveDown(event: any) {
    event.stopPropagation();
    this.onMoveDownEvent.emit({
      index: this.index,
      groupId: this.groupId,
    });
  }

  // them
  onAdd(event: any) {
    event.stopPropagation();

    this.onAddEvent.emit({
      index: this.index,
      groupId: this.groupId,
    });
  }

  //Xóa
  onDelete(event: any) {
    event.stopPropagation();

    this.onDeleteEvent.emit({
      index: this.index,
      groupId: this.groupId,
    });
  }
}
