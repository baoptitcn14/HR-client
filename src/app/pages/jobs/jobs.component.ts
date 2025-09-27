import { CommonModule } from '@angular/common';
import { Component, Host, HostListener, inject, OnInit } from '@angular/core';
import { DsViecLamComponent, IPageEvent } from '../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { AdvancedFilterComponent } from '../../layout/advanced-filter/advanced-filter.component';
import { IDsViecLam } from '../../shared/components/viec-lam/viec-lam.component';
import { JobPostInfoServiceProxy, JobPostQueryDto, ICriteriaRequestDto } from '../../shared/service-proxies/sys-service-proxies';
import { SectionSearchComponent } from '../../layout/section-search/section-search.component';
import { TrackElementInViewportDirective } from '../../core/directives/track-element-in-viewport.directive';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    SectionSearchComponent,
    DsViecLamComponent,
    AdvancedFilterComponent,
    TrackElementInViewportDirective,
    ButtonModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit {
  // region inject
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);
  jobPosts: IDsViecLam[] = [];
  isInViewport = true;

  // declare data
  controlPaginator = {
    first: 0,
    rows: 5,
    totalRecords: 0,
    showPaginator: true,
  }


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
    this.getJobPosts();
  }


  inViewportChange(isInViewport: any) {
    this.isInViewport = isInViewport;
  }

  //#region Xử lý các sự kiện user tương tác

  onSearch(filter: any) {
    this.getJobPosts(filter);
  }

  onNextPage() {
    this.controlPaginator.first += this.controlPaginator.rows;
    this.getJobPosts();
  }

  onPriviousPage() {
    this.controlPaginator.first -= this.controlPaginator.rows;
    this.getJobPosts();
  }

  onPageChange(event: IPageEvent) {
    this.controlPaginator.first = event.first;
    this.controlPaginator.rows = event.rows;
    this.getJobPosts();
  }

  // endregion

  //get data
  private getJobPosts(filter?: any) {

    const input = new JobPostQueryDto();
    input.skipCount = this.controlPaginator.first;
    input.maxResultCount = this.controlPaginator.rows;

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'jobStatus',
        operation: 0,
        value: 'DEFAULT',
      })
    ];

    if (filter) {
      let filterString = [] as ICriteriaRequestDto[];

      if (filter.khuVuc) {
        filterString.push(
          new ICriteriaRequestDto({
            propertyName: 'location',
            operation: 0,
            value: filter.khuVuc,
          })
        );
      }

      if (filter.kyNang && filter.kyNang.length > 0) {
        filterString.push(
          new ICriteriaRequestDto({
            propertyName: 'jobLevel',
            operation: 6,
            value: JSON.stringify(filter.kyNang),
          })
        );
      }

      // if (filter.hinhThucLamViec && filter.hinhThucLamViec.length > 0) {
      //   filterString.push(
      //     new ICriteriaRequestDto({
      //       propertyName: 'typeJobPost',
      //       operation: 6,
      //       value: JSON.stringify(filter.hinhThucLamViec),
      //     })
      //   );
      // }

      if (filterString.length > 0) {
        input.criterias.push(
          new ICriteriaRequestDto({
            propertyName: 'title',
            operation: 9,
            value: JSON.stringify(filterString),
          })
        )
      }
    }

    this.jobPostInfoServiceProxy.getAll(input).subscribe((res) => {
      this.jobPosts = res.items as IDsViecLam[];

      this.controlPaginator.totalRecords = res.totalCount!;
    });
  }
}
