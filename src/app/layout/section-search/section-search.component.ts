import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {
  CategoryInfoServiceProxy,
  CategoryOutputDto,
  CategoryQueryDto,
  CategoryServiceProxy,
  ICriteriaRequestDto,
  JobPostInfoServiceProxy,
  PostInfoServiceProxy,
  PostOutputDto,
  PostQueryDto,
} from '../../shared/service-proxies/sys-service-proxies';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppConst } from '../../shared/app-const';

@Component({
  selector: 'app-section-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    AutoCompleteModule,
    MultiSelectModule,
  ],
  templateUrl: './section-search.component.html',
  styleUrl: './section-search.component.scss',
})
export class SectionSearchComponent implements OnInit {
  // inject region
  private categoryInfoService = inject(CategoryInfoServiceProxy);
  private jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);

  // output region
  @Output() onSearchEvent = new EventEmitter();

  // declare category region
  khuVucs: CategoryOutputDto[] = [];
  kyNangs: CategoryOutputDto[] = [];
  hinhThucLamViecs: CategoryOutputDto[] = [];

  // declare
  filter = {
    khuVuc: null,
    kyNang: [],
    hinhThucLamViec: [],
    searchText: null,
  };

  suggestions: PostOutputDto[] = [];

  ngOnInit(): void {
    this.getLocations();
    // this.getLinhVucs();
    this.getTrinhDos();
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

    this.categoryInfoService.getList(input).subscribe((data) => {
      this.khuVucs = data;
    });
  }

  // private getLinhVucs() {
  //   const input = new CategoryQueryDto();

  //   input.criterias = [
  //     new ICriteriaRequestDto({
  //       propertyName: 'groupCode',
  //       operation: 0,
  //       value: 'INDUSTRY',
  //     }),
  //   ];

  //   input.sorting = 'hashCode asc';

  //   this.categoryInfoService.getList(input).subscribe((data) => {
  //     this.linhVucs = data;
  //   });
  // }

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

    this.categoryInfoService.getList(input).subscribe((data) => {
      this.kyNangs = data;
    });
  }

  onSearch() {
    this.onSearchEvent.emit(this.filter);
  }

  searchPost(event: AutoCompleteCompleteEvent) {
    const input = new PostQueryDto();

    input.search = event.query;
    input.tenantId = AppConst.tenantDefaultId;

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'jobStatus',
        operation: 0,
        value: 'DEFAULT',
      }),
    ];

    if (this.filter.khuVuc) {
      input.criterias.push(
        new ICriteriaRequestDto({
          propertyName: 'location',
          operation: 0,
          value: this.filter.khuVuc,
        })
      );
    }

    if (this.filter.kyNang) {
      input.criterias.push(
        new ICriteriaRequestDto({
          propertyName: 'jobLevel',
          operation: 6,
          value: JSON.stringify(this.filter.kyNang),
        })
      );
    }

    if (this.filter.hinhThucLamViec) {
      input.criterias.push(
        new ICriteriaRequestDto({
          propertyName: 'typeJobPost',
          operation: 6,
          value: JSON.stringify(this.filter.hinhThucLamViec),
        })
      );
    }

    this.jobPostInfoServiceProxy.getAll(input).subscribe((data) => {
      this.suggestions = data.items!;
    });
  }

  clearFilter() {
    this.filter = {
      khuVuc: null,
      kyNang: [],
      hinhThucLamViec: [],
      searchText: null,
    };
  }
}
