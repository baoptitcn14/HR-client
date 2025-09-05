import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[trackElementInViewport]',
  standalone: true,
})
export class TrackElementInViewportDirective implements OnInit, OnDestroy {
  @Input() threshold: number | number[] = 0.1; // Tỉ lệ phần tử hiển thị tối thiểu để trigger
  @Input() rootMargin: string = '0px'; // Khoảng lề viewport

  @Output() inViewportChange = new EventEmitter<boolean>();

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.inViewportChange.emit(entry.isIntersecting);
        }
      },
      {
        root: null, // Viewport mặc định
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
