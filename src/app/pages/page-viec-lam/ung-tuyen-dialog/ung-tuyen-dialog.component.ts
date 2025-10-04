import { Component, inject, OnInit } from '@angular/core';
import {
  JobApplicationFieldInputDto,
  JobApplicationInfoServiceProxy,
  JobApplicationInputDto,
  JobApplicationServiceProxy,
  JobFieldOutputDto,
} from '../../../shared/service-proxies/sys-service-proxies';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { AppConst } from '../../../shared/app-const';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogFooterDirective } from '../../../shared/directives/dialog-footer.directive';
import { DialogFooterComponent } from '../../../shared/dialog-partials/dialog-footer/dialog-footer.component';
import { MessageService } from 'primeng/api';
import { AppSessionService } from '../../../shared/session/app-session.service';
import { v4 as uuidv4 } from 'uuid';
import { CalendarModule } from 'primeng/calendar';
import { ICvInputConfig } from '../../../shared/components/cv-input/cv-input.component';

@Component({
  selector: 'app-ung-tuyen-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    EditorModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    ChipsModule,
    FileUploadModule,
    InputTextareaModule,
    DialogFooterDirective,
    DialogFooterComponent,
    ReactiveFormsModule,
    CalendarModule
  ],
  templateUrl: './ung-tuyen-dialog.component.html',
  styleUrl: './ung-tuyen-dialog.component.scss',
})
export class UngTuyenDialogComponent implements OnInit {
  // inject region
  private session = inject(AppSessionService);
  private jobApplicationServiceProxy = inject(JobApplicationServiceProxy);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  // declare region
  emailPattern = AppConst.emailPattern;
  thietBiHienThi = DEVICES;
  dsThanhPhan: IThanhPhan[] = [];
  dsThanhPhanDangCo: IThanhPhan[] = [];
  form: FormGroup = new FormGroup({});

  constructor(private config: DynamicDialogConfig) {
    this.dsThanhPhan = this.config.data.dsThanhPhan;
  }

  ngOnInit(): void {
    this.xuLyThanhPhan();
    this.initForm();
  }

  onSave() {
    const data = this.form.value;

    const input = new JobApplicationInputDto();
    input.tenantId = AppConst.tenantDefaultId;

    input.candidateUserId = this.session.userId ?? uuidv4();
    input.jobPostId = this.config.data.jobPostId;
    input.status = STATUS_UNGTUYEN.PENDING;
    input.jobApplicationFields = Array.from(
      Object.entries(data).map(([key, value]) =>
        JobApplicationFieldInputDto.fromJS({
          jobPostFieldId: key,
          value: value,
          jobPostId: this.config.data.jobPostId,
        })
      )
    );

    this.jobApplicationServiceProxy.create(input).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Ứng tuyển thành công',
        });

        this.ref.close(true);
      },
      (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Ứng tuyển thất bại',
        });
      }
    );
  }

  onClose() {
    this.ref.close();
  }

  private initForm() {
    this.dsThanhPhan.forEach((thanhPhan) => {
      if (thanhPhan.inputType != 'group') {
        const value = thanhPhan.inputType == 'tags' ? [] : null;
        let validators = [];

        if (thanhPhan.isRequired) {
          validators.push(Validators.required);
        }

        this.form.addControl(thanhPhan.id!, new FormControl(value, validators));
      }
    });
  }

  private xuLyThanhPhan() {
    if (this.dsThanhPhan.length > 0) {
      this.dsThanhPhanDangCo = this.dsThanhPhan
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
          } as IThanhPhan)
        )
        .sort((a, b) => parseInt(a.fieldIndex!) - parseInt(b.fieldIndex!));

      this.dsThanhPhanDangCo.forEach((thanhPhan) => {
        thanhPhan._listChild = this.dsThanhPhan
          .filter(
            (item) =>
              item.groupId == thanhPhan.htmlKey && item.inputType != 'group'
          )
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
            } as IThanhPhan)
          )
          .sort((a, b) => parseInt(a.fieldIndex!) - parseInt(b.fieldIndex!));
      });

      console.log(this.dsThanhPhanDangCo)
    }
  }
}

export interface ICss {
  responsive: {
    desktop: number;
    tablet: number;
    mobile: number;
    [key: string]: number; // key => mobile, tablet, desktop
  };
  label: {
    fontSize: number;
    color: string;
    icon: string;
    iconColor: string;
  };
  content: {
    fontSize: number;
    color: string;
    icon: string;
  };
  flex: 'flex-column' | 'flex-row';
  align: 'align-items-start' | 'align-items-center' | 'align-items-end';
  height: number;
  [key: string]: any;
}

export const STATUS_UNGTUYEN = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};

// ===========

export interface IThanhPhan extends JobFieldOutputDto {
  _index?: number;
  _listChild?: any[];
  _key?: string;
  _isSelected?: boolean;
  _css: ICss;
  _groupId?: string;
  _cssClass?: string;
  _listValueOptionOpenJSON?: string[];
  _listRelationOpenJSON?: string[];
  _value?: any;
  _panelSizes?: number[]; // panelSizes cua splitter dùng cho row
  _panelMinSizes?: number[]; // panelMinSizes cua splitter dùng cho row
  _listTypeCode?: { typeCode: string, label: string, layout: string }[]; // chứa typeCode của các group được thả vào col
  _hashMapTypeCode?: { [typeCode: string]: { [groupId: string]: any[] } }; // chứa các typeCode là duy nhất làm key và value là hashmap groupId -> listThanhPhan
  // isAllowDuplicate?: boolean;
  // placeholder?: string;
  // isSearch?: boolean; // dropdown
  // acceptFileExtensions?: string; // .jpg,.png,.pdf,.doc,.xlsx
  maxFileSize?: number;
  // multiple?: boolean;
  inputConfig?: ICvInputConfig;
  icon?: string;
  _isBlank?: boolean; // element này có giá trị hay không
  image?: string;

}

export const DEVICES = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
};

export const LIST_DEVICE = [
  {
    value: DEVICES.DESKTOP,
    icon: 'pi pi-desktop',
  },
  {
    value: DEVICES.TABLET,
    icon: 'pi pi-tablet',
  },
  {
    value: DEVICES.MOBILE,
    icon: 'pi pi-mobile',
  },
];