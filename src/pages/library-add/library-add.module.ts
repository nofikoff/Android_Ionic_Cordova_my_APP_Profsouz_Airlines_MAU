import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LibraryAddPage} from './library-add';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [
        LibraryAddPage,
    ],
    imports: [
        IonicPageModule.forChild(LibraryAddPage),
        TranslateModule.forChild()
    ],
})
export class LibraryAddPageModule {
}
