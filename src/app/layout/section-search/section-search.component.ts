import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { CategoriesService } from '../../core/services/categories.service';

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
  private jobPostInfoServiceProxy = inject(JobPostInfoServiceProxy);
  private categoriesService = inject(CategoriesService);

  // input, output region
  @Input() showfilters = true;
  @Input() fixed = false;
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
    this.getHinhThucLamViecs();
    this.getTrinhDos();
  }

  private async getLocations() {

    this.khuVucs = await this.categoriesService.getDataCategory('ADDRESS', 1);

  }

  private async getHinhThucLamViecs() {
    this.hinhThucLamViecs = await this.categoriesService.getDataCategory('WORKING-TYPE', 1);
  }


  private async getTrinhDos() {
    this.kyNangs = await this.categoriesService.getDataCategory('SKILL-LEVEL', 1);
  }

  onSearch() {
    this.onSearchEvent.emit(this.filter);
  }

  searchPost(event: AutoCompleteCompleteEvent) {

    const input = new PostQueryDto();

    input.tenantId = AppConst.tenantDefaultId;

    input.criterias = [
      new ICriteriaRequestDto({
        propertyName: 'jobStatus',
        operation: 0,
        value: 'DEFAULT',
      })
    ];

    if (event.query) {
      input.criterias.push(
        new ICriteriaRequestDto({
          propertyName: 'title',
          operation: 6,
          value: event.query,
        })
      )
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
