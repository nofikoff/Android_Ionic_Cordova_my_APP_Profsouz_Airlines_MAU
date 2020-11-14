import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostDetailPage} from './post-detail';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        PostDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(PostDetailPage),
        TranslateModule.forChild()
    ],
})
export class PostDetailPageModule {
}
