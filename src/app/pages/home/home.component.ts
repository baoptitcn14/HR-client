import { Component, inject, OnInit } from '@angular/core';
import { ISearchFilter, SectionSearchComponent } from '../../layout/section-search/section-search.component';
import { DsViecLamComponent, IPageEvent } from '../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { ICriteriaRequestDto, JobPostInfoServiceProxy, JobPostOutputDto, JobPostQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { CommonModule } from '@angular/common';
import { IDsViecLam } from '../../shared/components/viec-lam/viec-lam.component';
import { DsViecLamService } from '../../shared/components/ds-viec-lam/ds-viec-lam.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SectionSearchComponent, DsViecLamComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DsViecLamService]
})
export class HomeComponent implements OnInit {
  jobPosts: IDsViecLam[] = [];
  // region inject
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);
  dsViecLamService = inject(DsViecLamService);

  // declare data
  controlPaginator = {
    first: 0,
    rows: 9,
    totalRecords: 0,
    showPaginator: true,
  }

  ngOnInit(): void {
    this.getJobPosts();
  }

  //#region Xử lý các sự kiện user tương tác

  onSearch(filter: ISearchFilter) {
    this.getJobPosts(filter);
  }

  onPageChange(event: IPageEvent) {
    this.controlPaginator.first = event.first;
    this.controlPaginator.rows = event.rows;
    this.getJobPosts();
  }

  // endregion

  //get data
  private getJobPosts(filter?: ISearchFilter) {

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

    this.dsViecLamService.getJobPosts(this.controlPaginator, filter).subscribe((res) => {
      this.jobPosts = res.items as IDsViecLam[];

      this.controlPaginator.totalRecords = res.totalCount!;

    });
  }
}
