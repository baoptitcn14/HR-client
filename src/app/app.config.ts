import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  Router,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { MHttpInterceptor } from './core/interceptor/m.http.interceptor';
import { ServiceProxiesModule } from './shared/service-proxies/service-proxies.module';
import { AppSessionService } from './shared/session/app-session.service';
import { API_SYS_URL } from './shared/service-proxies/sys-service-proxies';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LibServiceModule } from './shared/services/lib-service.module';
import { AppSettingsService } from './shared/session/app-settings.service';
import { AppTenantService } from './shared/session/app-tenant.service';
import { LoadingService } from './layout/loading/loading.component';
import { TokenInitService } from './core/services/token-init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([ServiceProxiesModule, LibServiceModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: appSesionInitializerFactory,
      multi: true,
      deps: [AppSessionService, AppSettingsService, AppTenantService, TokenInitService, LoadingService, Router],
    },
    { provide: HTTP_INTERCEPTORS, useClass: MHttpInterceptor, multi: true },
    { provide: API_SYS_URL, useValue: environment.sysAPI },
    MessageService,
  ],
};

export function appSesionInitializerFactory(
  appSessionService: AppSessionService,
  appSettingsService: AppSettingsService,
  appTenantService: AppTenantService,
  tokenInitService: TokenInitService,
  loadingService: LoadingService,
  router: Router
): () => Promise<void> {
  return async () => {
    loadingService.start();

    // let firstLogin = false;

    // let isLogin = await appSessionService.init();

    // if (!isLogin) {
    //   await tokenInitService.init();
    //   isLogin = await appSessionService.init();
    //   firstLogin = true;
    // }

    // if (isLogin) {
    //   //  lấy tenants của user đang đăng nhập
    //   await appTenantService.init();

    //   // lấy setting ban đầu cho app
    //   // appSettingsService.init();
    // }


    // if (firstLogin) router.navigate(['']);
    // else
    //   setTimeout(() => {
    //     router.navigate([router.url]);
    //   }, 100)

    setTimeout(() => {
      loadingService.complete();

    }, 1000)


  }
}

