import { Component, Input } from '@angular/core';
import { CompanyUserCardComponent } from '../company-user-card/company-user-card.component';

@Component({
  selector: 'app-recommend-list',
  standalone: true,
  imports: [
    CompanyUserCardComponent
  ],
  templateUrl: './recommend-list.component.html',
  styleUrl: './recommend-list.component.scss'
})
export class RecommendListComponent {
  @Input() data: any = [];
  @Input() title: string = '';
  @Input() borderLeftTitleColor: string = '';
  @Input({ required: true }) typeView = '';
}
