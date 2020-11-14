import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {VotePage} from './vote';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        VotePage,
    ],
    imports: [
        IonicPageModule.forChild(VotePage),
        TranslateModule.forChild()
    ],
    exports: [
        VotePage
    ]
})
export class VotePageModule {
}
