import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NewVotePage} from './new-vote';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        NewVotePage,
    ],
    imports: [
        IonicPageModule.forChild(NewVotePage),
        TranslateModule.forChild(),
        ComponentsModule
    ],
    exports: [
        NewVotePage
    ]
})
export class NewVotePageModule {
}
