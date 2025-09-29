import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ICv } from '../../../pages/create-cv/create-cv.component';

@Component({
  selector: 'app-cv-list-template',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './cv-list-template.component.html',
  styleUrl: './cv-list-template.component.scss'
})
export class CvListTemplateComponent implements OnInit {


  // inject region
  private http = inject(HttpClient);

  //output region
  @Output() onChooseTemplateEvent = new EventEmitter<ICv>();

  listTemplate: ICv[] = [];

  ngOnInit(): void {
    this.getListTemplate();
  }

  private getListTemplate() {
    this.http.get('assets/list-template.json').subscribe((res: any) => {
      this.listTemplate = res;
    })
  }

  onChoose(template: ICv) {
    this.onChooseTemplateEvent.emit(template);
  }

}

