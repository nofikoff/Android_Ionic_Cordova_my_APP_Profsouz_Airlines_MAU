import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DraftPage} from './draft';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
    declarations: [
        DraftPage,
    ],
    imports: [
        IonicPageModule.forChild(DraftPage),
        TranslateModule.forChild(),
        DirectivesModule,
        ComponentsModule
    ],
})
export class DraftPageModule {
}
