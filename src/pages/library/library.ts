import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api} from '../../providers';


@IonicPage()
@Component({
    selector: 'page-library',
    templateUrl: 'library.html',
})
export class LibraryPage {

    categories: any[] = [];

    constructor(public navCtrl: NavController, public api: Api, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.api.get('documents/branch').subscribe((ctx: any) => {
            this.categories = ctx.data;
        })
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    loadCategory(category) {
        this.navCtrl.push('LibraryListPage', {branch: category});
    }

    openNewLibrary() {
        this.navCtrl.push('LibraryAddPage')
    }
}
