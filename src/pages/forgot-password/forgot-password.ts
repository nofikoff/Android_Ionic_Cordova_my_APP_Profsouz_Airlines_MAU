import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Api, Flash} from "../../providers";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

    private phone: string = '';

    private errorString: string;
    private successString: string;

    public errors: {} = {};

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public translateService: TranslateService,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
        this.translateService.get('FORGOT_ERROR').subscribe((value) => {
            this.errorString = value;
        });
        this.translateService.get('FORGOT_SUCCESS').subscribe((value) => {
            this.successString = value;
        })
    }

    sendResetLink() {
        if (!this.phone.length) {
            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        this.api.post('password/phone', {phone: this.phone}).subscribe(() => {
            this.flash.push(this.successString);
            this.navCtrl.push('ResetPasswordPage');
            loader.dismiss();
        }, err => {
            if (err.status === 403) {
                this.flash.push(this.errorString);
            }
            if (err.status === 422) {
                this.flash.push(this.errorString);
                this.errors = err.error.errors;
            }
            loader.dismiss();
        });
    }

    isError(name: string) {
        return this.errors && this.errors.hasOwnProperty(name);
    }

    openPage(name: string) {
        this.navCtrl.push(name);
    }

}
