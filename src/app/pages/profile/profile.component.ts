import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { HrCompanyInfoServiceProxy, HrCompanyOutputDto, HrCompanyQueryDto, HrCompanyServiceProxy, ICriteriaRequestDto, InterestInputDto, InterestOutputDto, InterestQueryDto, InterestServiceProxy, RegisterOrganizationUserDto, RegistrationServiceProxy, UserJobSettingInfoServiceProxy, UserJobSettingOutputDto, UserJobSettingQueryDto, UserProfileInfoServiceProxy, UserProfileInputDto, UserProfileOutputDto, UserProfileQueryDto, UserProfileServiceProxy, ViewDto } from '../../shared/service-proxies/sys-service-proxies';
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
import { forkJoin, map } from 'rxjs';
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
  userProfileService = inject(UserProfileServiceProxy);
  userJobSettingInfoService = inject(UserJobSettingInfoServiceProxy);
  hrCompanyService = inject(HrCompanyServiceProxy);
  hrCompanyInfoService = inject(HrCompanyInfoServiceProxy);
  interestService = inject(InterestServiceProxy);
  tenantService = inject(AppTenantService);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  appSessionService = inject(AppSessionService);
  destroyRef = inject(DestroyRef);
  messageService = inject(MessageService);
  registrationService = inject(RegistrationServiceProxy);

  // declare region
  userProfile?: UserProfileOutputDto;
  userJobSetting?: UserJobSettingOutputDto & IUserJobSetting;
  companyProfile?: HrCompanyOutputDto & { _listIndustryDisplay: '' };
  interest?: InterestOutputDto;
  TYPE_VIEW_CODE = TYPE_VIEW_CODE;

  // crop image
  showDialogUploadImage = false;
  dialogActionName: '' | 'avatar' | 'banner' = '';

  // data on router
  idOnRouter: string = '';
  typeView: string = '';

  //url avatar
  get urlAvatar() {
    return this.userProfile?.profilePicture && this.userProfile?.profilePicture != ""
      ? this.userProfile?.profilePicture
      : this.companyProfile?.logoUrl && this.companyProfile?.logoUrl != ""
        ? this.companyProfile?.logoUrl
        : AppConst.placehoderImage;
  }

  get urlBanner() {
    return this.userProfile?.bannerImage && this.userProfile?.bannerImage != "" ? this.userProfile?.bannerImage : AppConst.placehoderImage;
  };


  ngOnInit(): void {
    this.init();
  }

  private init() {
    // get data from router
    this.typeView = this.activatedRoute.snapshot.queryParams['type'] ?? '';
    this.idOnRouter = this.activatedRoute.snapshot.params['id'] ?? '';

    if (this.idOnRouter && this.typeView == TYPE_VIEW_CODE.USER) {
      this.loadDataUser();
    } else if (this.idOnRouter && this.typeView == TYPE_VIEW_CODE.COMPANY) {
      this.loadDataCompany();
    }
  }

  private loadDataUser() {
    forkJoin([
      this.getUserProfileInfo(), this.getUserJobSettingInfo(), this.getInterest()
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([
      userProfile, userJobSetting, interest
    ]) => {
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

      // interest
      if (interest && interest.length > 0)
        this.interest = interest[0];

    });
  }


  private loadDataCompany() {
    forkJoin([
      this.getCompanyProfile(), this.getInterest()
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([
      companyProfile, interest
    ]) => {
      if (companyProfile)
        this.companyProfile = companyProfile as any;

      // interest
      if (interest && interest.length > 0)
        this.interest = interest[0];

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
        this.loadDataUser();
    })
  }

  onApply() {

    const input = new RegisterOrganizationUserDto();
    input.organizationId = this.idOnRouter;
    input.tenantId = this.tenantService.currentTenant?.id;
    input.userId = this.appSessionService.userId;
    input.userName = this.appSessionService.user?.fullName;
    input.organizationCode = this.companyProfile?.code;

    this.registrationService.registerOrganizationUser(input).subscribe((res) => {
      this.messageService.add({ severity: 'success', detail: 'Đã gửi yêu cầu', life: 3000 });

      this.loadDataUser();

    })
  }

  onInvite() {
    //# Chưa có API này
  }

  onSaveImage(event: string) {

    const input = UserProfileInputDto.fromJS({
      ...this.userProfile,
      tenant: this.userProfile?.tenantId,
    });

    //#update avatar
    if (this.dialogActionName == 'avatar') input.profilePicture = event;
    //#update banner
    else if (this.dialogActionName == 'banner') input.bannerImage = event;

    this.userProfileService.update(input).subscribe((res) => {

      this.messageService.add({ severity: 'success', detail: 'Cập nhật thành công', life: 3000 });

      this.loadDataUser();
    });
  }

  onOpenEditAvatarDialog(actionName: 'avatar' | 'banner') {
    this.dialogActionName = actionName;
    this.showDialogUploadImage = true;

  }

  onFollow() {

    if (this.interest) {
      // unfollow

      const input = new ViewDto();
      input.id = this.interest.id;

      this.interestService.delete(input).subscribe((res) => {
        this.messageService.add({ severity: 'success', detail: 'Đã hủy theo dõi', life: 3000 });

        this.init();

      });


    } else {
      // follow
      const input = new InterestInputDto();
      input.fromUserId = this.appSessionService.userId;
      input.entityId = this.idOnRouter;
      input.typeFromUser = this.tenantService.currentTenant?.tenancyName;
      input.typeEntity =
        this.typeView == TYPE_VIEW_CODE.COMPANY
          ? TYPE_ENTITY.COMPANY
          : TYPE_ENTITY.USER;
      input.typeInterest = TYPE_INTEREST.FOLLOW;

      this.interestService.create(input).subscribe((res) => {
        this.messageService.add({ severity: 'success', detail: 'Đã theo dõi ' + this.userProfile?.surname, life: 3000 });

        this.init();
      });
    }

  }

  //#endregion


  //#region get data

  // kiểm tra user đã đăng ký chưa
  private getRegistrationByUser() {
    // this.registrationService.
    // # chưa biết API này
  }

  // get follow -> kiểm tra user đã follow company hay chưa và ngược lại
  private getInterest() {

    const input = new InterestQueryDto();

    const follower = this.typeView == TYPE_VIEW_CODE.COMPANY
      ? this.appSessionService.userId : this.idOnRouter;

    const entity = this.typeView == TYPE_VIEW_CODE.COMPANY
      ? this.idOnRouter : this.appSessionService.userId;

    input.criterias = [
      new ICriteriaRequestDto(
        { propertyName: 'fromUserId', operation: 0, value: follower + '' }
      ),
      new ICriteriaRequestDto(
        { propertyName: 'entityId', operation: 0, value: entity + '' }
      )
    ];

    return this.interestService.getAll(input).pipe(map((res) => res.items));
  }

  private getUserProfileInfo() {

    const input = new UserProfileQueryDto();

    // input.id = this.idOnRouter;
    input.tenantId = this.tenantService.currentTenant?.id ?? AppConst.tenantDefaultId;
    input.criterias = [new ICriteriaRequestDto(
      { propertyName: 'userId', operation: 0, value: this.idOnRouter })
    ];

    return this.userProfileInfoService.getAll(input);

  }

  private getUserJobSettingInfo() {

    const input = new UserJobSettingQueryDto();
    // input.userId = this.appSessionService.userId;
    input.tenantId = this.tenantService.currentTenant?.id ?? AppConst.tenantDefaultId;
    input.criterias = [new ICriteriaRequestDto(
      { propertyName: 'userId', operation: 0, value: this.idOnRouter })
    ];

    return this.userJobSettingInfoService.getAll(input);
  }

  private getCompanyProfile() {
    const input = new HrCompanyQueryDto();
    input.id = this.idOnRouter;
    input.tenantId = AppConst.tenantDefaultId;

    return this.hrCompanyInfoService.get(input);
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

export const TYPE_INTEREST = {
  VIEW: 'view',
  FOLLOW: 'follow'
}

export const TYPE_ENTITY = {
  COMPANY: 'hr.HrCompanies',
  CV: 'hr.UserCVs',
  USER: 'hr.UserProfiles',
  JOB: 'hr.JobPosts'
}
