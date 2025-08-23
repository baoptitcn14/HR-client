import { Component, inject, OnInit } from '@angular/core';
import { SectionSearchComponent } from '../../layout/section-search/section-search.component';
import { DsViecLamComponent, IDsViecLam } from '../../shared/components/ds-viec-lam/ds-viec-lam.component';
import { JobPostInfoServiceProxy, JobPostOutputDto, JobPostQueryDto } from '../../shared/service-proxies/sys-service-proxies';
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


  //get data
  private getJobPosts() {

    const input = new JobPostQueryDto();
    input.skipCount = 0;
    input.maxResultCount = 100;

    this.jobPostInfoServiceProxy.getAll(input).subscribe((res) => {
      this.jobPosts = res.items as IDsViecLam[];
    });
  }
}
