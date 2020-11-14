import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NewCommentPage} from './new-comment';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        NewCommentPage,
    ],
    imports: [
        IonicPageModule.forChild(NewCommentPage),
        TranslateModule.forChild(),
        ComponentsModule
    ],
})
export class NewCommentPageModule {
}
