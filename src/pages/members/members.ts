import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api, User} from "../../providers";


@IonicPage()
@Component({
    selector: 'page-members',
    templateUrl: 'members.html',
})
export class MembersPage {

    users: any[] = [];

    static readonly url: string = "users/branch/";

    constructor(public navCtrl: NavController, public api: Api, public user: User, public navParams: NavParams) {
        this.users = this.navParams.get('users')
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    formatPhone(phone: string) {
        let pattern = "+##(###)### ## ##"

        let i = 0,
            v = phone.toString();
        return pattern.replace(/#/g, _ => v[i++]);
    }

    toProfile(user: any) {
        this.navCtrl.push('ProfilePage', {user: user.id});
    }

}
