import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FeedPage} from './feed';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
    declarations: [
        FeedPage,
    ],
    imports: [
        IonicPageModule.forChild(FeedPage),
        TranslateModule.forChild(),
        DirectivesModule,
        ComponentsModule
    ],
})
export class FeedPageModule {
}
