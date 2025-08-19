import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicFormComponent, IControl } from '@trenet2/ng-form-json-dynamic';
import { DialogFooterDirective } from '../../directives/dialog-footer.directive';
import { DialogFooterComponent } from '../../dialog-partials/dialog-footer/dialog-footer.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dynamic-dialog',
  standalone: true,
  imports: [ButtonModule, DynamicFormComponent, DialogFooterDirective, DialogFooterComponent],
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.scss'
})
export class DynamicDialogComponent {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);

  form = new FormGroup({});
  controls: IControl[] = []
  isNew: boolean = true;

  constructor(
    private config: DynamicDialogConfig
  ) {
    this.controls = this.config.data.controls;
    this.isNew = this.config.data.isNew;
  }


  onSave() {
    this.ref.close(this.form.value);
  }

  onClose() {
    this.ref.close();
  }

  onDelete() {
    this.ref.close('delete');
  }
}
