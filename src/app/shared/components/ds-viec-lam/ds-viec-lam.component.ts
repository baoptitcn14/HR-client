import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
  CategoryOutputDto,
  JobPostOutputDto,
} from '../../service-proxies/sys-service-proxies';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { NumberSuffixCurrencyPipe } from '../../../core/pipes/number-suffix-currency.pipe';

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
    NumberSuffixCurrencyPipe
  ],
  templateUrl: './ds-viec-lam.component.html',
  styleUrl: './ds-viec-lam.component.scss',
})
export class DsViecLamComponent implements OnInit {
  // inject region
  private categoriesService = inject(CategoriesService);

  //state loading
  isLoading = true;

  // declare region
  @Input() viecLams: IDsViecLam[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {

    const khuVucs = await this.categoriesService.getDataCategory('ADDRESS', 1);
    const trinhDos = await this.categoriesService.getDataCategory('SKILL-LEVEL', 1);

    this.viecLams.forEach((viecLam) => {
      if (viecLam.jobLevel)
        viecLam._kyNangsOpenJson = trinhDos.filter((trinhDo) =>
          viecLam.jobLevel!.includes(trinhDo.id!)
        );

      viecLam._khuVucName =
        khuVucs.find((khuVuc) => khuVuc.id == viecLam.location)?.name || '';

      viecLam._tagsOpenJson = viecLam.tags ? JSON.parse(viecLam.tags) : [];

    });

    this.isLoading = false;
  }
}

export interface IDsViecLam extends JobPostOutputDto {
  _kyNangsOpenJson: CategoryOutputDto[];
  _khuVucName: string;
  _tagsOpenJson: string[];
  _benefitsOpenJson: CategoryOutputDto[];
  _quyenLoisOpenJson: CategoryOutputDto[];
}
