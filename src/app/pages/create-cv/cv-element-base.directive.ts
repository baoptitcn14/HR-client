import {
  inject,
  Input,
  Output,
  EventEmitter,
  Directive,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IMoveEvent } from '../../shared/components/cv-input/cv-input.component';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { IThanhPhan } from '../page-viec-lam/ung-tuyen-dialog/ung-tuyen-dialog.component';

@Directive()
export abstract class CvElementBaseDirective implements OnChanges {
  private utilitiesService = inject(UtilitiesService);

  // input region
  @Input({ required: true }) template: any;
  @Input() typeCode = 'cv-element';
  @Input() label = 'cv-element';
  @Input() focus = false;
  @Input() listElement: { [key: string]: any[] } = {};
  @Input() colId = '';

  @Input() idx = 0;
  @Input() first = false;
  @Input() last = false;

  // output region
  @Output() onFocusEvent = new EventEmitter<string>();
  @Output() onUpdateElementEvent = new EventEmitter<IUpdateElement>();
  @Output() onDeleteEvent = new EventEmitter();
  @Output() onMoveUpEvent = new EventEmitter();
  @Output() onMoveDownEvent = new EventEmitter();

  // output Event GROUP region
  @Output() onMoveGroupEvent = new EventEmitter<IMoveGroupEvent>();
  @Output() onDeleteGroupEvent = new EventEmitter<string>();

  // output update date label
  @Output() onUpdateLabelEvent = new EventEmitter<{ label: string, typeCode: string }>();

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

  //#region EVENT INPUT TRONG GROUP
  onMoveUp(event: IMoveEvent) {
    if (event.index === 0) return;

    let entries = Object.entries(this.listElement);

    const group = entries[event.index];
    const temp = entries[event.index - 1];

    entries[event.index - 1] = group;
    entries[event.index] = temp;

    this.listElement = Object.fromEntries(entries);
    this.processListElement();
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
  }

  onAdd(event: IMoveEvent) {
    const editors = this.listElement[event.groupId];

    this.listElement[
      event.groupId.split('#')[0] + '#' + this.utilitiesService.customId(8)
    ] = structuredClone(
      editors.map(m => ({ ...m, _value: '', _isBlank: true }))
    );

    this.processListElement();
  }

  onDelete(event: IMoveEvent) {
    delete this.listElement[event.groupId];
    this.processListElement();
  }

  //#endregion

  //#region EVENT MOVE, DELETE GROUP
  onMoveUpGroup() {
    this.onMoveGroupEvent.emit({
      currentIndex: this.idx - 1,
      previousIndex: this.idx,
    });
  }

  onMoveDownGroup() {
    this.onMoveGroupEvent.emit({
      currentIndex: this.idx + 1,
      previousIndex: this.idx,
    });
  }

  onDeleteGroup() {
    this.onDeleteGroupEvent.emit(this.typeCode);
  }

  //#endregion
}

export interface IUpdateElement {
  groupId: string;
  data: IThanhPhan[];
}

export interface IMoveGroupEvent {
  previousIndex: number;
  currentIndex: number;
}
