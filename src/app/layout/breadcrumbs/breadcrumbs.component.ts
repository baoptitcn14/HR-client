import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { BreadcrumbsService } from './breadcrumbs.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {

  breadcrumbService = inject(BreadcrumbsService);
  

  breadcrumbs = signal<MenuItem[]>([]);


  constructor(private router: Router) { }
  ngOnInit(): void {

    this.breadcrumbService.subcribeRouter(this.router);

    this.breadcrumbService.breadcrumbs.subscribe((breadcrumbs) => {
      this.breadcrumbs.set(breadcrumbs);
    })
  }

}
