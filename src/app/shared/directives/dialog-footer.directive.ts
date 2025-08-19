import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[dialogFooter]',
  standalone: true,
})
export class DialogFooterDirective implements OnInit {
  @Input({ required: true }) classDialog: string = '';
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    this.positionFooter();
  }

  private positionFooter() {
    if (this.classDialog) {
      this.el.nativeElement.classList.add('p-dialog-footer');

      const dialog = document.getElementsByClassName(this.classDialog)[0];
      if (dialog) dialog.appendChild(this.el.nativeElement);
    }
  }
}
