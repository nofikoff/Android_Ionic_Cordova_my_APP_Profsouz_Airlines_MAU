import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';
import {BrMaskerModule} from 'brmasker-ionic-3';

import {LoginPage} from './login';

@NgModule({
    declarations: [
        LoginPage,
    ],
    imports: [
        IonicPageModule.forChild(LoginPage),
        TranslateModule.forChild(),
        BrMaskerModule
    ],
    exports: [
        LoginPage
    ]
})
export class LoginPageModule {
}
