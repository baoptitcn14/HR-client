import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeSelectModule } from 'primeng/treeselect';
import { DynamicDialogSerivce } from '../../../core/services/dynamic-dialog.service';
import {
  IThanhPhan,
  DEVICES,
  LIST_DEVICE,
} from '../../../pages/mau-tieu-chi/mau-tieu-chi';
import { AppConst } from '../../app-const';
import {
  CategoryInfoServiceProxy,
  JobFieldServiceProxy,
  CategoryQueryDto,
  ICriteriaRequestDto,
  JobFieldInputDto,
  CategoryOutputDto,
} from '../../service-proxies/sys-service-proxies';
import { UtilitiesService } from '../../services/utilities.service';
import { ChonNganhNgheComponent } from '../chon-nganh-nghe/chon-nganh-nghe.component';
import { ComponentsComponent } from '../components/components.component';
import { PageHeadingComponent } from '../page-heading/page-heading.component';
import { PropertiesViewComponent } from '../properties-view/properties-view.component';
import { StandardComponentsComponent } from '../standard-components/standard-components.component';

@Component({
  selector: 'app-create-manual-form',
  standalone: true,
  imports: [
    CommonModule,
    PropertiesViewComponent,
    ComponentsComponent,
    StandardComponentsComponent,
    DropdownModule,
    TabViewModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TabViewModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CheckboxModule,
    RadioButtonModule,
    EditorModule,
    MultiSelectModule,
    RatingModule,
    ChipsModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    ToolbarModule,
    ChipsModule,
    FileUploadModule,
    SplitButtonModule,
    TreeSelectModule,
    ToastModule,
  ],
  templateUrl: './create-manual-form.component.html',
  styleUrl: './create-manual-form.component.scss',
})
export class CreateManualFormComponent {
  private utilitiesService = inject(UtilitiesService);
  private categoryInfoService = inject(CategoryInfoServiceProxy);
  private httpClient = inject(HttpClient);

  // Input, Output region
  @Input() showDropdownNganhNghe?: boolean = true;
  @Input() dsThanhPhanInput: IThanhPhan[] = [];
  @Output() onSaveEvent = new EventEmitter<IEventSaveCreateManualForm>();

  //#region Khai báo biến
  draggedThanhPhan?: IThanhPhan;
  dsNhomId: string[] = [];
  dsThanhPhanDangCo: IThanhPhan[] = [];

  selectedThanhPhan?: IThanhPhan;
  activeTab = 0;
  emailPattern = AppConst.emailPattern;

  // thiết bị hiển thị
  maThietBi = DEVICES;
  dsThietBiHienThi = LIST_DEVICE;
  thietBiHienThi = DEVICES.DESKTOP;

  // biến để destroy các subscription
  private destroyRef = inject(DestroyRef);

  // lưu các thành phần có inputType = "group"
  groupComponent = [
    {
      id: 'group',
      inputType: 'group',
      label: 'Nhóm',
      css: '{"responsive":{"desktop":12,"tablet":12,"mobile":12},"label":{"fontSize":"16","color":"#000000","icon":""}}',
    },
  ];

  // lưu các thành phần standard có inputType != 'group'
  standardChildComponent: IThanhPhan[] = [];

  // ds các ngành nghề
  dsNganhNghe: TreeNode[] = [];
  selectedNganhNghe?: TreeNode;

  // state loading
  loadingButtonRemove = false;
  loadingButtonSave = false;
  //#endregion

  ngOnInit(): void {
    this.getNganhNghes();
    this.getStandardComponentJson();
    this.xuLyThanhPhan();
  }

  private xuLyThanhPhan() {
    if (this.dsThanhPhanInput.length > 0) {
      this.dsThanhPhanDangCo = this.dsThanhPhanInput
        .filter((thanhPhan) => thanhPhan.inputType == 'group')
        .map(
          (item) =>
            ({
              ...item,
              _css: JSON.parse(item.css ?? '{}'),
              _listValueOptionOpenJSON: item.listValueOption
                ? JSON.parse(item.listValueOption)
                : [],
              _listRelationOpenJSON: item.listRelation
                ? JSON.parse(item.listRelation)
                : [],
              // _key: item.key,
              // _groupId: item.groupId,
            } as IThanhPhan)
        );

      this.dsThanhPhanDangCo.forEach((thanhPhan) => {
        thanhPhan._listChild = this.dsThanhPhanInput
          .filter((item) => item._groupId == thanhPhan._key)
          .map(
            (item) =>
              ({
                ...item,
                _css: JSON.parse(item.css ?? '{}'),
                _listValueOptionOpenJSON: item.listValueOption
                  ? JSON.parse(item.listValueOption)
                  : [],
                _listRelationOpenJSON: item.listRelation
                  ? JSON.parse(item.listRelation)
                  : [],
                // _key: item.key,
                // _groupId: item.groupId,
              } as IThanhPhan)
          );
      });
    }
  }

