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
import { v4 as uuidv4 } from 'uuid';
import { CvService } from './cv.service';
import { UserCVServiceProxy, ViewDto } from '../../shared/service-proxies/sys-service-proxies';
import { forkJoin } from 'rxjs';

@Directive()
export abstract class CvElementBaseDirective implements OnChanges {
  private utilitiesService = inject(UtilitiesService);
  private cvService = inject(CvService);
  private userCvServiceProxy = inject(UserCVServiceProxy);

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

  // output Event HASHCODE IN HASHMAP region
  @Output() onMoveHashCodeEvent = new EventEmitter<IMoveHashCodeEvent>();
  @Output() onDeleteHashCodeEvent = new EventEmitter<string>();

  // output update date label
  @Output() onUpdateLabelEvent = new EventEmitter<{
    label: string;
    typeCode: string;
  }>();

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
    ).sort((a, b) => parseInt(a.split('#')[0]) - parseInt(b.split('#')[0]));
  }

  //#region EVENT INPUT TRONG GROUP

  // di chuyển nhóm
  onMoveUp(event: IMoveEvent) {
    if (event.index === 0) return;

    let entries = Object.entries(this.listElement);

    const group = entries[event.index];
    const temp = entries[event.index - 1];

    entries[event.index - 1] = [temp[0], group[1].map(m => ({ ...m, groupId: temp[0] }))];;
    entries[event.index] = [group[0], temp[1].map(m => ({ ...m, groupId: group[0] }))];

    this.listElement = Object.fromEntries(entries);
    this.processListElement();
  }

  onMoveDown(event: IMoveEvent) {
    if (event.index === this.listElementGroupId.length - 1) return;

    // get value của các editor trong nhóm group
    const hashMap = this.cvService.getInnerHtmlInputsByHashCode(this.typeCode, this.listElementGroupId, false);

    let entries = Object.entries(this.listElement);

    const group = structuredClone(entries[event.index]);
    const temp = structuredClone(entries[event.index + 1]);

    group[1].forEach(m => {
      if (hashMap[group[0]]) {
        m.value = hashMap[group[0]].find((x: any) => x.code == m.code)?.value;
      }
    });

    temp[1].forEach(m => {
      if (hashMap[temp[0]]) {
        m.value = hashMap[temp[0]].find((x: any) => x.code == m.code)?.value;
      }
    });

    // get value của các editor trong nhóm temp

    entries[event.index] = [group[0], temp[1].map(m => ({ ...m, groupId: group[0] }))];
    entries[event.index + 1] = [temp[0], group[1].map(m => ({ ...m, groupId: temp[0] }))];

    this.listElement = Object.fromEntries(entries);

    this.processListElement();
  }

  // add nhóm
  onAdd(event: IMoveEvent) {
    // editors thuoc nhom
    const editors = this.listElement[event.groupId];

    // index cua nhóm
    const listIndexGroup = this.listElementGroupId.map(m => (parseInt(m.split('#')[0])));

    const maxIndex = Math.max(...listIndexGroup);

    const l = event.groupId.split('#');
    const groupId =
      (
        l.length > 3
          ? (maxIndex + 1) + '#' + l[1] + '#' + l[2] // typecode là OTHER 
          : (maxIndex + 1) + '#' + l[1]) +
      '#' +
      this.utilitiesService.customId(8);

    // tạo nhóm mới groupId bằng cách copy nhóm cũ event.groupId
    this.listElement[groupId] = structuredClone(
      editors.map((m) => ({ ...m, value: '', _isBlank: true, groupId: groupId, id: uuidv4() }))
    );

    this.processListElement();
  }

  onDelete(event: IMoveEvent) {
    // let arrCallApi: any[] = [];

    // this.listElement[event.groupId].forEach(m => {
    //   arrCallApi.push(this.deleteJobField(m.id));
    // });

    // forkJoin(arrCallApi).subscribe(res => {
    //   delete this.listElement[event.groupId];
    //   this.processListElement();
    // });

    // Lưu lại undo
    this.cvService.undo = [
      ...this.cvService.undo,
      {
        type: 'delete_group',
        data: {
          groupId: event.groupId,
          data: this.listElement[event.groupId]
        },
      }]

    delete this.listElement[event.groupId];
    this.processListElement();
  }


  private deleteJobField(id: string) {

    const input = new ViewDto();
    input.id = id;

    return this.userCvServiceProxy.delete(input);

  }

  //#endregion

  //#region EVENT MOVE, DELETE HASHCODE
  onMoveUpGroup() {
    this.onMoveHashCodeEvent.emit({
      currentIndex: this.idx - 1,
      previousIndex: this.idx,
    });
  }

  onMoveDownGroup() {
    this.onMoveHashCodeEvent.emit({
      currentIndex: this.idx + 1,
      previousIndex: this.idx,
    });
  }

  onDeleteGroup() {
    this.onDeleteHashCodeEvent.emit(this.typeCode);
  }

  //#endregion
}

export interface IUpdateElement {
  groupId: string;
  data: IThanhPhan[];
}

export interface IMoveHashCodeEvent {
  previousIndex: number;
  currentIndex: number;
}
