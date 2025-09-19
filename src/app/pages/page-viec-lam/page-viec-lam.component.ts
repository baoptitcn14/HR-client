import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CategoryInfoServiceProxy,
  CategoryOutputDto,
  CategoryQueryDto,
  ICriteriaRequestDto,
  JobPostFieldInfoServiceProxy,
  JobPostFieldQueryDto,
  JobPostFieldServiceProxy,
  JobPostInfoServiceProxy,
  JobPostQueryDto,
} from '../../shared/service-proxies/sys-service-proxies';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TagModule } from 'primeng/tag';
import {
  UngTuyenDialogComponent,
} from './ung-tuyen-dialog/ung-tuyen-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AppConst } from '../../shared/app-const';
import { TrackElementInViewportDirective } from '../../core/directives/track-element-in-viewport.directive';
import { CategoriesService } from '../../core/services/categories.service';
import { IDsViecLam } from '../../shared/components/viec-lam/viec-lam.component';
import { IThanhPhan } from '../../shared/components/create-manual-form/create-manual-form.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-viec-lam',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePipe, TagModule, TrackElementInViewportDirective],
  templateUrl: './page-viec-lam.component.html',
  styleUrl: './page-viec-lam.component.scss',
})
export class PageViecLamComponent implements OnInit {
  //inject region
  private activatedRoute = inject(ActivatedRoute);
  private jobPostInfoService = inject(JobPostInfoServiceProxy);
  private categoryInfoService = inject(CategoryInfoServiceProxy);
  private dialogService = inject(DialogService);
  private jobPostFieldService = inject(JobPostFieldInfoServiceProxy);
  private categoriesService = inject(CategoriesService);
  private title = inject(Title);

  //declare region
  tinTuyenDung?: IDsViecLam;
  isButtonApplyOutOfViewport = false; // biến này theo dõi nút Ứng tuyển có ngoài viewport hay không

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      forkJoin([this.getViecLam()])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([viecLam]) => {
          this.tinTuyenDung = viecLam as IDsViecLam;

          this.title.setTitle(this.tinTuyenDung.title!);

          this.xuLyDuLieuViecLam();
        });
    }
  }

  private getLocations() {
    const input = new CategoryQueryDto();

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'groupCode',
        operation: 0,
        value: 'ADDRESS',
      }),
    ];

    input.sorting = 'hashCode asc';

    return this.categoryInfoService.getList(input);
  }

  onInViewportChange(event: boolean) {
    this.isButtonApplyOutOfViewport = !event;
  }

  onApply() {
    if (this.tinTuyenDung != undefined) {
      this.getJobPostFields().subscribe((res) => {

        this.dialogService.open(UngTuyenDialogComponent, {
          header: 'Ứng tuyển ' + this.tinTuyenDung!.title,
          width: '70%',
          breakpoints: {
            '960px': '75vw',
            '640px': '100vw',
          },
          styleClass: 'ung-tuyen-dialog p-dialog-custom',
          data: {
            dsThanhPhan: res as IThanhPhan[],
            jobPostId: this.tinTuyenDung!.id,
          },
        });
      });
    }
  }

  // lấy các field của tin này
  private getJobPostFields() {
    const input = new JobPostFieldQueryDto();

    input.tenantId = AppConst.tenantDefaultId;

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'jobPostId',
        operation: 0,
        value: this.tinTuyenDung!.id + '',
      }),
    ];

    input.skipCount = 0;
    input.maxResultCount = 1000;

    return this.jobPostFieldService.getList(input);
  }

  private async xuLyDuLieuViecLam() {
    if (!this.tinTuyenDung) return;

    const khuVucs = await this.categoriesService.getDataCategory('ADDRESS', 1);
    const trinhDos = await this.categoriesService.getDataCategory('SKILL-LEVEL', 1);

    this.tinTuyenDung = {
      ...this.tinTuyenDung,
      _kyNangsOpenJson: trinhDos.filter((trinhDo) =>
        this.tinTuyenDung!.jobLevel!.includes(trinhDo.id!)
      ),
      _khuVucName:
        khuVucs.find((khuVuc) => khuVuc.id == this.tinTuyenDung!.location)
          ?.name || '',
      _tagsOpenJson: this.tinTuyenDung.tags
        ? JSON.parse(this.tinTuyenDung.tags)
        : [],
      _benefitsOpenJson: trinhDos.filter((trinhDo) =>
        this.tinTuyenDung!.benefits!.includes(trinhDo.id!)
      ),
    } as IDsViecLam;
  }

  private getViecLam() {
    const input = new JobPostQueryDto();
    input.id = this.activatedRoute.snapshot.params['id'];
    input.tenantId = AppConst.tenantDefaultId;

    return this.jobPostInfoService.get(input);
  }
}
