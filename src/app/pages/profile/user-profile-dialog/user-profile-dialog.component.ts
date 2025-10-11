import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppSessionService } from '../../../shared/session/app-session.service';
import { DialogFooterDirective } from '../../../shared/directives/dialog-footer.directive';
import { DialogFooterComponent } from '../../../shared/dialog-partials/dialog-footer/dialog-footer.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MFilesComponent } from '../../../shared/components/m-files/m-files.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserProfileOutputDto, UserJobSettingOutputDto, UserProfileServiceProxy, UserJobSettingServiceProxy, UserJobSettingInputDto, UserProfileInputDto, CategoryOutputDto } from '../../../shared/service-proxies/sys-service-proxies';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { CategoriesService } from '../../../core/services/categories.service';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogFooterDirective,
    DialogFooterComponent,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    MFilesComponent,
    MultiSelectModule,
    ChipsModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule
  ],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss'
})
export class UserProfileDialogComponent implements OnInit {

  //inject region
  appSessionService = inject(AppSessionService);
  ref = inject(DynamicDialogRef);
  userProfileService = inject(UserProfileServiceProxy);
  userJobSettingService = inject(UserJobSettingServiceProxy);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  categoriesService = inject(CategoriesService);

  // declare form region
  userForm: FormGroup = new FormGroup({});
  userJobForm: FormGroup = new FormGroup({});
  userSettingForm: FormGroup = new FormGroup({});

  // declare variable region
  genderOptions = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nữ' },
    { label: 'Khác', value: 'Khác' },
  ];

  experienceOptions: CategoryOutputDto[] = [];
  industryOptions: CategoryOutputDto[] = [];

  // data region
  userJobSetting?: UserJobSettingOutputDto;
  userProfile?: UserProfileOutputDto;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig
  ) {
    this.initData();
  }

  ngOnInit(): void {
    this.initUserForm();
    this.initUserJobForm();
    this.initUserSettingForm();
  }

  private initData() {
    this.userProfile = this.dynamicDialogConfig.data.userProfile;
    this.userJobSetting = this.dynamicDialogConfig.data.userJobSetting;
    
    // get data category
    this.categoriesService.getDataCategory('EXPERIENCE', 1).then(x => this.experienceOptions = x);
    this.categoriesService.getDataCategory('INDUSTRY', 1).then(x => this.industryOptions = x);
  }

  //#region Xử lý các tương tác

  onSave() {

    forkJoin([
      this.userJobSettingService[this.userJobSetting?.id ? 'update' : 'create'](
        UserJobSettingInputDto.fromJS(
          {
            ...{
              ...this.userJobForm.value,
              gender: this.userForm.get('gender')?.value,
              listTitle: this.userJobForm.get('_listTitleOpenJson')?.value ? JSON.stringify(this.userJobForm.get('_listTitleOpenJson')?.value) : null,
              listIndustry: this.userJobForm.get('_listIndustryOpenJson')?.value ? JSON.stringify(this.userJobForm.get('_listIndustryOpenJson')?.value) : null,
              listLocation: this.userJobForm.get('_listLocationOpenJson')?.value ? JSON.stringify(this.userJobForm.get('_listLocationOpenJson')?.value) : null,
              workingType: this.userJobForm.get('_workingTypeOpenJson')?.value ? JSON.stringify(this.userJobForm.get('_workingTypeOpenJson')?.value) : null,
              age: (new Date()).getFullYear() - this.userForm.get('dob')?.value.getFullYear(),
              tenantId: this.userJobSetting!.tenantId
            },
            ...this.userSettingForm.value
          }
        )
      ),
      this.userProfileService[this.userProfile?.id ? 'update' : 'create'](
        UserProfileInputDto.fromJS({ ...this.userForm.value, tenantId: this.userProfile?.tenantId })
      )
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([userJobSetting, userProfile]) => {

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cập nhật thành công', life: 3000 });

    }, (e) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
    }, () => {
      this.ref.close('success');
    });

  }

  onClose() {
    this.ref.close();
  }

  //#endregion

  //#region init Form
  private initUserForm() {
    this.userForm = new FormGroup({
      id: new FormControl(undefined),
      surname: new FormControl(this.appSessionService.user?.surname + ' ' + this.appSessionService.user?.name, Validators.required),
      emailAddress: new FormControl('', Validators.required),
      phoneNumber: new FormControl(''),
      gender: new FormControl(''),
      dob: new FormControl('', Validators.required),
      location: new FormControl(''),
      description: new FormControl(''),
      userId: new FormControl(this.appSessionService.userId),
    });

    if (this.userProfile) {
      this.userForm.patchValue({
        ...this.userProfile,
        dob: this.userProfile.dob ? new Date(this.userProfile.dob) : null
      });
    }
  }

  private initUserJobForm() {
    this.userJobForm = new FormGroup({
      id: new FormControl(undefined),
      _listTitleOpenJson: new FormControl([]),
      _listIndustryOpenJson: new FormControl([]),
      jobLevel: new FormControl(''),
      // workingType: new FormControl(''),
      experience: new FormControl(''),
      // position: new FormControl(''),
      age: new FormControl(''),
      // gender: new FormControl(),
      workingHours: new FormControl(''),
      _workingTypeOpenJson: new FormControl([]),
      _listLocationOpenJson: new FormControl([]),
      salaryMin: new FormControl(5000000),
      salaryMax: new FormControl(10000000),
    });

    if (this.userJobSetting) {
      this.userJobForm.patchValue(
        {
          ...this.userJobSetting,
          _listTitleOpenJson: this.userJobSetting?.listTitle ? JSON.parse(this.userJobSetting?.listTitle) : [],
          _listIndustryOpenJson: this.userJobSetting?.listIndustry ? JSON.parse(this.userJobSetting?.listIndustry) : [],
          _listLocationOpenJson: this.userJobSetting?.listLocation ? JSON.parse(this.userJobSetting?.listLocation) : [],
          _workingTypeOpenJson: this.userJobSetting?.workingType ? JSON.parse(this.userJobSetting?.workingType) : [],
        }
      );
    }

  }

  private initUserSettingForm() {
    this.userSettingForm = new FormGroup({
      userId: new FormControl(this.appSessionService.userId),
      canChangeWorkplace: new FormControl(true),
      isLookingForJob: new FormControl(true),
      isSearchByEmployerAllowed: new FormControl(true),
      receiveSuggestions: new FormControl(true),
      allowContact: new FormControl(true),
      showEmail: new FormControl(true),
      showPhone: new FormControl(true),
    });

    if (this.userJobSetting) {
      this.userSettingForm.patchValue(this.userJobSetting);
    }
  }

  //#endregion

}
