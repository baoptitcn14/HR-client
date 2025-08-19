import { Component, Input, OnInit } from '@angular/core';
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogTest2Component } from '../dialog-test-2/dialog-test-2.component';
import { DialogFooterDirective } from '../../directives/dialog-footer.directive';

@Component({
  selector: 'app-dialog-test',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './dialog-test.component.html',
  styleUrl: './dialog-test.component.scss',
})
export class DialogTestComponent implements OnInit {
  isNew!: boolean;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.isNew = this.config.data.isNew;
  }

  onShowDialog() {
    this.dialogService.open(DialogTest2Component, {
      // đặt 1 class cho dialog e.g "demo-test-2-dialog"
      styleClass: 'p-dialog-custom demo-test-2-dialog',
    });
  }

  onHide() {
    this.ref.close();
  }
}
