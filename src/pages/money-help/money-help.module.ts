import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MoneyHelpPage} from './money-help';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        MoneyHelpPage,
    ],
    imports: [
        IonicPageModule.forChild(MoneyHelpPage),
        TranslateModule.forChild(),
        ComponentsModule
    ],
})
export class MoneyHelpPageModule {
}
