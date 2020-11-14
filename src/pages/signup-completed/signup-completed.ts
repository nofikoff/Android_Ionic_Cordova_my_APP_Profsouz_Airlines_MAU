import {Component, Injector} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../providers";

@IonicPage()
@Component({
    selector: 'page-signup-completed',
    templateUrl: 'signup-completed.html',
})
export class SignupCompletedPage {

    constructor(public navCtrl: NavController, public navParams: NavParams,public inj: Injector) {
    }

    toMain() {
        this.navCtrl.setRoot('LoginPage');
        this.inj.get(User).logout();
    }
}
