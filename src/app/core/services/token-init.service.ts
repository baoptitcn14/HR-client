import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppConst } from '../../shared/app-const';

@Injectable({
  providedIn: 'root'
})
export class TokenInitService {
  private cookieSerivce = inject(CookieService);


  init() {
    return new Promise<boolean>((resolve, reject) => {
      const url = window.location.href;
      const fragments = url.split('#')[1];
      const queryString = url.split('#')[0].split('?')[1];

      const searchParams = new URLSearchParams(queryString);

      const params: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (!fragments || !params || params['action'] != 'setToken') {

        resolve(false);

      } else {
        const accessToken = fragments;
        const tenantId = params['tenantId'];
        const active = params['active'];
        const userId = params['userId'];
        const expireInSeconds = parseInt(params['expireTime']) ?? -1;

        var tokenExpireDate = new Date();
        if (expireInSeconds > -1) tokenExpireDate.setSeconds(expireInSeconds);

        this.cookieSerivce.set(
          AppConst.authorization.authToken,
          accessToken,
          tokenExpireDate,
          '/',
          AppConst.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.userId,
          userId,
          tokenExpireDate,
          '/',
          AppConst.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.active,
          active,
          tokenExpireDate,
          '/',
          AppConst.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.tenantId,
          tenantId,
          tokenExpireDate,
          '/',
          AppConst.domain
        );

        resolve(true);
      }

    })

  }

}
