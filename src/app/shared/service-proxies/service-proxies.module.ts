import { NgModule } from '@angular/core';
import {
  CategoryInfoServiceProxy,
  CategoryServiceProxy,
  CurrentUserServiceProxy,
  JobApplicationInfoServiceProxy,
  JobApplicationServiceProxy,
  JobFieldServiceProxy,
  JobPostFieldInfoServiceProxy,
  JobPostFieldServiceProxy,
  JobPostInfoServiceProxy,
  JobPostServiceProxy,
  MenuInfoServiceProxy,
  PostServiceProxy,
  SettingInfoServiceProxy,
  TenantServiceProxy,
  TokenAuthServiceProxy,
  UserCVServiceProxy,
} from './sys-service-proxies';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    //api sys
    MenuInfoServiceProxy,
    SettingInfoServiceProxy,
    CurrentUserServiceProxy,
    TokenAuthServiceProxy,
    TenantServiceProxy,
    CategoryInfoServiceProxy,
    CategoryServiceProxy,
    JobFieldServiceProxy,
    PostServiceProxy,
    JobPostFieldServiceProxy,
    JobPostServiceProxy,
    JobPostInfoServiceProxy,
    JobApplicationInfoServiceProxy,
    JobApplicationServiceProxy,
    JobPostFieldInfoServiceProxy,
    UserCVServiceProxy
  ],
})
export class ServiceProxiesModule {}
