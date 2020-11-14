import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostHistoryPage} from './post-history';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        PostHistoryPage,
    ],
    imports: [
        IonicPageModule.forChild(PostHistoryPage),
        TranslateModule.forChild()
    ],
    exports: [
        PostHistoryPage
    ]
})
export class PostHistoryPageModule {
}
