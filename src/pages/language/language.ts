import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
    selector: 'page-language',
    templateUrl: 'language.html',
})
export class LanguagePage {

    locale: string = 'ru';

    constructor(public navCtrl: NavController,
                public translate: TranslateService,
                public storage: Storage) {
    }

    startApp() {
        this.translate.use(this.locale);
        this.storage.set('locale', this.locale);

        this.navCtrl.setRoot('LoginPage', {}, {
            animate: true,
            direction: 'forward'
        });
    }

    setLocale() {
        this.translate.use(this.locale);
    }
}
