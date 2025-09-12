import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';

@Component({
  selector: 'app-cv-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvInputActionComponent,
    CvInputToolbarComponent,
    OverlayPanelModule
  ],
  templateUrl: './cv-input.component.html',
  styleUrl: './cv-input.component.scss'
})
export class CvInputComponent {

  // input region
  @Input() config: ICvInputConfig = {
    showAction: true,
    showToolbar: true,
    actionConfig: {
      showMoveUp: true,
      showMoveDown: true,
      showDelete: true,
      showAdd: true
    },
    toolbarConfig: {
      showAlign: false,
      showOrderList: false
    }
  };

  @Input() themeColor: string = '';

  @Input({ required: true }) element!: IThanhPhan;

  // declare region
  focus = false;


  onUpdateElement(element: IThanhPhan) {
    this.element = element;
  }
}

export interface ICvInputConfig {
  showAction: boolean;
  showToolbar: boolean;
  actionConfig: {
    showMoveUp: boolean;
    showMoveDown: boolean;
    showDelete: boolean;
    showAdd: boolean;
  };
  toolbarConfig: {
    showAlign: boolean;
    showOrderList: boolean;
  }
}