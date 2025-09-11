import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupToolbarComponent } from '../cv-group-toolbar/cv-group-toolbar.component';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupToolbarComponent
  ],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {

}
