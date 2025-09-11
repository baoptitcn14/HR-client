import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { IThanhPhan } from '../../shared/components/create-manual-form/create-manual-form.component';
import { HttpClient } from '@angular/common/http';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SplitterModule, SplitterResizeEndEvent } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import { BusinessCardComponent } from '../../shared/components/business-card/business-card.component';
import { RecruitmentInfoComponent } from '../../shared/components/recruitment-info/recruitment-info.component';
import { UtilitiesService } from '../../shared/services/utilities.service';

@Component({
  selector: 'app-create-cv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    SliderModule,
    ColorPickerModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    SplitterModule,
    DividerModule,
    // components group
    BusinessCardComponent,
    RecruitmentInfoComponent,
  ],
  templateUrl: './create-cv.component.html',
  styleUrl: './create-cv.component.scss',
})
export class CreateCvComponent implements OnInit {
  // inject region
  private http = inject(HttpClient);
  private utilService = inject(UtilitiesService);

  // declare region

  fonts = [
    {
      label: 'Arial',
      value: 'Arial',
    },
    {
      label: 'Times New Roman',
      value: 'Times New Roman',
    },
    {
      label: 'Inter',
      value: 'Inter',
    },
    {
      label: 'Roboto',
      value: 'Roboto',
    },
    {
      label: 'Roboto Condensed',
      value: 'Roboto Condensed',
    },
  ];

  sidebarContent = {
    show: true,
    title: 'Thêm mục',
    currentTemplate: 'Thêm mục',
    listSidebarItem: [
      {
        label: 'Thiết kế & Font',
        icon: 'pi pi-palette',
        isActive: false,
      },
      {
        label: 'Thêm mục',
        icon: 'pi pi-plus',
        isActive: true,
      },
      {
        label: 'Bố cục',
        icon: 'pi pi-th-large',
        isActive: false,
      },
    ],
  };

  template?: IThanhPhan; // cấu hình font, font size, theme color, line height
  listRow: IThanhPhan[] = []; // số dòng có trên template
  listGroupDistinct: any[] = []; // danh sách mục
  dataCvTemplate: any[] = [];

  listCdkDropListConnectedTo: string[] = [];

  ngOnInit(): void {
    this.getTemplate();
    this.getDataCvTemplate();
  }

  //#region sidebar
  selectSidebarItem(item: any) {
    if (!this.sidebarContent.show) this.sidebarContent.show = true;

    this.sidebarContent.listSidebarItem.forEach((e) => (e.isActive = false));
    item.isActive = true;

    //update title
    this.sidebarContent.title = item.label;

    //update current template
    this.sidebarContent.currentTemplate = item.label;
  }
  //#endregion

  //#region sidebar content
  onResizeEnd(event: SplitterResizeEndEvent, row: IThanhPhan) {
    row._listChild!.forEach((e, i) => (e._css['width'] = event.sizes[i]));

    row._panelSizes = this.updatePanelSizes(row);
  }

  private updatePanelSizes(row: IThanhPhan) {
    return row._listChild!.map((e) => e._css['width']);
  }

  //#endregion

  //#region CV preview

  // hàm xử lý khi thả group vào col
  dropIntoCol(event: CdkDragDrop<any[]>, col?: IThanhPhan) {
    const typeCode = event.previousContainer.data[event.previousIndex];

    if (typeCode) {
      const listDataOfTypeCode = this.dataCvTemplate
        .filter((e) => e.typeCode == typeCode)
        .map((e) => e.value);

      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        if (col) {
          const groupId = typeCode + '#' + this.utilService.customId(8);

          // add các thành phần vào nhóm

          const listThanhPhan = listDataOfTypeCode.reduce((acc, e) => [
            ...acc,
            ...e.map((x: any) => ({ ...x, groupId: groupId })),
          ]);

          col._listChild = [...col._listChild!, ...listThanhPhan];

          // update hash map groupId
          if (col._hashMapTypeCode && col._hashMapTypeCode[typeCode]) {
            if (col._hashMapTypeCode[typeCode][groupId]) {
              listThanhPhan.forEach((e: any) => {
                col._hashMapTypeCode[typeCode][groupId].push(e);
              });
            } else {
              col._hashMapTypeCode[typeCode][groupId] = listThanhPhan;
            }
          } else {
            col._hashMapTypeCode[typeCode] = {
              [groupId]: listThanhPhan,
            };
          }
        }
      }
    }
  }

  //#endregion

  //#region get data
  private getTemplate() {
    this.http.get<IThanhPhan[]>('/assets/template.json').subscribe((data) => {
      const templateData = data.map((item: IThanhPhan) => ({
        ...item,
        _css: JSON.parse(item.css ?? '{}'),
      })) as IThanhPhan[];

      this.template = templateData.find(
        (item: IThanhPhan) => item.inputType == 'template'
      );
      this.listRow = templateData
        .filter((item: IThanhPhan) => item.inputType == 'row')
        .map((r) => ({
          ...r,
          _listChild: templateData
            .filter((e) => e.rowId == r.id)
            .map((e) => ({
              ...e,
              _listChild: [] as IThanhPhan[],
              _listTypeCode: [] as string[],
              _hashMapTypeCode: {},
            })),
          _panelSizes: templateData
            .filter((e) => e.rowId == r.id)
            .map((e) => e._css['width']),
          _panelMinSizes: templateData
            .filter((e) => e.rowId == r.id)
            .map((e) => 20),
        })) as IThanhPhan[];

      this.listCdkDropListConnectedTo = templateData
        .filter((item: IThanhPhan) => item.inputType == 'col')
        .map((r) => r.id) as string[];
    });
  }

  private getDataCvTemplate() {
    this.http.get<any[]>('/assets/data-cv-template.json').subscribe((data) => {
      this.dataCvTemplate = data;

      // distinct by lable property
      this.listGroupDistinct = data
        .filter(
          (item, i, arr) =>
            arr.findIndex((e) => e.typeCode == item.typeCode) == i
        )
        .map((item: any) => item.typeCode);
    });
  }

  //#endregion
}