  private getNganhNghes() {
    const input = new CategoryQueryDto();
    input.tenantId = AppConst.tenantDefaultId;
    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'groupCode',
        operation: 0,
        value: 'INDUSTRY',
      }),
    ];
    input.sorting = 'hashCode asc';

    this.categoryInfoService.getList(input).subscribe((data) => {
      this.dsNganhNghe = this.tranformDataFromCategoryToTreeNode(data);
    });
  }

  deleteThanhPhan(thanhPhan: IThanhPhan) {
    this.loadingButtonRemove = true;

    if (this.selectedThanhPhan) {
      setTimeout(() => {
        if (this.selectedThanhPhan?._groupId) {
          const group = this.dsThanhPhanDangCo.find(
            (item) => item._key == this.selectedThanhPhan?._groupId
          );
          group!._listChild = group?._listChild?.filter(
            (item) => item._key != thanhPhan._key
          );
        } else {
          this.dsThanhPhanDangCo = this.dsThanhPhanDangCo.filter(
            (item) => item._key != thanhPhan._key
          );
        }

        this.selectedThanhPhan = undefined;

        this.loadingButtonRemove = false;
      }, 100);
    }
  }

  save() {
    this.onSaveEvent.emit({
      dsThanhPhan: this.dsThanhPhanDangCo,
      jobFieldFromDsThanhPhan: this.getJobFieldFromDsThanhPhanDangCo(),
    });
  }

  private getJobFieldFromDsThanhPhanDangCo() {
    let result = [] as IThanhPhan[];

    this.dsThanhPhanDangCo.forEach((thanhPhan) => {
      result.push(thanhPhan);

      if (thanhPhan._listChild && thanhPhan._listChild.length > 0)
        result = [...result, ...thanhPhan._listChild];
    });

    return result;
  }

  private tranformDataFromCategoryToTreeNode(
    data: CategoryOutputDto[]
  ): TreeNode[] {
    if (!data) return [];

    const root = data.filter((x) => x.parentId == null);
    const children = data.filter((x) => x.parentId != null);

    function transformData(object: CategoryOutputDto): TreeNode {
      if (!object) return {};

      const parent = children.find((x) => x.id == object.parentId);

      return {
        key: object.id,
        label: object.name ?? '',
        children: children
          .filter((x) => x.parentId == object.id)
          .map((m) => transformData(m)),
        leaf: children.filter((x) => x.parentId == object.id).length == 0,
        parent: parent
          ? {
              key: parent.id,
              label: parent.name,
            }
          : undefined,
      };
    }

    return root.map((m) => transformData(m));
  }

  private getStandardComponentJson() {
    this.httpClient
      .get('../../../assets/standard-components.json', { responseType: 'json' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.groupComponent = [
          ...this.groupComponent,
          ...data.filter((c: any) => c.inputType == 'group'),
        ].map((item: any) => ({ ...item, _css: JSON.parse(item.css ?? '{}') }));

        this.standardChildComponent = data
          .filter((c: any) => c.inputType != 'group')
          .map((item: any) => ({
            ...item,
            _css: JSON.parse(item.css ?? '{}'),
          }));
      });
  }

  //#region Xử lý các event tương tác

  setTabActive(event: number) {
    this.activeTab = event;
  }

  onSelectThanhPhan(thanhPhan: IThanhPhan | undefined, event: any) {
    event.stopPropagation();

    if (!thanhPhan) return;

    this.updateSelectedThanhPhan(thanhPhan);

    this.activeTab = 1;
  }

  onDragStart(event: any) {
    this.draggedThanhPhan = event;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (this.draggedThanhPhan) {
      // Kiểm tra draggedThanhPhan là field mới hay đã có sẵn trong nhóm

      if (this.draggedThanhPhan._key) {
        moveItemInArray(
          this.dsThanhPhanDangCo,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        const _key =
          this.draggedThanhPhan.inputType +
          '#' +
          this.utilitiesService.customId(8);

        let thanhPhanMoi = structuredClone({
          ...this.draggedThanhPhan,
          _listChild: this.standardChildComponent
            .filter((c) => c.typeCode == this.draggedThanhPhan!.typeCode)
            .map((c) => ({
              ...c,
              _key: c.inputType + '#' + this.utilitiesService.customId(8),
              _groupId: _key,
            })),
          _key: _key,
        }) as IThanhPhan;

        this.dsThanhPhanDangCo.splice(event.currentIndex, 0, thanhPhanMoi);

        this.dsNhomId = this.dsThanhPhanDangCo.map((item) => item._key!);
      }

      this.draggedThanhPhan = undefined;
    }
  }

  dropInGroup(event: any, group: IThanhPhan) {
    if (this.draggedThanhPhan) {
      const cNew = structuredClone({
        ...this.draggedThanhPhan,
        _groupId: group._key,
        _key:
          this.draggedThanhPhan.inputType +
          '#' +
          this.utilitiesService.customId(8),
        _isSelected: true,
      }) as IThanhPhan;

      // thanh phần tại vị trí được thả
      const currentThanhPhan = group._listChild![event.currentIndex];

      // nếu field này đã có nhóm
      if (this.draggedThanhPhan._groupId) {
        // di chuyển trong cùng 1 nhóm
        if (this.draggedThanhPhan._groupId == group._key) {
          this.updateThuocTinhThanhPhan(cNew, currentThanhPhan);

          //  đổi vị trí
          group._listChild![event.previousIndex] = currentThanhPhan;
          group._listChild![event.currentIndex] = cNew;
        } else {
          // lấy nhóm của field được kéo ( nhóm cũ )
          let oldGroup = this.dsThanhPhanDangCo.find(
            (item) => item._key == this.draggedThanhPhan!._groupId
          );

          if (oldGroup) {
            // xóa field ở nhóm cũ
            oldGroup._listChild = oldGroup._listChild!.filter(
              (item) => item._key != this.draggedThanhPhan!._key
            );
          }

          this.updateThuocTinhThanhPhan(cNew, currentThanhPhan);

          // thêm field vào group mới
          group._listChild!.splice(event.currentIndex, 0, cNew);
        }
      }
      // nếu field này chưa có nhóm, được kéo từ các field có sẵn cơ bản
      else {
        this.updateThuocTinhThanhPhan(cNew, currentThanhPhan);
        // thêm field vào group
        group._listChild!.splice(event.currentIndex, 0, cNew);
      }

      this.updateSelectedThanhPhan(cNew);
      this.draggedThanhPhan = undefined;
    }
  }

  //#endregion

  private updateSelectedThanhPhan(thanhPhan: IThanhPhan) {
    this.dsThanhPhanDangCo.forEach((item) => {
      item._isSelected = false;
      item._listChild?.forEach((item) => (item._isSelected = false));
    });

    thanhPhan._isSelected = true;
    this.selectedThanhPhan = thanhPhan;
  }

  private updateThuocTinhThanhPhan(
    draggedThanhPhan: IThanhPhan,
    currentThanhPhan: IThanhPhan | undefined
  ) {
    if (currentThanhPhan) {
      // đổi vị trí 2 thành phần

      // lấy responsive và rowId hiện tại của thành phần được kéo
      const draggedThanhPhanResponsive = Object.assign(
        {},
        draggedThanhPhan._css.responsive
      );

      // cập nhật width responsive cho thành phần được kéo
      draggedThanhPhan._css.responsive = Object.assign(
        {},
        {
          desktop: currentThanhPhan._css.responsive?.desktop,
          tablet: currentThanhPhan._css.responsive?.tablet,
          mobile: currentThanhPhan._css.responsive?.mobile,
        }
      );

      // cập nhật width responsive cho currentThanhPhan
      currentThanhPhan._css.responsive = draggedThanhPhanResponsive;
    }
  }
}

export interface IEventSaveCreateManualForm {
  dsThanhPhan: IThanhPhan[];
  jobFieldFromDsThanhPhan: IThanhPhan[];
}
