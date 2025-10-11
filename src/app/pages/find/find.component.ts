import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    PaginatorModule
  ],
  templateUrl: './find.component.html',
  styleUrl: './find.component.scss'
})
export class FindComponent {

  searchText: string = '';

  stateCheck = {
    company: true,
    userCv: true
  }

  suggestions: any[] = [];

  TYPE_VIEW_CODE = TYPE_VIEW_CODE;

  //#region Xử lý các tương tác
  search(event: any) {

  }
  //#endregion
}
