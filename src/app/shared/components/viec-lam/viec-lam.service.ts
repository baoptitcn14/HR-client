import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViecLamService {

  maxHeight$ = new BehaviorSubject<number>(0);
  height = 0;

  constructor() { }
}
