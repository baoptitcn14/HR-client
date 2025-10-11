import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ICriteriaRequestDto, InterestInputDto, InterestServiceProxy, UserJobSettingInfoServiceProxy, UserJobSettingOutputDto, UserJobSettingQueryDto, UserProfileInfoServiceProxy, UserProfileOutputDto, UserProfileQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { AppTenantService } from '../../shared/session/app-tenant.service';
import { AppConst } from '../../shared/app-const';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppSessionService } from '../../shared/session/app-session.service';
import { AvatarModule } from 'primeng/avatar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CropImageComponent } from '../../shared/components/crop-image/crop-image.component';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    DialogModule,
    CropImageComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  // inject region
  userProfileInfoService = inject(UserProfileInfoServiceProxy);
  userJobSettingInfoService = inject(UserJobSettingInfoServiceProxy);
  interestService = inject(InterestServiceProxy);
  tenantService = inject(AppTenantService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  appSessionService = inject(AppSessionService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);

  // declare region
  userProfile?: UserProfileOutputDto;
  userJobSetting?: UserJobSettingOutputDto & IUserJobSetting;
  TYPE_VIEW_CODE = TYPE_VIEW_CODE;
  showDialogUploadImage = false;

  // data on router
  userIdOnRouter: string = '';
  typeView: string = '';


  ngOnInit(): void {
    this.init();
  }

  private init() {
    // get data from router
    this.typeView = this.activatedRoute.snapshot.queryParams['type'] ?? '';
    this.userIdOnRouter = this.activatedRoute.snapshot.params['id'] ?? '';

    if (this.userIdOnRouter && this.typeView == TYPE_VIEW_CODE.USER) {
      this.loadData();
    }
  }

  private loadData() {
    forkJoin([
      this.getUserProfileInfo(), this.getUserJobSettingInfo()
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([
      userProfile, userJobSetting
    ]) => {
      // if (userProfile.id)
      //   this.userProfile = userProfile;

      if (userProfile.items && userProfile.items.length > 0)
        this.userProfile = userProfile.items[0];

      if (userJobSetting.items && userJobSetting.items.length > 0)
        this.userJobSetting = {
          ...userJobSetting.items[0],
          _listIndustryDisplay: userJobSetting.items[0].listIndustry
            ? JSON.parse(userJobSetting.items[0].listIndustry).join(', ')
            : '',
          _listLocationDisplay: userJobSetting.items[0].listLocation
            ? JSON.parse(userJobSetting.items[0].listLocation).join(', ')
            : '',
          _workingTypeDisplay: userJobSetting.items[0].workingType
            ? JSON.parse(userJobSetting.items[0].workingType).join(', ')
            : '',
          _listTitleDisplay: userJobSetting.items[0].listTitle
            ? JSON.parse(userJobSetting.items[0].listTitle).join(', ')
            : ''
        } as any;
    });
  }

  //#region Xử lý các tương tác
  onOpenEditDialog() {
    let dialogRef = null;

    if (this.typeView == TYPE_VIEW_CODE.COMPANY) {

    } else {
      dialogRef = this.dialogService.open(UserProfileDialogComponent, {
        header: 'Thay đổi cài đặt cơ bản',
        width: '50vw',
        breakpoints: {
          '1024px': '50vw',
          '960px': '75vw',
          '768px': '95vw',
          '640px': '100vw',
        },
        styleClass: 'user-profile-dialog p-dialog-custom',
        data: {
          typeView: this.typeView,
          userJobSetting: this.userJobSetting,
          userProfile: this.userProfile
        },
      });
    }

    dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res)
        this.loadData();
    })
  }

  onApply() {

  }

  onInvite() {

  }

  onSaveImage(event: any) {

  }

  onOpenEditAvatarDialog() {
    this.showDialogUploadImage = true;
  }

  onFollow() {
    const input = new InterestInputDto();
    input.fromUserId = this.appSessionService.userId;
    input.entityId = this.userIdOnRouter;

    input.typeFromUser = '';
    input.typeEntity = '';
    input.typeInterest = '';

    return console.log(input);

    this.interestService.create(input).subscribe((res) => {

      this.messageService.add({ severity: 'success', detail: 'Đã theo dõi ' + this.userProfile?.surname, life: 3000 });

    });
  }

  //#endregion


  //#region get data

  private getUserProfileInfo() {

    const input = new UserProfileQueryDto();

    // input.id = this.userIdOnRouter;
    input.tenantId = this.tenantService.currentTenant?.id ?? AppConst.tenantDefaultId;
    input.criterias = [new ICriteriaRequestDto(
      { propertyName: 'userId', operation: 0, value: this.userIdOnRouter })
    ];

    return this.userProfileInfoService.getAll(input);

  }

  private getUserJobSettingInfo() {

    const input = new UserJobSettingQueryDto();
    // input.userId = this.appSessionService.userId;
    input.tenantId = this.tenantService.currentTenant?.id ?? AppConst.tenantDefaultId;
    input.criterias = [new ICriteriaRequestDto(
      { propertyName: 'userId', operation: 0, value: this.userIdOnRouter })
    ];

    return this.userJobSettingInfoService.getAll(input);
  }

  //#endregion
}

export const TYPE_VIEW_CODE = {
  COMPANY: 'company',
  USER: 'user'
}

export interface IUserJobSetting {
  _listIndustryDisplay: string;
  _listLocationDisplay: string;
  _workingTypeDisplay: string;
  _listTitleDisplay: string;
}