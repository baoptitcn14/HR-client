import { inject, Injectable } from '@angular/core';
import { JobPostQueryDto, ICriteriaRequestDto, JobPostInfoServiceProxy } from '../../service-proxies/sys-service-proxies';
import { IDsViecLam } from '../viec-lam/viec-lam.component';
import { IControlPaginator } from '../../../pages/jobs/list-job/list-job.component';
import { ISearchFilter } from '../../../layout/section-search/section-search.component';

@Injectable({
  providedIn: 'root'
})
export class DsViecLamService {
  jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);

  getJobPosts(controlPaginator: IControlPaginator, filter?: ISearchFilter) {

    const input = new JobPostQueryDto();
    input.skipCount = controlPaginator.first;
    input.maxResultCount = controlPaginator.rows;

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'jobStatus',
        operation: 0,
        value: 'DEFAULT',
      })
    ];

    if (filter) {
      let search = [];

      if (filter.searchText) {
        search.push(filter.searchText);
      }

      if (filter.khuVuc) {
        search.push(filter.khuVuc);
      }

      if (filter.kyNangs) {
        search = search.concat(filter.kyNangs);
      }

      if (filter.hinhThucLamViecs) {
        search = search.concat(filter.hinhThucLamViecs);
      }

      if (filter.kinhNghiem) {
        search.push(filter.kinhNghiem);
      }

      if (filter.capBac) {
        search.push(filter.capBac);
      }

      input.search = JSON.stringify(search);
    }

    return this.jobPostInfoServiceProxy.getAll(input);
  }
}
