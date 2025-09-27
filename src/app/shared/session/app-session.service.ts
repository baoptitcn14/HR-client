import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppConst } from '../app-const';
import {
  CurrentUserServiceProxy,
  LogoutDto,
  UserDto,
  ViewDto,
} from '../service-proxies/sys-service-proxies';

@Injectable({
  providedIn: 'root',
})
export class AppSessionService {
  user: UserDto | null = null;
  currentUserService = inject(CurrentUserServiceProxy);
  cookieService = inject(CookieService);

  get userId() {
    return this.user?.id;
  }

  init() {
    return new Promise<boolean>((resolve, reject) => {
      const token = this.cookieService.get(AppConst.authorization.authToken);
      const userId = this.cookieService.get(AppConst.authorization.userId);
      const active = this.cookieService.get(AppConst.authorization.active);

      if (token && userId) {
        const input = new ViewDto();
        input.useCache = active === 'true';
        input.id = userId;

        this.currentUserService.getUser(input).subscribe(
          (res) => {
            this.user = res;
            resolve(true);
          },
          (error) => {
            this.cookieService.deleteAll('/', AppConst.domain);
            location.href = AppConst.loginUrl;

            reject(error);
          }
        );
      } else {
        // window.location.href = AppConst.loginUrl;
        this.cookieService.deleteAll('/', AppConst.domain);
        resolve(false);
      }
    });
  }

  logout() {

    const input = new LogoutDto();
    input.clientAccessToken = this.cookieService.get(AppConst.authorization.authToken);
    input.connectionId = undefined;

    this.currentUserService.logout(input).subscribe(r => {
      this.cookieService.deleteAll('/', AppConst.domain);
      // location.href = AppConst.loginUrl;
      location.reload();
    });

  }
}
