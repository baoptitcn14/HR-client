import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CategoriesService } from '../../core/services/categories.service';
import { CategoryOutputDto } from '../../shared/service-proxies/sys-service-proxies';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    DividerModule
  ],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent implements OnInit {

  // inject region
  private categoriesService = inject(CategoriesService);

  //declare region
  khuVucs: CategoryOutputDto[] = [];
  kyNangs: CategoryOutputDto[] = [];
  hinhThucLamViecs: CategoryOutputDto[] = [];
  mucLuongs: CategoryOutputDto[] = [];
  kinhNghiems: CategoryOutputDto[] = [];
  capBacs: CategoryOutputDto[] = [];

  //bộ filter
  filter: any = {
    khuVuc: 'ALL',
    kyNang: 'ALL',
    hinhThucLamViec: 'ALL',
    mucLuong: 'ALL',
    kinhNghiem: 'ALL',
    capBac: 'ALL',
  }


  ngOnInit(): void {

    this.loadData();
    this.setHeight();
  }

  private setHeight() {
    var advancedFilter = document.querySelector('.advanced-filter') as HTMLElement;
    var sectionSearch = document.querySelector('#search-section') as HTMLElement;
    var menu = document.querySelector('app-menu-horizontal') as HTMLElement;
    var top = document.querySelector('app-top') as HTMLElement;

    if (advancedFilter) {

      advancedFilter.style.maxHeight = `calc(100dvh - 51px - ${sectionSearch?.offsetHeight}px - ${menu?.offsetHeight}px - ${top?.offsetHeight}px)`;

    }
  }


  async loadData() {
    this.khuVucs = await this.categoriesService.getDataCategory('ADDRESS', 1);
    this.kyNangs = await this.categoriesService.getDataCategory('SKILL-LEVEL', 1);
    this.hinhThucLamViecs = await this.categoriesService.getDataCategory('WORKING-TYPE', 1);
    this.mucLuongs = await this.categoriesService.getDataCategory('SALARY', 1);
    this.kinhNghiems = await this.categoriesService.getDataCategory('EXPERIENCE', 1);
    this.capBacs = await this.categoriesService.getDataCategory('VACANCY', 1);
  }

}
