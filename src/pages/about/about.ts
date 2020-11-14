import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Api} from "../../providers";

@IonicPage()
@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class AboutPage {

    readonly alias: string = 'o-sisteme';

    private text: string = '';

    constructor(public navCtrl: NavController,
                public api: Api,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.getPage();
    }

    getPage() {
        this.api.get(`page/${this.alias}`).subscribe((res: any) => {
            this.text = res.data.text;
        });
    }

}
