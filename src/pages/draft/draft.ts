import {Component, OnInit} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Pages, Api, Flash} from "../../providers";
import {Clipboard} from "@ionic-native/clipboard";


@IonicPage()
@Component({
    selector: 'page-draft',
    templateUrl: 'draft.html',
})
export class DraftPage implements OnInit {

    pages: Pages;
    posts: any = [];

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                public actionSheetCtrl: ActionSheetController,
                public navParams: NavParams) {
        this.pages = new Pages(api, 'posts/my?status=draft');
    }

    ngOnInit(): void {
        this.getPosts();
    }

    ionViewWillEnter() {
        this.refreshPosts();
    }

    doRefresh(refresher) {
        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(() => {
            refresher.complete();
        });
    }

    getNextPage(infiniteScroll) {
        this.getPosts().then(() => {
            infiniteScroll.complete();
        })
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    refreshPosts() {
        if (this.posts.length) {
            this.pages.refreshPages();
            this.posts = [];
            this.getPosts();
        }
    }

    getPosts() {
        return this.pages.get().then((data: any) => {
            this.posts = data;
        });
    }

    feedActionSheet(post: any) {

        let buttons = [
            {
                text: 'Редактировать',
                handler: () => {
                    this.editPost(post)
                }
            },
            {
                text: 'Скопировать ссылку',
                handler: () => {
                    this.copyLink(post)
                }
            },
            {
                text: 'Удалить',
                handler: () => {
                    this.deletePost(post)
                }
            },
            {
                text: 'Отменить',
                role: 'cancel',
                handler: () => {
                    return
                }
            }
        ];


        const actionSheet = this.actionSheetCtrl.create({
            title: 'Что сделать с записью',
            buttons: buttons.filter((v) => {
                switch (v.text) {
                    case 'Редактировать':
                        return post.editable;
                    case 'Удалить':
                        return post.deletable;
                    default:
                        return true;
                }
            })
        });

        actionSheet.present();
    }

    deletePost(post: any) {
        this.api.delete(`posts/${post.id}`).subscribe((res: any) => {
            if (res.success) {
                this.posts = this.posts.filter((val) => {
                    return val.id !== post.id;
                });

                this.flash.push('Пост успешно удален');
            }
        }, (err: any) => {
            console.log(err);
        })
    }

    editPost(post: any) {
        let page = 'NewPostPage';

        switch (post.type) {
            case 'default':
                page = 'NewPostPage';
                break;
            case 'question':
                page = 'NewVotePage';
                break;
            case 'finn_help':
                page = 'MoneyHelpPage';
                break;
            default:
                page = 'NewPostPage';
                break;
        }

        this.navCtrl.push(page, {post: post});
    }

    copyLink(post: any) {
        this.clipboard.copy(`${post.id}`);
    }

}
