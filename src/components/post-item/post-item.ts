import {Component, Input} from '@angular/core';
import {ActionSheetController, Events, NavController} from "ionic-angular";
import {Api} from "../../providers/api/api";
import {Flash} from "../../providers/flash/flash";
import {Clipboard} from "@ionic-native/clipboard";


@Component({
    selector: 'post-item',
    templateUrl: 'post-item.html'
})
export class PostItemComponent {

    @Input() item: any;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                public events: Events,
                public actionSheetCtrl: ActionSheetController
    ) {
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
                text: 'История редактировать',
                handler: () => {
                    this.toHistory(post)
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
                this.events.publish('posts:delete', post.id);
                this.flash.push('Пост успешно удален');
            }
        }, (err: any) => {
            console.log(err);
        })
    }

    downloadAttachment(fileUrl: string) {
        this.api.download('posts/attachment/' + fileUrl);
    }

    editPost(post: any) {
        this.navCtrl.push('NewPostPage', {post: post});
    }

    toHistory(post: any) {
        this.navCtrl.push('PostHistoryPage', {post: post});
    }

    copyLink(post: any) {
        this.clipboard.copy(post.link);
    }

    toPost(post: any) {
        this.navCtrl.push('PostDetailPage', {post: post});
    }

    toPostComments(post: any) {
        this.navCtrl.push('PostCommentPage', {post: post});
    }

    toProfile(post: any) {
        this.navCtrl.push('ProfilePage', {user: post.user_id});
    }

}
