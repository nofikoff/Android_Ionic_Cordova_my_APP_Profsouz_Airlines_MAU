import {Directive, ViewContainerRef} from '@angular/core';


@Directive({
    selector: '[post]' // Attribute selector
})
export class PostDirective {

    constructor(public viewContainerRef: ViewContainerRef) {
    }

}
