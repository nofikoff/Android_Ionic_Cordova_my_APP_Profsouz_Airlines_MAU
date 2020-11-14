import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Api, Pages, User} from '../../providers';


@IonicPage()
@Component({
    selector: 'page-comments',
    templateUrl: 'comments.html',
})
export class CommentsPage implements OnInit {

    comments: any[] = [];

    profile: any;

    pages: Pages;

    static readonly url: string = 'posts/comments/my';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public user: User,
                public storage: Storage) {
        this.pages = new Pages(api, CommentsPage.url);
    }

    ngOnInit() {
        this.user.getProfile().subscribe((profile) => {
            this.profile = profile;
        });
    }

    doRefresh(refresher) {
        this.refreshComments().then(() => {
            refresher.complete();
        });
    }

    ionViewWillEnter() {
        this.refreshComments();
    }

    getNextPage(infiniteScroll) {
        this.refreshComments().then(() => {
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
        return new Promise((resolve) => {
            this.pages.refreshPages();
            this.comments = [];
            this.getComments().then(() => {
                resolve(true);
            });
        });
    }

    toPost(id) {
        this.navCtrl.push('PostDetailPage', {post: {id: id}});
    }

    toEdit(comment) {
        this.navCtrl.push('NewCommentPage', {comment: comment, post_id: comment.post_id})
    }

    getFullName() {
        return `${this.profile.first_name} ${this.profile.last_name}`;
    }
}
