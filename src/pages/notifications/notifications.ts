import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {Api, Pages, Flash} from "../../providers"


@IonicPage()
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html',
})
export class NotificationsPage implements OnInit {

    notifications: any[] = [];

    private _pages: Pages;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public events: Events,
                public flash: Flash) {
        this._pages = new Pages(api, 'notifications');
    }

    ngOnInit(): void {
        this.getNotifications();
    }

    ionViewWillEnter() {
        this.refreshPages();
    }

    doRefresh(refresher) {
        this._pages.refreshPages();
        this.notifications = [];
        this.getNotifications().then(() => {
            refresher.complete();
        });
    }

    getNextPage(infiniteScroll) {
        this.getNotifications().then(() => {
            this.events.publish('notifications:change');
            infiniteScroll.complete();
        });
    }

    getNotifications() {
        return this._pages.get().then((data: any) => {
            this.notifications = data;
            this.events.publish('notifications:change');
        });
    }

    refreshPages() {
        if (this.notifications.length !== 0) {
            this._pages.refreshPages();
            this.notifications = [];
            this.getNotifications();
        }
    }

    hasMorePages() {
        return this._pages.hasMorePages();
    }

    goToEvent(item: any) {
        switch (item.entity_type) {
            case 'user':
                this.navCtrl.push('ProfilePage', {user: item.entity_id});
                break;
            case 'document':
                this.downloadDocument(item.entity_id);
                break;
            case 'post':
                this.api.get('posts/' + item.entity_id).subscribe((res: any) => {
                    this.goToPost(res.data)
                });
                break;
            case 'question':
                this.api.get('posts/' + item.entity_id).subscribe((res: any) => {
                    this.goToPost(res.data)
                });
                break;
            case 'comment':
                this.api.get('comment/' + item.entity_id).subscribe((res: any) => {
                  res.data.id = res.data.post_id;
                  this.navCtrl.push('PostCommentPage', {post: res.data})
                });
                break;
        }
    }

    goToPost(post: any) {
        let page = 'PostDetailPage';

        switch (post.type) {
            case 'default':
                page = 'PostDetailPage';
                break;
            case 'question':
                page = post.question.user_option_id ? 'VoteResultPage' : 'VotePage';
                break;
            case 'finn_help':
                page = 'MoneyHelpItemPage';
                break;
            default:
                page = 'PostDetailPage';
                break;
        }

        this.navCtrl.push(page, {post: post});
    }

    deleteNotification(id: number) {
        this.api.delete(`notifications/${id}`).subscribe((res: any) => {
            if (res.success) {
                this.notifications = this.notifications.filter((val) => {
                    return val.id !== id;
                });
                this.flash.push('Уведомление успешно удалено.');
            } else {
                this.flash.push('Ошибка удаления')
            }
        });
    }

    downloadDocument(document) {
        this.api.download(this.getDocumentUrl(document))
    }

    getDocumentUrl(document) {
        return 'documents/download/' + document;
    }
}
