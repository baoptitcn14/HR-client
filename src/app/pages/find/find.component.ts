import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { DataViewModule } from 'primeng/dataview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { RecommendComponiesComponent } from '../../shared/components/recommend-componies/recommend-componies.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
    RecommendComponiesComponent,
    OverlayPanelModule,
    CheckboxModule,
    AutoCompleteModule
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

  //#region Xử lý các tương tác
  search(event: any) {

  }
  //#endregion
}
