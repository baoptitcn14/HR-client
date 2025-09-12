import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvGroupActionComponent } from '../cv-group-action/cv-group-action.component';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvInputActionComponent,
    CvGroupActionComponent
  ],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {

}
