import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {App, IonicPage, NavController} from 'ionic-angular';

import {Storage} from '@ionic/storage';
import {User, Flash, Api} from '../../providers';

import config from '../../init';
import {Sim} from "@ionic-native/sim";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {
        username: string,
        password: string,
        grant_type: string,
        client_id: number,
        client_secret: string
    } = {
        username: '',
        password: '',
        grant_type: 'password',
        client_id: config.clientId,
        client_secret: config.clientSecret,
    };

    // Our translated text strings
    private loginErrorString: string;

    // put errors from ajax response
    private errors: any = {};

    private isProceed: boolean = false;

    constructor(public navCtrl: NavController,
                public user: User,
                public flash: Flash,
                public storage: Storage,
                private sim: Sim,
                public api: Api,
                public translateService: TranslateService,
                public _app: App
    ) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });

        this.sim.hasReadPermission().then(
            (info) => {
                if (info) {
                    this.sim.getSimInfo().then(
                        (info) => {
                            this.account.username = info.phoneNumber
                        },
                        (err) => {
                            console.log(err);
                        }
                    )
                } else {
                    this.sim.requestReadPermission().then(
                        () => {
                            this.sim.getSimInfo().then(
                                (info) => {
                                    this.account.username = info.phoneNumber
                                },
                                (err) => {
                                    console.log(err);
                                }
                            );
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    doLogin() {
        if (this.account.username.length > 0 && this.account.password.length > 0) {
            this.isProceed = true;

            this.user.login(this.account).then(() => {
                this.flash.push('Вы успешно авторизовались');
                this.isProceed = false;
            }, (err) => {
                this.errors = err.error.errors;
                this.flash.push(this.loginErrorString);
                this.isProceed = false;
            });
        }
    }

    openPage(name: string) {
        this.navCtrl.push(name);
    }

    isError(value) {
        return this.errors && this.errors.hasOwnProperty(value);
    }
}
