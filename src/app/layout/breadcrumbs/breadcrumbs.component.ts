import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs = signal<MenuItem[]>([]);

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: MenuItem[] = [
          { routerLink: '/', label: 'Home', icon: 'pi pi-home me-2' },
        ];
        this.addBreadcrumb(root, [], breadcrumbs);

        // Emit the new hierarchy
        this.breadcrumbs.set(breadcrumbs);
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
