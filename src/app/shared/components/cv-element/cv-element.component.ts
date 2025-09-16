import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CvGroupActionComponent } from '../cv-group-action/cv-group-action.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { IThanhPhan } from '../create-manual-form/create-manual-form.component';
import { CvInputActionComponent } from '../cv-input-action/cv-input-action.component';
import { CvInputToolbarComponent } from '../cv-input-toolbar/cv-input-toolbar.component';
import { CvInputComponent, IMoveEvent } from '../cv-input/cv-input.component';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-cv-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvGroupActionComponent,
    CdkDrag,
    CdkDropList,
    CvInputActionComponent,
    CvInputToolbarComponent,
    CvInputComponent,
  ],
  templateUrl: './cv-element.component.html',
  styleUrl: './cv-element.component.scss',
})
export class CvElementComponent implements OnChanges {

  private utilitiesService = inject(UtilitiesService);

  // input region
  @Input({ required: true }) template: any;
  @Input() typeCode = 'cv-element';
  @Input() label = 'cv-element';
  @Input() focus = false;
  @Input() listElement: { [key: string]: any[] } = {};

  // output region
  @Output() onFocusEvent = new EventEmitter<string>();
  @Output() onUpdateElementEvent = new EventEmitter<IUpdateElement>();

  // variable region
  listElementProcessed: { [key: string]: IThanhPhan[] } = {};
  listElementGroupId: string[] = [];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listElement']) {
      this.processListElement();
    }
  }

  private processListElement() {
    // get unique list groupId
    if (!this.listElement) return;
    this.listElementGroupId = Object.keys(this.listElement).filter(
      (k, i, arr) => arr.indexOf(k) === i
    );
  }


  onMoveUp(event: IMoveEvent) {

    if (event.index === 0) return;

    let entries = Object.entries(this.listElement);

    const group = entries[event.index];
    const temp = entries[event.index - 1];

    entries[event.index - 1] = group;
    entries[event.index] = temp;

    this.listElement = Object.fromEntries(entries);

    this.processListElement();

    this.onUpdateElementEvent.emit({
      groupId: event.groupId,
      data: this.listElement[event.groupId],
    });
  }

  onMoveDown(event: IMoveEvent) {

    if (event.index === this.listElementGroupId.length - 1) return;

    let entries = Object.entries(this.listElement);

    const group = entries[event.index];
    const temp = entries[event.index + 1];

    entries[event.index + 1] = group;
    entries[event.index] = temp;

    this.listElement = Object.fromEntries(entries);

    this.processListElement();

    this.onUpdateElementEvent.emit({
      groupId: event.groupId,
      data: this.listElement[event.groupId],
    });
  }

  onAdd(event: IMoveEvent) {
    const group = this.listElement[event.groupId];

    this.listElement[event.groupId.split('#')[0] + '#' + this.utilitiesService.customId(8)] = structuredClone(group);

    this.processListElement();

    this.onUpdateElementEvent.emit({
      groupId: event.groupId,
      data: this.listElement[event.groupId],
    });
  }
}

export interface IUpdateElement {
  groupId: string;
  data: IThanhPhan[];
}
