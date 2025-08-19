import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';
import { AppConst } from '../../shared/app-const';

@Injectable({
  providedIn: 'root'
})
export class TokenInitService {
  private cookieSerivce = inject(CookieService);


  init() {
    return new Promise<void>((resolve, reject) => {
      const url = window.location.href;
      const fragments = url.split('#')[1];
      const queryString = url.split('#')[0].split('?')[1];

      const searchParams = new URLSearchParams(queryString);

      const params: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // if (!fragments || !params || params['action'] != 'setToken') {

      //   window.location.href = environment.loginUrl;

      // } else {
        const accessToken = '2ET6BkI3pO4jWUHrBEhPcJBOnoZ5vysVcUD6crLRujODCEpd1rNR9SYlkX/fivcCc/9KK3/MmmciLBHI1UP9yWvhPg6V0Hj8WFxmHg1I/FaFQpOcn/nUUK7RCoXro2tY6bXODeiyWXZVl+Vty6bL+Xwo1BLhBLBDLLSVoqS6pAh826K9JP6u8pMyyomdTnE9EA8p91eepZOMBNXlqArN9mj5DYyIIjoBY1iDjJ4wu4s9jQQ2VDfd9qjA9jtu9Aw51fjJBfL1la+NQk8Y53dQSZFYtWc/bOkeI6oBbbb1oNJb1HBLpVX5lSj8ompBTr2+Z4D1ilVsNgXaQzFgG/O1LmHo010+eTOHROi/UM2IZvsnqrME5cxLNge+Q4zKZgFDkCbDsB6HX0K3o4Na31Y92umDZYRpEMzE54/R1P2lgSyrA9vTrd5XfMYPrDF+LQG1zvo004bNAoV9NCeo7Y8iy8Ksd5kHHBbdFv6SlTchB5FJRgrZgVS0hKfEKvUJ4pk15Ci9GRoEiaezvUyd1HDEwzjbhaoKjDd6prhidD6UA04fsVbQOeI11IYVxtBoCAum1TLP0msNDgrC39ndCzQ5Y2XetPdLi5LXSz32eDhf0NsYnfXHplBSBhe0xXwMGDF96Dasw8VL25K7obq28icmbIx5r5OJ57gvLviEzpHVCIxqIbLRdONvLugQSlcBTNGApxYis4rK/5FGv0/5iQrB9WrtrYEbYE0Zu/t9d2d6j7mBKeho8lvfz7Hq4jL4LoIqTWsrQde2SXi0z6eDEYtNggh0tO8cyJ5POxj9bVydHFIn9aVd/jrngWOIiVi7BHhVpxA1FRqvpbauso0wYhAfMtR44Am23teiZjdWF6lPus/Q9Z1EIPZ0f6gRM+IDEfXbyHEmnIMIwqBr47fqBlVEOfYCc8DRl4PfWz3e5339096buLZQsnLk+dj0Z61cE4KVGEYeHLRy4ZvwOnlx+UR1NVpmFhT3I+h6BM45eT4De9zUeDazMSm74I6ErHRcMYxl';
        const tenantId = '1'; //params['tenantId'];
        const active = 'false'; //params['active'];
        const userId = 'cc2e7df1-54f0-4f88-b0f6-81c0c630c517'; //params['userId'];
        const expireInSeconds = 86400;// parseInt(params['expireTime']) ?? -1;

        var tokenExpireDate = new Date();
        if (expireInSeconds > -1) tokenExpireDate.setSeconds(expireInSeconds);

        this.cookieSerivce.set(
          AppConst.authorization.authToken,
          accessToken,
          tokenExpireDate,
          '/',
          environment.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.userId,
          userId,
          tokenExpireDate,
          '/',
          environment.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.active,
          active,
          tokenExpireDate,
          '/',
          environment.domain
        );

        this.cookieSerivce.set(
          AppConst.authorization.tenantId,
          tenantId,
          tokenExpireDate,
          '/',
          environment.domain
        );

        resolve();
      // }

    })

  }

}
