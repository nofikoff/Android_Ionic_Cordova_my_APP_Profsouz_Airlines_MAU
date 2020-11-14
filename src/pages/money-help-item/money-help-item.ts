import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api} from "../../providers";
import {DomSanitizer} from "@angular/platform-browser";


@IonicPage()
@Component({
    selector: 'page-money-help-item',
    templateUrl: 'money-help-item.html',
})
export class MoneyHelpItemPage {

    public post: any;

    constructor(public navCtrl: NavController,
                public api: Api,
                public navParams: NavParams,
                private _sanitizer: DomSanitizer
    ) {
        this.post = this.navParams.get('post');
        this.getPost();
    }

    doRefresh(refresher) {
        this.getPost().then(() => {
            refresher.complete();
        })
    }

    getPost() {
        return new Promise(resolve => {
            this.api.get('posts/' + this.post.id).subscribe((res: any) => {
                this.post = res.data;
                resolve();
            }, () => {
                resolve();
            })
        })
    }

    downloadPdf(fileUrl: string) {
        this.api.download('posts/pdf/' + fileUrl);
    }

    downloadAttachment(fileUrl: string) {
        this.api.download('posts/attachment/' + fileUrl);
    }

    addComment() {
        this.navCtrl.push('NewCommentPage', {post_id: this.post.id});
    }

    goHistory() {
        this.navCtrl.push('PostHistoryPage', {post: this.post});
    }

    getImage(image) {
        return this._sanitizer.bypassSecurityTrustStyle(image);
    }
}
