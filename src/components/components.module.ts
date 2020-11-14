import {NgModule} from '@angular/core';
import {PostFinnHelpComponent} from './post-finn-help/post-finn-help';
import {PostQuestionComponent} from './post-question/post-question';
import {PostItemComponent} from './post-item/post-item';
import {PostListComponent} from './post-list/post-list';
import {CommentsComponent} from './comments/comments';
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "ionic-angular";
import {DirectivesModule} from "../directives/directives.module";
import { FilePickerComponent } from './file-picker/file-picker';
import { SystemPostsComponent } from './system-posts/system-posts';

@NgModule({
    declarations: [
        PostFinnHelpComponent,
        PostItemComponent,
        PostQuestionComponent,
        PostListComponent,
        CommentsComponent,
        FilePickerComponent,
        SystemPostsComponent,
    ],
    imports: [
        TranslateModule.forChild(),
        IonicModule,
        DirectivesModule
    ],
    entryComponents: [
        PostFinnHelpComponent,
        PostItemComponent,
        PostQuestionComponent,
        CommentsComponent,
        FilePickerComponent,
    ],
    exports: [
        PostFinnHelpComponent,
        PostItemComponent,
        PostQuestionComponent,
        PostListComponent,
        CommentsComponent,
        FilePickerComponent,
        SystemPostsComponent,
    ]
})
export class ComponentsModule {
}
