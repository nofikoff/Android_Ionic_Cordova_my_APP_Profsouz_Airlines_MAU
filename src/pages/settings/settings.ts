import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Api} from "../../providers";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    public branches: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage: Storage,
                public loadingCtrl: LoadingController,
                public api: Api,
                public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.api.get('settings/branches').subscribe((ctx: any) => {
            this.branches = ctx.data;
            console.log(this.branches);
        })
    }

    selectLanguage(value: string) {
        this.api.get('lang/' + value).subscribe(() => {
            this.translate.use(value);
            this.storage.set('locale', value);
        });
    }

    changeBranch(branch: any) {

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        let url = branch.follow ? 'settings/notifications/branch/follow' : 'settings/notifications/branch/unFollow';

        this.api.post(url, {branch_id: branch.id, urgent: 1} ).subscribe(() => {
            loader.dismiss();
        }, () => {
            loader.dismiss();
        });
    }
}
