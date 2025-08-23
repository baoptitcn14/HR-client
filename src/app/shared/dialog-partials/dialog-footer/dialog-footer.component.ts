import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule],
})
export class DialogFooterComponent {
  @Input({ required: true }) isNew: boolean | undefined = false;
  @Input({ required: true }) isValid: boolean | undefined = false;
  @Input() textButtonSave: string | undefined = 'Lưu';

  @Output() onSaveEvent = new EventEmitter();
  @Output() onDeleteEvent = new EventEmitter();
  @Output() onCopyEvent = new EventEmitter();
  @Output() onCloseEvent = new EventEmitter();

  isDelete = false;

  constructor() {}

  onSave() {
    this.onSaveEvent.emit();
  }

  onDelete() {
    this.isDelete = true;
  }

  onCancelDelete() {
    this.isDelete = false;
  }

  onConfirmDelete() {
    this.onDeleteEvent.emit();
  }

  closeDialog() {
    this.onCloseEvent.emit();
  }

  onCopy() {
    this.onCopyEvent.emit();
  }
}
