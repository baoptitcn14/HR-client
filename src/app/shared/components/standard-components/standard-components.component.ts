import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { IThanhPhan } from '../../../pages/mau-tieu-chi/mau-tieu-chi';

@Component({
  selector: 'app-standard-components',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './standard-components.component.html',
  styleUrl: './standard-components.component.scss',
})
export class StandardComponentsComponent implements OnInit {
  private http = inject(HttpClient);

  dsThanhPhan: any[] = [];
  show = true;

  @Input() title: string = 'Các thành phần có sẵn';
  @Input() isHideTitle: boolean = false;
  @Input() cdkDropListConnectedTo: any;
  @Output() dragStartEvent = new EventEmitter<any>();
  @Output() dragEndEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.http.get<any>('/assets/standard-components.json').subscribe((data) => {
      // order by name
      // order by label
      this.dsThanhPhan = data
        .filter((item: any) => item.inputType != 'group')
        .map((item: IThanhPhan) => ({
          ...item,
          _css: JSON.parse(item.css ?? '{}'),
        }))
        .sort((a: any, b: any) => a.label?.localeCompare(b.label));
    });
  }

  search(event: any) {
    this.http.get<any>('/assets/standard-components.json').subscribe((data) => {
      this.dsThanhPhan = data
        .map((item: IThanhPhan) => ({
          ...item,
          _css: JSON.parse(item.css ?? '{}'),
        }))
        .filter((item: any) =>
          item.label.toLowerCase().includes(event.target.value.toLowerCase())
        );
    });
  }

  dragStart(thanhPhan: any) {
    this.dragStartEvent.emit(thanhPhan);
  }

  dragEnd() {
    this.dragEndEvent.emit();
  }
}
