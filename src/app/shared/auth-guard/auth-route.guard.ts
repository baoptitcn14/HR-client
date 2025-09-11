import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppSessionService } from '../session/app-session.service';
import { AppConst } from '../app-const';

export const authRouteGuard: CanActivateFn = (route, state) => {
  const appSession = inject(AppSessionService);
  if (!appSession.user) {
    location.href = AppConst.loginUrl;
    return false;
  }

  return true;
};
