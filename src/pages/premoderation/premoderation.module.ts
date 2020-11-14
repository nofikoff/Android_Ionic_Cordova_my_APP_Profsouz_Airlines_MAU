import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PremoderationPage} from './premoderation';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        PremoderationPage,
    ],
    imports: [
        IonicPageModule.forChild(PremoderationPage),
        TranslateModule.forChild()
    ],
})
export class PremoderationPageModule {
}
