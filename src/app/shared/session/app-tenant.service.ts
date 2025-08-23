import { inject, Injectable } from '@angular/core';
import { TenantDto, TenantServiceProxy, ViewDto } from '../service-proxies/sys-service-proxies';
import { CookieService } from 'ngx-cookie-service';
import { AppConst } from '../app-const';

@Injectable({
  providedIn: 'root'
})
export class AppTenantService {

  cookieService = inject(CookieService);
  tenantServiceProxy = inject(TenantServiceProxy);

  listTeantUser: TenantDto[] = [];

  get currentTenant() {
    return this.listTeantUser.find(x => x.isActive);
  }

  init() {
    return new Promise<void>((resolve, reject) => {

      const userId = this.cookieService.get(AppConst.authorization.userId);
      if (!userId) resolve();

      this.tenantServiceProxy.getList(new ViewDto({
        id: userId,
        useCache: true
      })).subscribe((res) => {
        this.listTeantUser = res;
        resolve();
      }, (error) => {
        this.cookieService.deleteAll('/', AppConst.domain);
        location.href = AppConst.loginUrl;
        reject(error);
      }, () => { })
    })
  }


  onChangeTenant(tenant: TenantDto) {
    // call api change tenant
    console.log('call api change tenant')
  }
}
