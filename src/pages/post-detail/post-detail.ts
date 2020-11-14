import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Api, Flash} from '../../providers'
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
    selector: 'page-post-detail',
    templateUrl: 'post-detail.html',
})
export class PostDetailPage implements OnInit {

    private post: any = null;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public flash: Flash,
                public actionSheetCtrl: ActionSheetController,
                private _sanitizer: DomSanitizer
    ) {
        this.post = this.navParams.get('post');
    }

    ngOnInit() {
        this.getPost();
    }

    doRefresh(refresher) {
        this.getPost().then(() => {
            refresher.complete();
        });
    }

    getPost() {
        return new Promise(resolve => {
            this.api.get(`posts/${this.post.id}`).subscribe((res: any) => {
                this.post = res.data;
                resolve();
            }, () => {
                resolve();
            });
        })
    }

    addComment() {
        this.navCtrl.push('NewCommentPage', {post_id: this.post.id});
    }

    feedActionSheet() {

        let buttons = [
            {
                text: 'Редактировать',
                handler: () => {
                    this.editPost()
                }
            },
            {
                text: 'История редактировать',
                handler: () => {
                    this.goHistory()
                }
            },
            {
                text: 'Скопировать ссылку',
                handler: () => {
                    this.copyLink()
                }
            },
            {
                text: 'Удалить',
                handler: () => {
                    this.deletePost()
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
                        return this.post.editable;
                    case 'Удалить':
                        return this.post.deletable;
                    default:
                        return true;
                }
            })
        });

        actionSheet.present();
    }

    deletePost() {
        this.api.delete(`posts/${this.post.id}`).subscribe((res: any) => {
            if (res.success) {
                this.flash.push('Пост успешно удален');
                this.navCtrl.pop();
            }
        }, (err: any) => {
            console.log(err);
        })
    }

    editPost() {
        this.navCtrl.push('NewPostPage', {post: this.post});
    }

    copyLink() {
        console.log('not implemented');
    }

    goHistory() {
        this.navCtrl.push('PostHistoryPage', {post: this.post});
    }

    downloadAttachment(fileUrl: string) {
        this.api.download('posts/attachment/' + fileUrl);
    }

    toPostComments(post: any) {
        this.navCtrl.push('PostCommentPage', {post: post});
    }

    getImage(image) {
        return this._sanitizer.bypassSecurityTrustStyle(image);
    }
}
