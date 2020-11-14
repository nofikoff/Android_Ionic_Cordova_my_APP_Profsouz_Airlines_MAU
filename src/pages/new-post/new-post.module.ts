import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NewPostPage} from './new-post';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    declarations: [
        NewPostPage,
    ],
    imports: [
        IonicPageModule.forChild(NewPostPage),
        TranslateModule.forChild(),
        ComponentsModule
    ],
})
export class NewPostPageModule {
}
