import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-prime-icons',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './prime-icons.component.html',
  styleUrl: './prime-icons.component.scss'
})
export class PrimeIconsComponent implements OnInit {

  httpClient = inject(HttpClient);

  ref = inject(DynamicDialogRef);

  selectIcon: string = '';

  listPrimeIcon: IPrimeIcon[] = [];

  ngOnInit(): void {
    // load primeicons
    this.loadPrimeIcons();
  }
  
  onSelectIcon(icon: string) {
    this.ref.close(icon);
  }

  private loadPrimeIcons() {
    this.httpClient.get('../../assets/primeicons.json').subscribe((data: any) => {
      this.listPrimeIcon = data;
    })
  }

}

export interface IPrimeIcon {
  name: string;
  code: string;
}
