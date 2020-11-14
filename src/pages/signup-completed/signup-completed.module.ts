import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SignupCompletedPage} from './signup-completed';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        SignupCompletedPage,
    ],
    imports: [
        IonicPageModule.forChild(SignupCompletedPage),
        TranslateModule.forChild()
    ],
})
export class SignupCompletedPageModule {
}
