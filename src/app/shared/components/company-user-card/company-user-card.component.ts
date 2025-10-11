import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-company-user-card',
  standalone: true,
  imports: [
    FormsModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    TooltipModule
  ],
  templateUrl: './company-user-card.component.html',
  styleUrl: './company-user-card.component.scss'
})
export class CompanyUserCardComponent {
  @Input() data: any = {};
  @Input() typeView = '';

  onFollow() {
    
  }
}
