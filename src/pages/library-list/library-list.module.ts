import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LibraryListPage} from './library-list';
import {TranslateModule} from "@ngx-translate/core";
import {LongPressModule} from "ionic-long-press";

@NgModule({
    declarations: [
        LibraryListPage,
    ],
    imports: [
        IonicPageModule.forChild(LibraryListPage),
        TranslateModule.forChild(),
        LongPressModule
    ],
})
export class LibraryListPageModule {
}
