import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AppConst } from '../../app-const';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';

@Component({
  selector: 'app-basic-components',
  standalone: true,
  imports: [CommonModule, IconFieldModule, InputIconModule, InputTextModule, CdkDrag, CdkDropList],
  templateUrl: './basic-components.component.html',
  styleUrl: './basic-components.component.scss'
})
export class ComponentsComponent implements OnInit {

  private http = inject(HttpClient);

  dsThanhPhan: any[] = [];
  emptySearchMessage = AppConst.emptySearchMessage;

  @Input() title: string = 'Các thành phần cơ bản';
  @Input() isHideTitle: boolean = false;
  @Input() cdkDropListConnectedTo: string[] = [];
  @Output() dragStartEvent = new EventEmitter<any>();
  @Output() dragEndEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.http.get<any>('/assets/components.json')
      .subscribe((data: IThanhPhan[]) => {

        // order by label
        this.dsThanhPhan = data.map((item: IThanhPhan) => ({ ...item, _css: JSON.parse(item.css ?? '{}') }))
          .sort((a: any, b: any) => a.label?.localeCompare(b.label));
      });
  }

  search(event: any) {
    this.http.get<any>('/assets/components.json')
      .subscribe(data => {
        this.dsThanhPhan = data.filter((item: IThanhPhan) => item.label?.toLowerCase().includes(event.target.value.toLowerCase()))
      });
  }

  dragStart(thanhPhan: any) {
    // send a clone thanhPhan
    this.dragStartEvent.emit(thanhPhan);
  }

  dragEnd() {
    this.dragEndEvent.emit();
  }
}
