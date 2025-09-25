import { CommonModule } from '@angular/common';
import { Component, ElementRef, Host, HostListener, inject, input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
import { HttpClient } from '@angular/common/http';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SplitterModule, SplitterResizeEndEvent } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import { CvElementComponent } from '../../shared/components/cv-element/cv-element.component';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { CvService } from './cv.service';
import { CvElement5Component } from '../../shared/components/cv-element-5/cv-element-5.component';
import { IMoveGroupEvent } from './cv-element-base.directive';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ICriteriaRequestDto, JobFieldInputDto, JobFieldServiceProxy, UserCVInputDto, UserCVOutputDto, UserCVQueryDto, UserCVServiceProxy } from '../../shared/service-proxies/sys-service-proxies';
import { PdfPreviewService } from './pdf-preview.service';
import { v4 as uuidv4 } from 'uuid';
import { AppSessionService } from '../../shared/session/app-session.service';
import { ICss } from '../page-viec-lam/ung-tuyen-dialog/ung-tuyen-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ICvInputConfig } from '../../shared/components/cv-input/cv-input.component';
import { MessageService } from 'primeng/api';

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
    CdkDragPlaceholder,
    SplitterModule,
    DividerModule,
    TooltipModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
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
  private pdfPreviewService = inject(PdfPreviewService);
  private userCvServiceProxy = inject(UserCVServiceProxy);
  private appSessionService = inject(AppSessionService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
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

  template?: ICv;

  // cấu hình font, font size, theme color, line height
  listRow: ICv[] = []; // số dòng có trên template
  dataCvTemplate: any[] = [];

  listGroupUsedDistinct: ITypeCode[] = []; // danh sách mục đã sử dụng
  listGroupAvailable: ITypeCode[] = []; // danh sách mục chưa sử dụng

  listCdkDropListConnectedTo: string[] = [];

  // create cv or Update cv
  templateId: string = '';

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

    // get id cv từ router
    this.activatedRoute.params.subscribe((params) => {

      this.templateId = params['id'];

      if (this.templateId) {



      } else {
        this.getDataCvTemplate();
      }

    })

  }

  // UPDATE LABEL TYPE CODE Event
  onUpdateLabelEvent(event: { label: string, typeCode: string }, col: ICv) {

    let typeCode = col._listTypeCode?.find((e) => e.typeCode == event.typeCode);

    if (typeCode) {
      typeCode.label = event.label;
    }

  }

  //#region EVENT LƯU CV, UNDO, REDO PREVIEW

  async onSave() {

    // Lưu data 
    // tempalte ( image, inputType, css )

    const templateId = uuidv4();

    const template = {
      ...this.template,
      id: templateId,
      css: JSON.stringify(this.template?._css),
      name: this.template!.name ?? 'Name Default'
    };

    // Lưu data 
    // Rows ( image, fieldIndex, inputType, templateId )
    const listRow = this.listRow.map((r) => ({
      fieldIndex: r.fieldIndex,
      inputType: r.inputType,
      templateId: templateId,
      id: r.id
    }) as ICv);


    // Lưu data 
    // Cols ( image, fieldIndex, inputType, templateId, rowId, css )
    const listCol = this.listRow.flatMap((r) => r._listChild!.map((c) => ({
      ...c,
      templateId: templateId,
      rowId: c.rowId,
      css: JSON.stringify(c._css),
    }))) as ICv[];


    // Lưu data
    // listHashCode ( label, fieldIndex, typeCode, layout, templateId, rowId, colId, )
    const listHashCode = listCol.flatMap((c) => c._listTypeCode!.map((h) => ({
      ...h,
      templateId: templateId,
      rowId: c.rowId,
      columnId: c.id,
      option: h.layout,
      inputType: INPUT_TYPE_CODE.TYPE_CODE,
    })))

    // Lưu data 
    // hashCode ( label, fieldIndex, hashCode, layout, templateId, rowId, colId, ) 
    // editors, image ( _value: innerHtml, inputType, fieldIndex, cvInputConfig, code, templateId, rowId, colId, icon?, css?  )
    //  gán dữ liệu trên editor hiện tại 
    let listEditor: ICv[] = [];

    listCol.forEach(c => {

      const listContentEditorCurrent = Object.keys(c._hashMapTypeCode!)
        .flatMap((hashCode) =>
          this.cvService.getInnerHtmlInputsByHashCode(hashCode, Object.keys(c._hashMapTypeCode![hashCode]), true)
        )

      Object.keys(c._hashMapTypeCode!).forEach(hashCode => {

        listContentEditorCurrent.forEach(e => {

          // key của Group
          const key = Object.keys(e)[0];

          // các editor có trong Group
          const value = Object.values(e)[0] as ICv[];

          // lấy ds editor của group (key) trong hashcode này
          const listEditorInGroup = c._hashMapTypeCode![hashCode][key];

          // nếu listGroup tồn tại
          if (listEditorInGroup) {
            listEditor = [...listEditor, ...listEditorInGroup.map((ed: any) =>
            ({
              ...ed,
              defaultValue: '',
              css: JSON.stringify(ed._css),
              templateId: templateId,
              rowId: c.rowId,
              columId: c.id,
              inputConfig: JSON.stringify(ed.cvInputConfig),
              value: ed.inputType == INPUT_TYPE_CODE.IMAGE
                ? ed._value.split(',')[1]
                : value.find((x: any) => x.code == ed.code)?._value,
              id: uuidv4()
            })
            )];
          }
        })

      })

    })

    // CALL API
    this.userCvServiceProxy.createOrUpdateList(
      [...[template], ...listRow, ...listCol, ...listHashCode, ...listEditor]
        .map((m) => UserCVInputDto.fromJS({
          ...m,
          userId: this.appSessionService.userId
        })))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Lưu thành công',
          life: 5000
        })
      })

  }

  previewCV() {
    this.pdfPreviewService.previewPdf('#cv-template');
  }

  //#endregion

  //#region EVENT ACTIONS TOOLBAR GROUP

  onMoveGroupEvent(event: IMoveGroupEvent, col: ICv) {
    const temp = col._listTypeCode![event.previousIndex];

    col._listTypeCode![event.previousIndex] =
      col._listTypeCode![event.currentIndex];
    col._listTypeCode![event.currentIndex] = temp;
  }

  onDeleteGroupEvent(typeCode: string, col: ICv) {
    const data = col._listTypeCode?.find((e) => e.typeCode == typeCode);

    col._listTypeCode = col._listTypeCode?.filter(
      (e) => e.typeCode !== typeCode
    );

    // xóa dữ liệu trong hashmap của col
    delete col._hashMapTypeCode![typeCode];

    // remove group from listGroupUsedDistinct
    this.listGroupUsedDistinct = this.listGroupUsedDistinct.filter(
      (e) => e.typeCode !== typeCode
    );

    if (typeCode != OTHERS_TYEPCODE) {
      // add group to listGroupAvailable
      this.listGroupAvailable.push(data!);
    }
  }

  //#endregion

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

  // bắt sự kiện khi resize các cột
  onResizeEnd(event: SplitterResizeEndEvent, row: ICv) {
    row._listChild!.forEach((e, i) => (e._css['width'] = event.sizes[i]));

    row._panelSizes = this.updatePanelSizes(row);
  }

  // update width của các cột trên row
  private updatePanelSizes(row: ICv) {
    return row._listChild!.map((e: ICv) => e._css['width']);
  }

  //#endregion

  //#region CV preview

  // hàm xử lý khi thả group vào col
  dropIntoCol(event: CdkDragDrop<any[]>, col?: ICv) {

    if (event.previousContainer === event.container && event.container.id == 'groups') return;

    const data = event.previousContainer.data[event.previousIndex];

    // if (col && col._hashMapTypeCode[data.typeCode]) return;

    if (data) {
      const typeCode = data.typeCode;

      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {

        if (typeCode != OTHERS_TYEPCODE) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {

          // nếu là thông tin thêm thì copy

          copyArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          )
        }

        if (col) {
          const listDataOfTypeCode = this.dataCvTemplate
            .filter((e) => e.typeCode == typeCode)
            .map((e) =>
              e.value.filter(
                (x: ICv) =>
                  x.industryId == (this.template?.industryId ?? '')
              )
            );

          const groupId = typeCode + '#' + this.utilService.customId(8);

          // bởi vì thông tin thêm ( others ) không phải là duy nhất trong 1 template
          // nên khi thêm others vào template phải tạo cho nó 1 cái typeCode khác là duy nhất
          // sẽ gọi chung là hashCode = typeCode hoặc typeCode#random nếu là others
          const hashCode = typeCode == OTHERS_TYEPCODE ? `${typeCode}#${this.utilService.customId(8)}` : typeCode;

          // nếu là Others thì lấy data ra và upadate typeCode thành hashCode
          if (typeCode == OTHERS_TYEPCODE) {

            const index = col._listTypeCode!.findIndex((e: ITypeCode) => e.typeCode == typeCode);

            if (index > -1) {
              col._listTypeCode?.splice(index, 1, {
                ...col._listTypeCode![index],
                typeCode: hashCode
              });
            }

          }
          // tìm Row chứa column, column này có thành phần được kéo
          const colPreviousId = event.previousContainer.id;

          const rowContainerColPrevious = this.listRow.find(
            (r) => r._listChild?.findIndex((e: ICv) => e.id == colPreviousId) != -1
          );


          // Kiểm tra có phải kéo từ 1 row khác không
          if (rowContainerColPrevious) {
            // column này có thành phần được kéo
            const colPrevious = rowContainerColPrevious?._listChild?.find(
              (e: ICv) => e.id == colPreviousId
            );

            if (colPrevious) {
              // Kiểm tra col này có cái typeCode đang đc kéo không
              if (colPrevious._hashMapTypeCode![hashCode]) {

                // Danh sách group có trong hashCode này
                const groupIds = Object.keys(colPrevious._hashMapTypeCode![hashCode]);

                // data hiện tại trên giao diện
                const dataCurrent = this.cvService.getInnerHtmlInputsByHashCode(hashCode, groupIds);

                groupIds.forEach((groupId) => {

                  // gans duwx liệu cho các editor
                  colPrevious._hashMapTypeCode![hashCode][groupId] =
                    colPrevious._hashMapTypeCode![hashCode][groupId].map((e: ICv) => {

                      const group = dataCurrent[groupId] as ICv[];

                      let editor = group.find(x => x.code == e.code);

                      return {
                        ...e,
                        _value: editor?._value
                      }
                    })

                });

                col._hashMapTypeCode![hashCode] = colPrevious._hashMapTypeCode![hashCode];

                // Xóa data ở col bị kéo
                delete colPrevious._hashMapTypeCode![hashCode];

              }
            }
          } else {
            // ====> sẽ tính _listChild sau, có thể là ở sự kiện Save

            // add các thành phần vào nhóm

            const listThanhPhan = (
              listDataOfTypeCode
                .reduce((acc, e) => [...acc, ...e])
                .map((e: ICv) => ({
                  ...e,
                  _css: JSON.parse(e.css ?? '{}'),
                  groupId: groupId,
                  _value: e._value ?? e.defaultValue,
                  _isBlank: !e._value && !e.defaultValue,
                  id: uuidv4(),
                })) as any[]
            ).sort((e1: any, e2: any) => e1.fieldIndex - e2.fieldIndex);

            // update hash map groupId

            if (col._hashMapTypeCode && !col._hashMapTypeCode[hashCode]) {
              col._hashMapTypeCode[hashCode] = {
                [groupId]: listThanhPhan,
              };
            }
          }
        }
      }

      if (data.typeCode != OTHERS_TYEPCODE) {

        // đưa group có type code này  vào list Used

        const idxGroup = this.listGroupUsedDistinct.findIndex(
          (x) => x.typeCode == data.typeCode
        );

        if (idxGroup < 0) this.listGroupUsedDistinct.splice(0, 0, data);
        else {
          if (!col) this.listGroupUsedDistinct.splice(idxGroup, 1);
        }
      }


    }
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

    const themeColor = event
      ? (event.value as string)
      : this.template?._css!['template']['themeColor'];

    let cv = document.getElementById('cv-content');

    if (cv) {
      cv.style.setProperty(
        '--text-color-on-bg',
        isLight(themeColor)
          ? 'color-mix(in srgb, var(--theme-color) 10%, #000)'
          : 'color-mix(in srgb, var(--theme-color) 10%, #ffffff)'
      );

      cv.style.setProperty(
        '--bg-color-group-name',
        isLight(themeColor)
          ? 'color-mix(in srgb, var(--theme-color) 10%, #000)'
          : 'color-mix(in srgb, var(--theme-color) 10%, #ffffff)'
      );
    }
  }
  //#endregion

  //#region get data
  private getTemplateDefault() {
    this.http.get<ICv[]>('assets/template.json').subscribe((data) => {
      this.proccessDataTemplate(data);
    });
  }

  // Xử lý dữ liệu sau khi lấy về
  private proccessDataTemplate(data: ICv[]) {
    // mở css json ra
    const templateData = data.map((item: ICv) => ({
      ...item,
      _css: JSON.parse(item.css ?? '{}'),
    })) as ICv[];

    // lấy template
    this.template = templateData.find(
      (item: ICv) => item.inputType == INPUT_TYPE_CODE.TEMPLATE
    );

    // danh sách hàng của template
    this.listRow = templateData
      .filter((item) => item.inputType == INPUT_TYPE_CODE.ROW)
      .map((r) => ({
        ...r,
        id: r.id?.startsWith('default') ? uuidv4() : r.id,
        _listChild: templateData
          .filter((e) => e.rowId == r.id)
          .map((e) => ({
            ...e,
            _listChild: [] as ICv[],
            _listTypeCode: [] as string[],
            _hashMapTypeCode: {},
          })),
        _panelSizes: templateData
          .filter((e) => e.rowId == r.id)
          .map((e) => e._css!['width']),
        _panelMinSizes: templateData
          .filter((e) => e.rowId == r.id)
          .map((e) => 20),
      } as any));


    // danh sách các type code ( Mục ) của template
    const typeCodes = templateData.filter((item: ICv) =>
      // (item as Object).hasOwnProperty('columId')
      item.inputType == INPUT_TYPE_CODE.TYPE_CODE
    );

    // nếu ds có thì đưa các element vào đúng vị trí trên template
    if (typeCodes.length > 0) {
      this.listRow.forEach((x) => {
        x._listChild?.forEach((col: ICv) => {

          col.rowId = x.id!;

          this.proccessDataCol(col, typeCodes, templateData);
        });
      });
    }

    // liên kết các vùng drop
    this.listCdkDropListConnectedTo = templateData
      .filter((item: ICv) => item.inputType == INPUT_TYPE_CODE.COLUMN)
      .map((r) => r.id) as string[];

    // set color theme
    this.onChangeThemeColor();
  }
  private proccessDataCol(col: ICv, typeCodes: ICv[] = [], templateData: ICv[]) {
    if (col) {
      const newColumnId = col.id?.startsWith('default_') ? uuidv4() : col.id; // gen id cho column

      // lấy danh sách các group thuộc col này và order theo field index tăng dần
      col._listTypeCode = typeCodes
        .filter((e) => e.columId == col.id)
        .sort((a, b) => parseInt(a.fieldIndex!) - parseInt(b.fieldIndex!))
        .filter(
          (e, i, arr) => arr.findIndex((x) => x.typeCode == e.typeCode) == i
        )
        .map((e) => ({
          typeCode: e.typeCode,
          label: e.label,
          layout: e.option,
          fieldIndex: e.fieldIndex,
          columnId: newColumnId,
        } as ITypeCode));

      // loại bỏ các group đã được sử dụng trong listGroupAvailable

      this.listGroupAvailable = this.listGroupAvailable.filter(
        (e) => !col._listTypeCode!.find((x: ITypeCode) => x.typeCode == e.typeCode)
      );

      this.listGroupUsedDistinct = [
        ...this.listGroupUsedDistinct,
        ...col._listTypeCode,
      ];

      // từ các mã code của typeCode lấy các input thuộc typeCode đó và tạo hashCode cho nhóm
      col._listTypeCode.forEach((e: ITypeCode) => {
        const typeCode = e.typeCode;

        const listInputOfTypeCode =
          !this.templateId

            // Đây là data lấy từ file json
            ? (typeCodes as any)
              .filter((e: any) => e.typeCode == typeCode)
              .map((e: any) =>
                //  phần typecode value là 1 array input, đây là cấu trúc trong file json
                e.value.filter(
                  (x: ICv) =>
                    x.industryId == (this.template?.industryId ?? '')
                )
              )

            // đây là data lấy từ db, dto khác với json ở trên
            // lấy editor trực tiếp từ data lấy về
            : templateData.filter((e: ICv) => e.columId == col.id && e.groupId?.includes(typeCode.toLowerCase()));

        const groupId = typeCode + '#' + this.utilService.customId(8);

        // add các thành phần vào nhóm
        const listThanhPhan = listInputOfTypeCode
          .reduce((acc: any, e: any) => [...acc, ...e], [])
          .map((e: ICv) => ({
            ...e,
            _css: JSON.parse(e.css ?? '{}'),
            groupId: groupId,
            _value: e._value ?? e.defaultValue,
            _isBlank: this.cvService.isContentEditableEmpty(
              e._value ?? e.defaultValue
            ),
            columnId: newColumnId,
          }))
          .sort((e1: any, e2: any) => e1.fieldIndex - e2.fieldIndex);

        // update hash map groupId
        if (col._hashMapTypeCode && !col._hashMapTypeCode[typeCode!]) {
          col._hashMapTypeCode[typeCode!] = {
            [groupId]: listThanhPhan,
          };
        }
      });

      //gán newId cho column
      col.id = newColumnId;
    }
  }

  // get data cv template DEFAULT
  private getDataCvTemplate() {
    this.http.get<any[]>('assets/data-cv-template.json').subscribe((data) => {
      this.dataCvTemplate = data;

      // distinct by lable property
      this.listGroupAvailable = data
        .filter(
          (item, i, arr) =>
            arr.findIndex((e) => e.typeCode == item.typeCode) == i
        )
        .map((item: ITypeCode) => ({
          typeCode: item.typeCode,
          label: item.label,
          layout: item.layout,

        } as ITypeCode));

      this.getTemplateDefault();
    });
  }

  // get data user cv
  private getDataUserCv(templateId: string) {

    const input = new UserCVQueryDto();

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'userId',
        operation: 0,
        value: this.appSessionService.userId + '',
      }),
      new ICriteriaRequestDto({
        propertyName: 'templateId',
        operation: 0,
        value: templateId,
      }),
    ];

    this.userCvServiceProxy
      .getList(input)
      .subscribe((data) => {
        this.template = data.find((e) => e.id == templateId) as ICv;

        // distinct by lable property
        this.listGroupAvailable = data.filter(e => e.inputType == INPUT_TYPE_CODE.TYPE_CODE).map((item: any) => ({
          typeCode: item.typeCode,
          label: item.label,
          layout: item.layout,
        } as ITypeCode));;



      });
  }

  //#endregion
}

// type code của Thông tin thêm
export const OTHERS_TYEPCODE = 'Others';

// input Type code
export const INPUT_TYPE_CODE = {
  EDITOR: 'editor',
  TEMPLATE: 'template',
  ROW: 'row',
  COLUMN: 'col',
  TYPE_CODE: 'typeCode',
  IMAGE: 'image',
};

export interface ICv extends UserCVOutputDto {
  _listChild?: ICv[];
  _isSelected?: boolean;
  _css: ICss;
  _groupId?: string;
  _value?: any;
  _panelSizes?: number[]; // panelSizes cua splitter dùng cho row
  _panelMinSizes?: number[]; // panelMinSizes cua splitter dùng cho row
  _listTypeCode?: ITypeCode[]; // chứa typeCode của các group được thả vào col
  _hashMapTypeCode?: { [typeCode: string]: { [groupId: string]: any[] } }; // chứa các typeCode là duy nhất làm key và value là hashmap groupId -> listThanhPhan
  cvInputConfig?: ICvInputConfig;
  icon?: string;
  _isBlank?: boolean; // element này có giá trị hay không
  image?: string;
}

interface ITypeCode {
  typeCode: string;
  label: string;
  layout: string;
  fieldIndex: string;
  columnId?: string;
}