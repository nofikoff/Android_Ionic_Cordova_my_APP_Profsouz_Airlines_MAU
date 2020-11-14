import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController} from 'ionic-angular';
import {User, Flash} from '../../providers';
import {Sim} from "@ionic-native/sim";

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: { first_name: string, last_name: string, phone: string, password: string, password_confirmation: string } = {
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
        password_confirmation: ''
    };

    // Our translated text strings
    private signupErrorString: string;

    // put errors from ajax response
    private errors: object = null;

    private isProceed: boolean = false;

    constructor(public navCtrl: NavController,
                public user: User,
                public flash: Flash,
                private sim: Sim,
                public translateService: TranslateService) {

        this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
            this.signupErrorString = value;
        });

        this.sim.hasReadPermission().then(
            (info) => {
                if (info) {
                    this.sim.getSimInfo().then(
                        (info) => {
                            this.account.phone = info.phoneNumber
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                } else {
                    this.sim.requestReadPermission().then(
                        () => {
                            this.sim.getSimInfo().then(
                                (info) => {
                                    this.account.phone = info.phoneNumber
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

    doSignup() {
        this.isProceed = true;
        this.user.signup(this.account).then(() => {
            this.navCtrl.push('SignupCompletedPage');
            this.isProceed = false;
        }, (err) => {
            let errors = this.errors = err.error.errors;
            if(errors.phone) {
                this.flash.push(errors.phone[0]);
            }else{
                this.flash.push(this.signupErrorString);
            }
            this.isProceed = false;
        });
    }

    isError(value) {
        return this.errors && this.errors.hasOwnProperty(value);
    }
}
