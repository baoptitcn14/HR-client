import { Injectable } from '@angular/core';
import { NavigationEnd, ActivatedRouteSnapshot, Data, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  breadcrumbs = new BehaviorSubject<MenuItem[]>([]);

  constructor() { }

  subcribeRouter(router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Construct the breadcrumb hierarchy
        const root = router.routerState.snapshot.root;

        const breadcrumbs: MenuItem[] = [
          { routerLink: '/', label: 'Trang chủ', icon: 'pi pi-home me-2' },
        ];

        this.addBreadcrumb(root, [], breadcrumbs);

        // Emit the new hierarchy
        this.breadcrumbs.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: MenuItem[]
  ) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      // Add an element for the current route part

      if (route.data['breadcrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          routerLink: '/' + routeUrl.join('/'),
        };
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild!, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function'
      ? data['breadcrumb']()
      : data['breadcrumb'];
  }
}
