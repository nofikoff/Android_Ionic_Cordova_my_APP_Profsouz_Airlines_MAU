import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Flash, Api} from "../../providers";


@IonicPage({
    segment: 'reset/:token'
})
@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

    private resetForm = {
        phone: '',
        token: '',
        password: '',
        password_confirmation: ''
    };

    private errorString: string;
    private successString: string;

    public errors: object;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public translateService: TranslateService,
                public loadingCtrl: LoadingController,
                public navParams: NavParams) {
        this.translateService.get('RESET_ERROR').subscribe((value) => {
            this.errorString = value;
        });
        this.translateService.get('RESET_SUCCESS').subscribe((value) => {
            this.successString = value;
        })
    }

    reset() {
        if (!this.resetForm.phone.length ||
            !this.resetForm.token ||
            !this.resetForm.password.length ||
            !this.resetForm.password_confirmation.length) {
            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        this.api.post('password/reset', this.resetForm).subscribe((res: any) => {
            console.log(res);
            this.flash.push(this.successString);
            this.navCtrl.setRoot('LoginPage');
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

    isError(name) {
        return this.errors && this.errors.hasOwnProperty(name);
    }
}
