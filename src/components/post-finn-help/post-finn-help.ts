import {Component} from '@angular/core';
import {ActionSheetController, Events, NavController, Platform} from "ionic-angular";
import {Api, User} from "../../providers";
import {Flash} from "../../providers";
import {Clipboard} from "@ionic-native/clipboard";
import {Transfer} from "@ionic-native/transfer";
import {File} from '@ionic-native/file';

@Component({
    selector: 'post-finn-help',
    templateUrl: 'post-finn-help.html',
    providers: [File]
})
export class PostFinnHelpComponent {

    text: string;
    storageDirectory: string = '';
    item: any;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                public events: Events,
                public transfer: Transfer,
                public user: User,
                private file: File,
                public platform: Platform,
                public actionSheetCtrl: ActionSheetController
    ) {
        this.platform.ready().then(() => {
            if (this.platform.is('ios')) {
                this.storageDirectory = this.file.documentsDirectory;
            }
            else if (this.platform.is('android')) {
                this.storageDirectory = this.file.externalRootDirectory + '/Download/';
            }
        })
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
                this.events.publish('posts:delete', post.id);
                this.flash.push('Пост успешно удален');
            }
        }, (err: any) => {
            console.log(err);
        })
    }

    editPost(post: any) {
        this.navCtrl.push('MoneyHelpPage', {post: post});
    }

    copyLink(post: any) {
        this.clipboard.copy(post.link);
    }

    downloadPdf(fileUrl: string) {
        this.api.download('posts/pdf/' + fileUrl);
    }

    downloadAttachment(fileUrl: string) {
        this.api.download('posts/attachment/' + fileUrl);
    }

    toPost(post: any) {
        this.navCtrl.push('MoneyHelpItemPage', {post: post});
    }

    toPostComments(post: any) {
        this.navCtrl.push('PostCommentPage', {post: post});
    }

    toProfile(post: any) {
        this.navCtrl.push('ProfilePage', {user: post.user_id});
    }

}
