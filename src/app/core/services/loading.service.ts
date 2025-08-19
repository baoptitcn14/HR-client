import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
  ) { }

  start() {
    this.loading$.next(true)
  }

  complete() {
    this.loading$.next(false);
  }
}
