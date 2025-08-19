import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutSideDirective {

    @Output('outSide') outSide: EventEmitter<any> = new EventEmitter();
    @Output('inSide') inSide: EventEmitter<any> = new EventEmitter();

    constructor(
        private _elementRef: ElementRef
    ) { }

    @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement: any) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);

        if (!clickedInside) {
            this.outSide.emit(targetElement);
        } else {
            this.inSide.emit(null);
        }
    }
}
