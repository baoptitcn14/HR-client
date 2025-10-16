import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { CompanyUserCardComponent } from '../../shared/components/company-user-card/company-user-card.component';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { RecommendListComponent } from '../../shared/components/recommend-list/recommend-list.component';
import { TYPE_VIEW_CODE } from '../profile/profile.component';
import { HrCompanyInfoServiceProxy, HrCompanyQueryDto, ICriteriaRequestDto, UserProfileInfoServiceProxy, UserProfileQueryDto } from '../../shared/service-proxies/sys-service-proxies';
import { concatMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    RecommendListComponent,
    OverlayPanelModule,
    CheckboxModule,
    AutoCompleteModule,
    AvatarModule,
    CompanyUserCardComponent,
    DividerModule,
    PaginatorModule,
    TranslatePipe
  ],
  templateUrl: './find.component.html',
  styleUrl: './find.component.scss'
})
export class FindComponent {

  //inject region
  hrCompanyInfoService = inject(HrCompanyInfoServiceProxy);
  userProfileInfoService = inject(UserProfileInfoServiceProxy);

  searchText: string = '';

  stateCheck = {
    company: true,
    userProfile: true
  }

  suggestions: ISuggestions[] = [];

  TYPE_VIEW_CODE = TYPE_VIEW_CODE;

  //#region Xử lý các tương tác
  search(event: any) {

    if (this.stateCheck.company && this.stateCheck.userProfile) {
      this.getCompanies()
        .pipe(concatMap((res: any) => this.getUserProfile()))
        .subscribe((res: any) => {
          this.suggestions = res.items.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              surname: item.surname
            }
          });
        });
    }
    else if (this.stateCheck.company) {
      this.getCompanies().subscribe((res: any) => {
        this.suggestions = res.items.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            surname: ''
          }
        });
      });
    }
    else if (this.stateCheck.userProfile) {

      this.getUserProfile().subscribe((res: any) => {
        this.suggestions = res.items.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            surname: item.surname
          }
        });
      });

    }

  }
  //#endregion

  private getCompanies() {

    const input = new HrCompanyQueryDto();
    input.criterias = [
      new ICriteriaRequestDto(
        {
          propertyName: 'name',
          operation: 6,
          value: this.searchText
        }
      )
    ];

    input.sorting = 'name asc';

    return this.hrCompanyInfoService.getAll(input);
  }

  private getUserProfile() {

    const input = new UserProfileQueryDto();

    input.criterias = [
      new ICriteriaRequestDto(
        {
          propertyName: 'surname',
          operation: 6,
          value: this.searchText
        }
      )
    ];

    // input.search = this.searchText;

    input.sorting = 'surname asc';

    return this.userProfileInfoService.getAll(input);
  }
}

interface ISuggestions {
  id: string;
  name: string;
  surname: string;
}