import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.scss'
})
export class PageHeadingComponent {
  @Input({ required: true }) title: string = '';
  @Input() description: string = '';
}
