import { Component, inject, OnInit } from '@angular/core';
import { SectionSearchComponent } from '../../layout/section-search/section-search.component';
import { DsViecLamComponent, IDsViecLam } from '../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { ICriteriaRequestDto, JobPostInfoServiceProxy, JobPostOutputDto, JobPostQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SectionSearchComponent, DsViecLamComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  jobPosts: IDsViecLam[] = [];
  // region inject
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);

  // declare data

  ngOnInit(): void {
    this.getJobPosts();
  }

  //#region Xử lý các sự kiện user tương tác

  onSearch(filter: any) {
    this.getJobPosts(filter);
  }

  // endregion

  //get data
  private getJobPosts(filter?: any) {

    const input = new JobPostQueryDto();
    input.skipCount = 0;
    input.maxResultCount = 100;

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

      if (filter.hinhThucLamViec && filter.hinhThucLamViec.length > 0) {
        filterString.push(
          new ICriteriaRequestDto({
            propertyName: 'typeJobPost',
            operation: 6,
            value: JSON.stringify(filter.hinhThucLamViec),
          })
        );
      }

      if (filterString.length > 0) {
        input.criterias.push(
          new ICriteriaRequestDto({
            propertyName: 'filter',
            operation: 9,
            value: JSON.stringify(filterString),
          })
        )
      }
    }

    this.jobPostInfoServiceProxy.getAll(input).subscribe((res) => {
      this.jobPosts = res.items as IDsViecLam[];
    });
  }
}
