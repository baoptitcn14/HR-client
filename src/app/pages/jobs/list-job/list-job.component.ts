import { CommonModule } from '@angular/common';
import { Component, Host, HostListener, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrackElementInViewportDirective } from '../../../core/directives/track-element-in-viewport.directive';
import { AdvancedFilterComponent } from '../../../layout/advanced-filter/advanced-filter.component';
import { ISearchFilter, SectionSearchComponent } from '../../../layout/section-search/section-search.component';
import { DsViecLamComponent, IPageEvent } from '../../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { IDsViecLam } from '../../../shared/components/viec-lam/viec-lam.component';
import { JobPostInfoServiceProxy, JobPostQueryDto, ICriteriaRequestDto } from '../../../shared/service-proxies/sys-service-proxies';
import { DsViecLamService } from '../../../shared/components/ds-viec-lam/ds-viec-lam.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-list-job',
  standalone: true,
  imports: [
    CommonModule,
    SectionSearchComponent,
    DsViecLamComponent,
    AdvancedFilterComponent,
    TrackElementInViewportDirective,
    ButtonModule,
    RouterModule,
    TagModule
  ],
  providers: [DsViecLamService],
  templateUrl: './list-job.component.html',
  styleUrl: './list-job.component.scss'
})
export class ListJobComponent implements OnInit {
  // region inject
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);
  activatedRoute = inject(ActivatedRoute);
  dsViecLamService = inject(DsViecLamService);

  route = inject(Router);

  // endregion

  // declare data
  controlPaginator: IControlPaginator = {
    first: 0,
    rows: 5,
    totalRecords: 0,
    showPaginator: true,
  }

  isInViewport = true;
  jobPosts: IDsViecLam[] = [];

  valueFilterOnRouter = '';

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {

    var advancedFilter = document.getElementById('js-advanced-filter');

    if (event.target.scrollingElement.scrollTop > 80) {
      advancedFilter?.classList.add('sticky');
    } else {
      advancedFilter?.classList.remove('sticky');
    }

  }

  ngOnInit(): void {
    this.getFilters();
    // this.getJobPosts();
  }

  inViewportChange(isInViewport: any) {
    this.isInViewport = isInViewport;
  }

  //#region get filters on router

  private getFilters() {

    this.activatedRoute.paramMap.subscribe((param) => {
      this.valueFilterOnRouter = param.get('filters')!;

      this.getJobPosts();
    })
  }

  //#endregion

  //#region Xử lý các sự kiện user tương tác

  onSearch(filter: any) {
    this.getJobPosts(filter);
  }

  onChangeFilter(filter: ISearchFilter) {
    this.getJobPosts(filter);
  }

  onNextPage() {
    this.controlPaginator.first += this.controlPaginator.rows;
    this.getJobPosts();
  }

  onPreviousPage() {
    this.controlPaginator.first -= this.controlPaginator.rows;
    this.getJobPosts();
  }

  onPageChange(event: IPageEvent) {
    this.controlPaginator.first = event.first;
    this.controlPaginator.rows = event.rows;
    this.getJobPosts();
  }

  removeFilter() {
    this.valueFilterOnRouter = '';

    //clear params on router
    this.route.navigate(['/jobs']);
  }

  // endregion

  //get data
  private getJobPosts(filter?: ISearchFilter) {

    if (!filter) filter = { hinhThucLamViecs: [] };

    if (this.valueFilterOnRouter) filter.hinhThucLamViecs!.push(this.valueFilterOnRouter);

    this.dsViecLamService.getJobPosts(this.controlPaginator, filter).subscribe(res => {
      this.jobPosts = res.items as IDsViecLam[];
      this.controlPaginator.totalRecords = res.totalCount!;
    })
  }
}

export interface IControlPaginator {
  first: number;
  rows: number;
  totalRecords: number;
  showPaginator: boolean;
}
