import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api, Flash, Pages} from "../../providers";


@IonicPage()
@Component({
    selector: 'page-post-history',
    templateUrl: 'post-history.html',
})
export class PostHistoryPage implements OnInit {

    private logs: any[] = [];
    private post: any;
    private pages: Pages;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public navParams: NavParams) {

        this.post = navParams.get('post');
        this.pages = new Pages(api, `posts/${this.post.id}/history`);
    }

    ngOnInit(): void {
        this.getLogs();
    }

    ionViewWillEnter() {
        this.refreshPages();
    }

    getText(item:any) {
        return item.template.replace(/<\/?[^>]+>/g,'');
    }

    doRefresh(refresher) {
        this.pages.refreshPages();
        this.logs = [];
        this.getLogs().then(() => {
            refresher.complete();
        });
    }

    getNextPage(infiniteScroll) {
        this.getLogs().then(() => {
            infiniteScroll.complete();
        });
    }

    refreshPages() {
        if (this.logs.length !== 0) {
            this.pages.refreshPages();
            this.logs = [];
            this.getLogs();
        }
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    getLogs() {
        return this.pages.get().then((data: any) => {
            this.logs = data;
        });
    }
}
