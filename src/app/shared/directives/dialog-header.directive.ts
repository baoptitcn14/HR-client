import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[dialogHeader]',
  standalone: true,
})
export class DialogHeaderDirective implements OnInit {
  @Input() classDialog: string = '';

  constructor(
    private el: ElementRef
  ) {}

  ngOnInit(): void {

    if (this.classDialog) {
      const dialog = document.getElementsByClassName(this.classDialog)[0];

      if(dialog) {

        const header = dialog.querySelector('.p-dialog-header');
        if (header) header.prepend(this.el.nativeElement);

      }

    }

  }
}
