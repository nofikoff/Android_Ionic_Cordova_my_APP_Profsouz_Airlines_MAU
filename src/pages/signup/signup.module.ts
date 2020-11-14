import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicPageModule} from 'ionic-angular';
import {BrMaskerModule} from 'brmasker-ionic-3';

import {SignupPage} from './signup';

@NgModule({
    declarations: [
        SignupPage,
    ],
    imports: [
        IonicPageModule.forChild(SignupPage),
        TranslateModule.forChild(),
        BrMaskerModule,
    ],
    exports: [
        SignupPage
    ]
})
export class SignupPageModule {
}
