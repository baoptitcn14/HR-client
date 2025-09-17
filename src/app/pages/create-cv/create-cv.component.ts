import { CommonModule } from '@angular/common';
import { Component, Host, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
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
import { IUpdateElement, CvElementComponent } from '../../shared/components/cv-element/cv-element.component';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { CvService } from './cv.service';
import { CvElement5Component } from '../../shared/components/cv-element-5/cv-element-5.component';

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
    CvElementComponent,
    CvElement5Component
  ],
  templateUrl: './create-cv.component.html',
  styleUrl: './create-cv.component.scss',
})
export class CreateCvComponent implements OnInit {
  // inject region
  private http = inject(HttpClient);
  private utilService = inject(UtilitiesService);
  private cvService = inject(CvService);
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.scrollingElement.scrollTop;

    if (scrollTop > 100) {
      document.getElementById('cv-toolbar')?.classList.add('fixed');
      document.getElementById('sidebar-group')?.classList.add('fixed');
    } else {
      document.getElementById('cv-toolbar')?.classList.remove('fixed');
      document.getElementById('sidebar-group')?.classList.remove('fixed');
    }
  }

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
    const data = event.previousContainer.data[event.previousIndex];

    if (data) {

      const typeCode = data.typeCode;

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
          const listDataOfTypeCode = this.dataCvTemplate
            .filter((e) => e.typeCode == typeCode)
            .map((e) => e.value.filter((x: IThanhPhan) => x.industryId == (this.template?.industryId ?? "")));

          const groupId = typeCode + '#' + this.utilService.customId(8);

          // add các thành phần vào nhóm

          const defaultCssJson = `{"element": {"fontSize": "${this.template?._css['template']['fontSize']}", "font": "${this.template?._css['template']['font']}"}}`;

          const listThanhPhan = (listDataOfTypeCode.reduce((acc, e) => [
            ...acc,
            ...e
          ]).map((e: IThanhPhan) => ({
            ...e,
            _css: JSON.parse(e.css ?? defaultCssJson),
            groupId: groupId,
            _value: e._value ?? e.defaultValue,
          })) as any[]).sort((e1: any, e2: any) => e1.fieldIndex - e2.fieldIndex);

          const colPreviousId = event.previousContainer.id;
          // tìm Row chứa column, column này có thành phần được kéo
          const rowContainerColPrevious = this.listRow.find(r => r._listChild?.findIndex(e => e.id == colPreviousId) != -1);

          // Kiểm tra có phải kéo từ 1 row khác không
          if (rowContainerColPrevious) {

            // column này có thành phần được kéo
            const colPrevious = rowContainerColPrevious?._listChild?.find(e => e.id == colPreviousId);

            if (colPrevious) {

              // Kiểm tra col này có cái typeCode đang đc kéo không
              if (colPrevious._hashMapTypeCode[typeCode]) {

                col._hashMapTypeCode[typeCode] = colPrevious._hashMapTypeCode[typeCode];
                delete colPrevious._hashMapTypeCode[typeCode];

              } else {
                // update hash map groupId
                if (col._hashMapTypeCode && !col._hashMapTypeCode[typeCode]) {
                  col._hashMapTypeCode[typeCode] = {
                    [groupId]: listThanhPhan,
                  };
                }
              }

            }

          } else {


            // ====> sẽ tính _listChild sau, có thể là ở sự kiện Save
            // col._listChild = [...col._listChild!, ...listThanhPhan];

            // update hash map groupId
            if (col._hashMapTypeCode && !col._hashMapTypeCode[typeCode]) {
              col._hashMapTypeCode[typeCode] = {
                [groupId]: listThanhPhan,
              };
            }

          }

        }
      }
    }
  }


  onUpdateElement(event: IUpdateElement, col: IThanhPhan) {
    console.log(col)
  }

  onChangeThemeColor(event?: ColorPickerChangeEvent) {

    function isLight(color: string) {
      const c = color.substring(1); // bỏ dấu #
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      return brightness > 170;
    }

    const themeColor = event ? event.value as string : this.template?._css['template']['themeColor'];

    let cv = document.getElementById('cv-content')

    if (cv) {
      cv.style.setProperty(
        "--text-color-on-bg",
        isLight(themeColor) ? 'color-mix(in srgb, var(--theme-color) 10%, #000)' : 'color-mix(in srgb, var(--theme-color) 10%, #ffffffff)'
      );

      cv.style.setProperty(
        "--bg-color-group-name",
        isLight(themeColor) ? 'color-mix(in srgb, var(--theme-color) 10%, #000)' : 'color-mix(in srgb, var(--theme-color) 10%, #ffffffff)'
      );
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

      // danh sách hàng của template
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

      // danh sách các input của template
      const elements = templateData.filter(
        (item: IThanhPhan) => (item as Object).hasOwnProperty('columId')
      )

      // nếu ds có thì đưa các element vào đúng vị trí trên template
      if (elements.length > 0) {

        this.listRow.forEach(x => {

          x._listChild?.forEach((col: IThanhPhan) => {
            this.proccessDataCol(col, elements);
          })

        })

      }

      // liên kết các vùng drop
      this.listCdkDropListConnectedTo = templateData
        .filter((item: IThanhPhan) => item.inputType == 'col')
        .map((r) => r.id) as string[];


      // set color theme
      this.onChangeThemeColor();
    });
  }

  private proccessDataCol(col: IThanhPhan, elements: any[] = []) {
    if (col) {

      // lấy danh sách các group thuộc col này và order theo field index tăng dần
      col._listTypeCode = elements.filter((e) => e.columId == col.id)
        .sort((a, b) => a.fieldIndex - b.fieldIndex)
        .filter((e, i, arr) => arr.findIndex((x) => x.typeCode == e.typeCode) == i)
        .map((e) => ({
          typeCode: e.typeCode,
          label: e.label,
          layout: e.layout
        }));

      // từ các mã code của group lấy các element thuộc group đó và tạo groupId cho nhóm 
      col._listTypeCode.forEach((e) => {

        const typeCode = e.typeCode;

        const listDataOfTypeCode = elements
          .filter((e) => e.typeCode == typeCode)
          .map((e) => e.value.filter((x: IThanhPhan) => x.industryId == (this.template?.industryId ?? "")));

        const groupId = typeCode + '#' + this.utilService.customId(8);

        // add các thành phần vào nhóm
        const defaultCssJson = `{"element": {"fontSize": "${this.template?._css['template']['fontSize']}", "font": "${this.template?._css['template']['font']}"}}`;

        const listThanhPhan = listDataOfTypeCode.reduce((acc, e) => [
          ...acc,
          ...e,
        ], []).map((e: IThanhPhan) => ({
          ...e,
          _css: JSON.parse(e.css ?? defaultCssJson),
          groupId: groupId,
          _value: e._value ?? e.defaultValue,
          _isBlank: this.cvService.isContentEditableEmpty(e._value ?? e.defaultValue),
        })).sort((e1: any, e2: any) => e1.fieldIndex - e2.fieldIndex);;

        // update hash map groupId
        if (col._hashMapTypeCode && !col._hashMapTypeCode[typeCode!]) {
          col._hashMapTypeCode[typeCode!] = {
            [groupId]: listThanhPhan,
          };
        }
      })


    }
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
        .map((item: any) => ({
          typeCode: item.typeCode,
          label: item.label,
          layout: item.layout
        }));


      console.log(this.listGroupDistinct)
    });
  }

  //#endregion
}
