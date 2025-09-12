import { Component } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cv-input-action',
  standalone: true,
  imports: [
    TooltipModule
  ],
  templateUrl: './cv-input-action.component.html',
  styleUrl: './cv-input-action.component.scss'
})
export class CvInputActionComponent {

}
