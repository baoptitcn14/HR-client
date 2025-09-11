import { Component } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cv-input-toolbar',
  standalone: true,
  imports: [
    TooltipModule
  ],
  templateUrl: './cv-input-toolbar.component.html',
  styleUrl: './cv-input-toolbar.component.scss'
})
export class CvInputToolbarComponent {

}
