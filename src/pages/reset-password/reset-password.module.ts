import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ResetPasswordPage} from './reset-password';
import {BrMaskerModule} from "brmasker-ionic-3";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        ResetPasswordPage,
    ],
    imports: [
        IonicPageModule.forChild(ResetPasswordPage),
        TranslateModule.forChild(),
        BrMaskerModule
    ],
})
export class ResetPasswordPageModule {
}
