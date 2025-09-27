import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CategoriesService } from '../../../core/services/categories.service';
import { IDsViecLam, ViecLamComponent } from '../viec-lam/viec-lam.component';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-ds-viec-lam',
  standalone: true,
  imports: [
    CommonModule,
    ViecLamComponent,
    SkeletonModule,
    DividerModule,
    PaginatorModule
  ],
  templateUrl: './ds-viec-lam.component.html',
  styleUrl: './ds-viec-lam.component.scss',
})
export class DsViecLamComponent implements OnChanges {


  // inject region
  private categoriesService = inject(CategoriesService);

  // input region
  @Input() viecLams: IDsViecLam[] = [];
  @Input() layout: 'grid' | 'list' = 'grid';
  @Input() multiplierFS = 1;
  @Input() showButtonApply = false;
  @Input() first: number = 0;
  @Input() rows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() showPaginator: boolean = false;

  // output region
  @Output() onPageChangeEvent = new EventEmitter<IPageEvent>();

  // declare region
  isLoading = true;
  listPlaceHolder: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viecLams'])
      this.loadData();
  }

  async loadData() {

    this.listPlaceHolder = Array.from({ length: this.rows }, (_, index) => index)

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

    setTimeout(() => {
      this.isLoading = false;
    }, 300)
  }

  onPageChange(event: any) {
    this.isLoading = true;
    this.onPageChangeEvent.emit(event);
  }
}

export interface IPageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
