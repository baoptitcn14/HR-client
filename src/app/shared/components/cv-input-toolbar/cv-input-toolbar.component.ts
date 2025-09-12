import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-input-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerModule,
    ButtonModule
  ],
  templateUrl: './cv-input-toolbar.component.html',
  styleUrl: './cv-input-toolbar.component.scss'
})
export class CvInputToolbarComponent {
  // input region
  @Input({ required: true }) element!: IThanhPhan;


  // output region
  @Output() onUpdateElementEvent = new EventEmitter();


  // declare region
  fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];
  fonts = ['Arial', 'Times New Roman', 'Inter', 'Roboto', 'Roboto Condensed'];

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
}
