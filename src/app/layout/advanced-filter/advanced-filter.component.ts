import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CategoriesService } from '../../core/services/categories.service';
import { CategoryOutputDto } from '../../shared/service-proxies/sys-service-proxies';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SkeletonModule } from 'primeng/skeleton';
import { ISearchFilter } from '../section-search/section-search.component';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    DividerModule,
    ButtonModule,
    ButtonGroupModule,
    SkeletonModule,
    CheckboxModule
  ],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent implements OnInit {

  // inject region
  private categoriesService = inject(CategoriesService);

  //output region
  @Output() onNextPageEvent = new EventEmitter();
  @Output() onPreviousPageEvent = new EventEmitter();
  @Output() onChangeFilterEvent = new EventEmitter<ISearchFilter>();

  //declare region
  khuVucs: CategoryOutputDto[] = [];
  kyNangs: CategoryOutputDto[] = [];
  hinhThucLamViecs: CategoryOutputDto[] = [];
  mucLuongs: CategoryOutputDto[] = [];
  kinhNghiems: CategoryOutputDto[] = [];
  capBacs: CategoryOutputDto[] = [];

  //bộ filter
  filter: ISearchFilter = {
    khuVuc: 'ALL',
    kyNangs: ['ALL'],
    hinhThucLamViecs: ['ALL'],
    mucLuong: 'ALL',
    kinhNghiem: 'ALL',
    capBac: 'ALL',
  }

  stateCheckBox: {
    [key: string]: boolean
  } = {}

  loading: boolean = true;

  //control show hide
  showFilter: boolean = false;

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

  //#region Xử lý tương tác 

  onPreviousPage() {
    this.onPreviousPageEvent.emit();
  }

  onNextPage() {
    this.onNextPageEvent.emit();
  }

  showAdvancedFilter() {
    this.showFilter = !this.showFilter;

    document.getElementsByTagName('body')[0].style.overflow = this.showFilter ? 'hidden' : 'auto';
  }

  onChange() {

    this.filter.khuVuc = this.filter.khuVuc == 'ALL' ? '' : this.filter.khuVuc;
    this.filter.mucLuong = this.filter.mucLuong == 'ALL' ? '' : this.filter.mucLuong;
    this.filter.kinhNghiem = this.filter.kinhNghiem == 'ALL' ? '' : this.filter.kinhNghiem;
    this.filter.capBac = this.filter.capBac == 'ALL' ? '' : this.filter.capBac;

    this.onChangeFilterEvent.emit(this.filter);
  }

  onCheckBox(name: string) {

    let list = [];

    if (name == 'hinhThucLamViecs') list = this.hinhThucLamViecs;
    else if (name == 'kyNangs') list = this.kyNangs;

    this.stateCheckBox[name] = this.filter[name]?.length == list.length;

    this.onChange();

  }

  onCheckBoxAll(name: string) {
    if (name == 'hinhThucLamViecs') this.filter[name] = this.stateCheckBox[name] ? this.hinhThucLamViecs.map((x) => x.code!) : [];
    else if (name == 'kyNangs') this.filter[name] = this.stateCheckBox[name] ? this.kyNangs.map((x) => x.code!) : [];

    this.onChange();
  }

  //#endregion


  async loadData() {
    this.loading = true;

    this.kyNangs = await this.categoriesService.getDataCategory('SKILL-LEVEL', 1);
    this.hinhThucLamViecs = await this.categoriesService.getDataCategory('WORKING-TYPE', 1);
    this.mucLuongs = await this.categoriesService.getDataCategory('SALARY', 1);
    this.kinhNghiems = await this.categoriesService.getDataCategory('EXPERIENCE', 1);
    this.capBacs = await this.categoriesService.getDataCategory('VACANCY', 1);
    this.khuVucs = await this.categoriesService.getDataCategory('ADDRESS', 1);

    //set value for checkboxall
    this.filter.hinhThucLamViecs = this.hinhThucLamViecs.map((x) => x.code!);
    this.filter.kyNangs = this.kyNangs.map((x) => x.code!);

    this.stateCheckBox['hinhThucLamViecs'] = this.filter.hinhThucLamViecs?.length == this.hinhThucLamViecs.length;
    this.stateCheckBox['kyNangs'] = this.filter.kyNangs?.length == this.kyNangs.length;

    this.loading = false;
  }

}
