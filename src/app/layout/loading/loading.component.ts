import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loadingService = inject(LoadingService)
}

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get loading() {
    return this.loading$.asObservable();
  }

  start() {
    this.loading$.next(true)
  }

  complete() {
    this.loading$.next(false);
  }
}
