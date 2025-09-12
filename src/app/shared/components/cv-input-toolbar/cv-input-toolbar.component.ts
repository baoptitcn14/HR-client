import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { FormsModule } from '@angular/forms';
import { ICvInputConfig } from '../cv-input/cv-input.component';

@Component({
  selector: 'app-cv-input-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPickerModule, ButtonModule],
  templateUrl: './cv-input-toolbar.component.html',
  styleUrl: './cv-input-toolbar.component.scss',
})
export class CvInputToolbarComponent {
  // input region
  @Input({ required: true }) element!: IThanhPhan;

  // output region
  @Output() onUpdateElementEvent = new EventEmitter();

  // declare region
  fontSizes = [
    12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
  ];
  fonts = ['Arial', 'Times New Roman', 'Inter', 'Roboto'];
  textAlignButtons = ['left', 'center', 'right', 'justify'];

  textStyleButtons = [
    { label: 'B', styleClass: '', active: false },
    { label: 'I', styleClass: 'italic', active: false },
    { label: 'U', styleClass: 'underline', active: false },
  ];


  onUpdateElement() {
    this.onUpdateElementEvent.emit(this.element);
  }

  onChangeFontSize(fontSize: number) {
    this.element._css['element']['fontSize'] = fontSize;
    this.onUpdateElement();
  }

  onChangeFont(font: string) {
    this.element._css['element']['font'] = font;
    this.onUpdateElement();
  }

  onChangeTextAlign(textAlign: string) {
    this.element._css['element']['textAlign'] = textAlign;
    this.onUpdateElement();
  }

  onChangeTextStyle(button: {
    label: string;
    styleClass: string;
    active: boolean;
  }) {
    button.active = !button.active;

    if (button.active) button.styleClass += ' active';
    else {
      button.styleClass = button.styleClass.replace(' active', '');
    }

    if (button.label == 'B') {
      this.element._css['element']['fontWeight'] = button.active
        ? 'bold'
        : 'normal';
    } else if (button.label == 'I') {
      this.element._css['element']['fontStyle'] = button.active
        ? 'italic'
        : 'normal';
    } else {
      this.element._css['element']['textDecoration'] = button.active
        ? 'underline'
        : 'none';
    }

    this.onUpdateElement();
  }
}
