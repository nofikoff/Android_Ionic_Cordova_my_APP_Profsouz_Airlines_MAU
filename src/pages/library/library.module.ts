import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LibraryPage} from './library';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        LibraryPage,
    ],
    imports: [
        IonicPageModule.forChild(LibraryPage),
        TranslateModule.forChild()
    ],
})
export class LibraryPageModule {
}
