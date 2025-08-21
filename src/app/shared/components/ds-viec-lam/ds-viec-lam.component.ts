import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
  CategoryInfoServiceProxy,
  CategoryOutputDto,
  CategoryQueryDto,
  ICriteriaRequestDto,
  JobPostOutputDto,
} from '../../service-proxies/sys-service-proxies';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ds-viec-lam',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TagModule,
    DividerModule,
    SkeletonModule,
    RouterModule,
  ],
  templateUrl: './ds-viec-lam.component.html',
  styleUrl: './ds-viec-lam.component.scss',
})
export class DsViecLamComponent implements OnInit {
  // inject region
  private categoryInfoService = inject(CategoryInfoServiceProxy);

  //state loading
  isLoading = true;

  // declare region
  @Input() viecLams: IDsViecLam[] = [];

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    forkJoin([this.getLocations(), this.getTrinhDos()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([khuVucs, trinhDos]) => {
        this.viecLams.forEach((viecLam) => {
          if (viecLam.jobLevel)
            viecLam._kyNangsOpenJson = trinhDos.filter((trinhDo) =>
              viecLam.jobLevel!.includes(trinhDo.id!)
            );

          viecLam._khuVucName =
            khuVucs.find((khuVuc) => khuVuc.id == viecLam.location)?.name || '';

          viecLam._tagsOpenJson = viecLam.tags ? JSON.parse(viecLam.tags) : [];

          this.isLoading = false;
        });
      });
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

  private getTrinhDos() {
    const input = new CategoryQueryDto();

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'groupCode',
        operation: 0,
        value: 'SKILL-LEVEL',
      }),
    ];

    input.sorting = 'hashCode asc';

    return this.categoryInfoService.getList(input);
  }
}

export interface IDsViecLam extends JobPostOutputDto {
  _kyNangsOpenJson: CategoryOutputDto[];
  _khuVucName: string;
  _tagsOpenJson: string[];
  _benefitsOpenJson: CategoryOutputDto[];
  _quyenLoisOpenJson: CategoryOutputDto[];
}
