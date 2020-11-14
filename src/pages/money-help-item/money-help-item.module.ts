import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MoneyHelpItemPage} from './money-help-item';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        MoneyHelpItemPage,
    ],
    imports: [
        IonicPageModule.forChild(MoneyHelpItemPage),
        TranslateModule.forChild()
    ],
})
export class MoneyHelpItemPageModule {
}
