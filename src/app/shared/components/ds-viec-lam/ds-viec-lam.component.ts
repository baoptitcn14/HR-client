import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { IDsViecLam, ViecLamComponent } from '../viec-lam/viec-lam.component';

@Component({
  selector: 'app-ds-viec-lam',
  standalone: true,
  imports: [
    CommonModule,
    ViecLamComponent
  ],
  templateUrl: './ds-viec-lam.component.html',
  styleUrl: './ds-viec-lam.component.scss',
})
export class DsViecLamComponent implements OnChanges {


  // inject region
  private categoriesService = inject(CategoriesService);

  // declare region
  @Input() viecLams: IDsViecLam[] = [];
  isLoading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viecLams'])
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

