import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ForgotPasswordPage} from './forgot-password';
import {BrMaskerModule} from "brmasker-ionic-3";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        ForgotPasswordPage,
    ],
    imports: [
        IonicPageModule.forChild(ForgotPasswordPage),
        TranslateModule.forChild(),
        BrMaskerModule
    ],
})
export class ForgotPasswordPageModule {
}
