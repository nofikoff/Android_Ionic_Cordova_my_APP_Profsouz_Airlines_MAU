import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, App } from 'ionic-angular';
import {User} from "../../providers";
import {LoginPage} from "../login/login";


@IonicPage()
@Component({
    selector: 'page-more',
    templateUrl: 'more.html',
})
export class MorePage implements OnInit {

    private profile: any = null;

    constructor(public navCtrl: NavController,
                public user: User,
                public navParams: NavParams,
                public _app: App
    ) {
    }

    ngOnInit(): void {
        this.user.getProfile().subscribe((profile) => {
            this.profile = profile;
        });
    }

    getFullName() {
        return `${this.profile.first_name} ${this.profile.last_name}`;
    }

    openPage(name) {
        this.navCtrl.push(name)
    }

    logout() {
        this.user.logout();
        this._app.getRootNav().setRoot(LoginPage);
    }
}
