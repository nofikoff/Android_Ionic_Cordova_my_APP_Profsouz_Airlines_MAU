import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api, Flash, Pages} from "../../providers";


@IonicPage()
@Component({
    selector: 'page-post-comment',
    templateUrl: 'post-comment.html',
})
export class PostCommentPage {

    private post: any = null;

    private comments: any = [];

    firstLoading = true;

    private pages: Pages;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public navParams: NavParams) {
        this.post = navParams.get('post');
        this.pages = new Pages(api, `posts/${this.post.id}/comments`);
    }

    ngOnInit() {
        this.getComments().then(() => {
            this.firstLoading = false;
        });
    }

    ionViewDidEnter() {
        if(!this.firstLoading) {
            this.refreshComments();
        }
    }

    doRefresh(refresher) {
        this.pages.refreshPages();
        this.comments = [];
        this.getComments().then(() => {
            refresher.complete();
        });
    }

    getNextPage(infiniteScroll) {
        this.getComments().then(() => {
            infiniteScroll.complete();
        })
    }

    getComments() {
        return this.pages.get().then((data: any) => {
            this.comments = data;
        });
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    refreshComments() {
        if (this.comments.length !== 0) {
            this.pages.refreshPages();
            this.comments = [];
            this.getComments();
        }
    }

    addComment() {
        this.navCtrl.push('NewCommentPage', {post_id: this.post.id});
    }
}
