var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { PostFinnHelpComponent } from './post-finn-help/post-finn-help';
import { PostQuestionComponent } from './post-question/post-question';
import { PostItemComponent } from './post-item/post-item';
import { PostListComponent } from './post-list/post-list';
import { CommentsComponent } from './comments/comments';
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../directives/directives.module";
import { FilePickerComponent } from './file-picker/file-picker';
import { SystemPostsComponent } from './system-posts/system-posts';
var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    return ComponentsModule;
}());
ComponentsModule = __decorate([
    NgModule({
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
], ComponentsModule);
export { ComponentsModule };
//# sourceMappingURL=components.module.js.map