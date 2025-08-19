import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
// import { LoadingService } from '../services/loading.service';
import { AppConst } from '../../shared/app-const';

@Injectable()
export class MHttpInterceptor implements HttpInterceptor {
  // resExclude = RegExp('');

  constructor(
    private cookieService: CookieService,
    // private loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service.
    const authToken = this.cookieService.get(AppConst.authorization.authToken);
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.

    const headers = request.headers;

    const authReq = request.clone({
      headers: headers.set('Authorization', 'Bearer ' + authToken),
    });

    // return next.handle(authReq);

    if (authReq.headers.has('ignoreLoadingBar')) {
      return next.handle(
        authReq.clone({ headers: authReq.headers.delete('ignoreLoadingBar') })
      );
    }

    const r = next.handle(authReq);

    // let started = !this.resExclude.test(request.url);

    const responseSubscribe = r.subscribe.bind(r);

    r.subscribe = (...args: any[]) => {
      // this.loadingService.start();

      return responseSubscribe(...args);
    };

    return r.pipe(finalize(() => {
      // this.loadingService.complete()
    }));
  }
}
