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
  IThanhPhan,
  UngTuyenDialogComponent,
} from './ung-tuyen-dialog/ung-tuyen-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AppConst } from '../../shared/app-const';
import { TrackElementInViewportDirective } from '../../core/directives/track-element-in-viewport.directive';
import { CategoriesService } from '../../core/services/categories.service';
import { IDsViecLam } from '../../shared/components/viec-lam/viec-lam.component';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsService } from '../../layout/breadcrumbs/breadcrumbs.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-viec-lam',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePipe, TagModule, TrackElementInViewportDirective, TranslatePipe],
  templateUrl: './page-viec-lam.component.html',
  styleUrl: './page-viec-lam.component.scss',
})
export class PageViecLamComponent implements OnInit {
  //inject region
  private activatedRoute = inject(ActivatedRoute);
  private jobPostInfoService = inject(JobPostInfoServiceProxy);
  private dialogService = inject(DialogService);
  private jobPostFieldService = inject(JobPostFieldInfoServiceProxy);
  private categoriesService = inject(CategoriesService);
  private title = inject(Title);
  private destroyRef = inject(DestroyRef);
  private breadcrumbsService = inject(BreadcrumbsService);
  private translateService = inject(TranslateService);

  //declare region
  tinTuyenDung?: IDsViecLam;
  isButtonApplyOutOfViewport = false; // biến này theo dõi nút Ứng tuyển có ngoài viewport hay không


  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['slugId']) {

      // Tách slug & id
      const id = this.activatedRoute.snapshot.params['slugId'].split('_').pop();


      forkJoin([this.getViecLam(id)])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([viecLam]) => {
          this.tinTuyenDung = viecLam as IDsViecLam;

          this.title.setTitle(this.tinTuyenDung.title!);

          this.breadcrumbsService.breadcrumbs.next([
            ...this.breadcrumbsService.breadcrumbs.value,
            { label: this.tinTuyenDung.title!, routerLink: '/jobs/job/' + this.tinTuyenDung.id, disabled: true, },
          ])

          this.xuLyDuLieuViecLam();

          this.subscribeLangChange();

        });
    }
  }

  private subscribeLangChange() {
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.breadcrumbsService.breadcrumbs.next([
          { label: this.translateService.instant('common.breadcrumb.home'), routerLink: '/' },
          { label: this.translateService.instant('common.breadcrumb.job'), routerLink: '/jobs' },
          { label: this.tinTuyenDung!.title!, routerLink: '/jobs/job/' + this.tinTuyenDung!.id, disabled: true, },
        ]);
      });
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
        this.tinTuyenDung!.benefits?.includes(trinhDo.id!)
      ),
    } as IDsViecLam;
  }

  private getViecLam(id: string) {
    const input = new JobPostQueryDto();
    input.id = id;
    input.tenantId = AppConst.tenantDefaultId;

    return this.jobPostInfoService.get(input);
  }
}
