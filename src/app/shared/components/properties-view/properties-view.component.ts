import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { DEVICES, IThanhPhan } from '../../../pages/mau-tieu-chi/mau-tieu-chi';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { PrimeIconsComponent } from '../prime-icons/prime-icons.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-properties-view',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    ColorPickerModule,
    DropdownModule,
    ChipsModule,
    DialogModule,
    PrimeIconsComponent,
    CheckboxModule,
    InputSwitchModule,
    InputTextareaModule,
    FileUploadModule
  ],
  templateUrl: './properties-view.component.html',
  styleUrl: './properties-view.component.scss',
})
export class PropertiesViewComponent {


  @Input() field?: IThanhPhan;
  @Input() dataCodes?: any[];
  @Input() loadingButtonRemove = false;
  @Output() onChangeWidthEvent = new EventEmitter<{
    field: IThanhPhan;
    maThietBi: string;
  }>();
  @Output() onDeleteEvent = new EventEmitter<IThanhPhan>();

  @ViewChild('footer') footer!: any;

  readonly widthOptions = [
    {
      label: '100%',
      value: 12,
    },
    {
      label: '80%',
      value: 10,
    },
    {
      label: '75%',
      value: 9,
    },
    {
      label: '67%',
      value: 8,
    },
    {
      label: '60%',
      value: 7,
    },
    {
      label: '50%',
      value: 6,
    },
    {
      label: '40%',
      value: 5,
    },
    {
      label: '33%',
      value: 4,
    },
    {
      label: '25%',
      value: 3,
    },
    {
      label: '20%',
      value: 2,
    },
  ];

  readonly alignOptions = [
    {
      icon: 'pi pi-align-left',
      value: 'align-items-start',
    },
    {
      icon: 'pi pi-align-center',
      value: 'align-items-center',
    },
    {
      icon: 'pi pi-align-right',
      value: 'align-items-end',
    },
  ];

  dialogService = inject(DialogService);

  maThietBi = DEVICES;

  visible = false;


  showIconPicker(propertieName: string) {
    const ref = this.dialogService.open(PrimeIconsComponent, {
      header: 'Danh sách biểu tượng',
      width: '75vw',
      breakpoints: {
        '1199px': '75vw',
        '575px': '90vw',
      },
      contentStyle: { overflow: 'auto' },
      modal: true,
    })

    ref.onClose.subscribe((icon: any) => {
      this.field!._css[propertieName]!.icon = icon;
    })
  }

  changeAlign(align: any) {
    this.field!._css.align = align;
  }

  onChangeWidth(maThietBi: string) {
    this.onChangeWidthEvent.emit({ field: this.field!, maThietBi: maThietBi });
  }

  deleteThanhPhan() {
    this.onDeleteEvent.emit(this.field!);
  }

}
