import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, ActionSheetController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Api, Pages, User, Flash, iProfile} from "../../providers";
import {Clipboard} from "@ionic-native/clipboard";

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

    profile: iProfile = null;

    self: boolean;

    posts: any[] = [];

    private pages: Pages;

    url: string = 'posts/my';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public user: User,
                public flash: Flash,
                public clipboard: Clipboard,
                public storage: Storage,
                public actionSheetCtrl: ActionSheetController) {

        if (this.navParams.data.hasOwnProperty('user')) {
            this.url = 'users/' + this.navParams.get('user') + '/posts';
        }
        this.pages = new Pages(api, this.url);
    }

    ngOnInit() {
        if (this.navParams.data.hasOwnProperty('user')) {
            this.api.get('users/' + this.navParams.get('user')).subscribe((res: any) => {
                this.profile = res.data;
            });
            this.self = false;
        } else {
            this.user.getProfile().subscribe((profile) => {
                this.profile = profile;
            });
            this.self = true;
        }

        this.getPosts();
    }

    setUserConfirm(val: boolean) {
        this.api.post('users/confirm/' + this.profile.id, {
            is_confirmed: val
        }).subscribe((res: any) => {
            this.profile = res.data;
        })
    }

    ionViewWillEnter() {
        this.user.updateState();
        this.refreshPosts();
    }

    doRefresh(refresher) {
        this.user.updateState();
        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(() => {
            refresher.complete();
        });
    }

    feedActionSheet(post: number) {
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Что сделать с записью',
            buttons: [
                {
                    text: 'Редактировать',
                    handler: () => {
                        this.editPost(post)
                    }
                }, {
                    text: 'Скопировать ссылку',
                    handler: () => {
                        this.copyLink(post)
                    }
                }, {
                    text: 'Удалить',
                    handler: () => {
                        this.deletePost(post)
                    }
                }, {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: () => {
                        return
                    }
                }
            ]
        });
        actionSheet.present();
    }

    getNextPage(ionInfinite) {
        this.getPosts().then(() => {
            ionInfinite.complete();
        })
    }

    getPosts() {
        return this.pages.get().then((data: any) => {
            this.posts = data;
        });
    }

    refreshPosts() {
        if (this.posts.length) {
            this.pages.refreshPages();
            this.posts = [];
            this.getPosts();
        }
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    editProfile() {
        this.navCtrl.push('EditProfilePage', {profile: this.profile});
    }

    getFullName() {
        return `${this.profile.first_name} ${this.profile.last_name}`;
    }

    comments() {
        this.navCtrl.push('CommentsPage');
    }

    deletePost(post_id: number) {
        this.api.delete(`posts/${post_id}`).subscribe((res: any) => {
            if (res.success) {
                this.posts = this.posts.filter((val) => {
                    return val.id !== post_id;
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

    copyLink(post_id: number) {
        this.clipboard.copy(`${post_id}`);
    }

    toPost(post: any) {
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

    formatPhone(phone: string) {
        let pattern = "+##(###)### ## ##";

        let i = 0,
            v = phone.toString();
        return pattern.replace(/#/g, _ => v[i++]);
    }
}
