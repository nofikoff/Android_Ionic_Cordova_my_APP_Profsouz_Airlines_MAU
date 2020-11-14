import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {VoteResultPage} from './vote-result';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        VoteResultPage,
    ],
    imports: [
        IonicPageModule.forChild(VoteResultPage),
        TranslateModule.forChild()
    ],
})
export class VoteResultPageModule {
}
