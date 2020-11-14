import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostCommentPage} from './post-comment';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        PostCommentPage
    ],
    imports: [
        IonicPageModule.forChild(PostCommentPage),
        TranslateModule.forChild(),
        ComponentsModule
    ],
})
export class PostCommentPageModule {
}
