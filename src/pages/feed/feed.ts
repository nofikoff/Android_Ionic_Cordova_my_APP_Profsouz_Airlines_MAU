import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, Events} from 'ionic-angular';
import {Clipboard} from "@ionic-native/clipboard";
import {Api, Flash, Pages} from "../../providers";


@IonicPage()
@Component({
    selector: 'page-feed',
    templateUrl: 'feed.html',
})
export class FeedPage implements OnInit {

    users: any[] = [];
    branches: any[] = [];
    posts: any[] = [];
    pages: Pages;
    branch: any = null;
    search: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                public events: Events,
                public actionSheetCtrl: ActionSheetController) {
        this.pages = new Pages(api, 'posts');
        this.events.subscribe('posts:delete', (id) => {
            this.posts = this.posts.filter((val: any) => {
                return val.id !== id;
            });
        });
    }

    ngOnInit(): void {
        this.getBranches();
    }

    ionViewDidLoad() {
        this.search = document.getElementById('search-panel').querySelector('input');

        this.search.addEventListener('blur', () => {
            this.toggleSearch();
        });

        this.search.addEventListener('input', () => {
            if (this.search.value.length) {
                this.api.get(`search?search=${this.search.value}`).subscribe((res: any) => {
                    this.posts = res.data;
                });
            } else {
                this.refreshPosts();
            }
        })

        this.events.subscribe('BRANCHES:UPDATE', _ => {
            this.getBranches();
        })
    }

    ionViewWillEnter() {
        this.branch = null;
        this.users = [];
        this.refreshPosts(null, true);
    }

    doRefresh(refresher) {
        if (this.search.value.length) {
            refresher.complete();
            return;
        }

        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(() => {
            refresher.complete();
        });
    }

    getNextPage(infiniteScroll) {
        if (this.search.value.length) {
            infiniteScroll.complete();
            return;
        }

        this.getPosts().then(() => {
            infiniteScroll.complete();
        })
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    refreshPosts(url: string = null, forced: boolean = false) {
        if (this.posts.length || forced) {
            this.pages.refreshPages(url);
            this.posts = [];
            this.getPosts();
        }
        if (this.branch !== null) {
            this.api.get('users/branch/' + this.branch.alias).subscribe((ctx: any) => {
                this.users = ctx.data
            })
        } else {
            this.users = []
        }
    }

    getPosts() {
        return this.pages.get().then((data: any) => {
            this.posts = data;
        });
    }

    getBranches() {
        this.api.get('posts/branch').subscribe((res: any) => {
            this.branches = res.data;
        });
    }

    openPage(name: string, data: object) {
        this.navCtrl.push(name, data);
    }

    toggleSearch() {
        let searchPanel = document.getElementById('search-panel');
        let panelActive = searchPanel.classList.contains('active');

        if (panelActive) {
            this.changeSearch(false);
            searchPanel.classList.remove('active');
        } else {
            this.changeSearch(true);
            searchPanel.classList.add('active');
            searchPanel.querySelector('input').focus();
        }
    }

    changeSearch(disable: boolean) {
        Array.from(document.getElementsByClassName('search-hide')).forEach((v: any) => {
            v.hidden = disable;
        });
    }

    filterActionSheet() {
        let buttons: {}[] = this.branches.map(value => {
            let text = value.none_read_posts_count ? `${value.name} (${value.none_read_posts_count})` : value.name;
            return {
                text: text,
                handler: () => {
                    this.branch = value;
                    this.refreshPosts(`posts/branch/${value.alias}`)
                }
            };
        });

        buttons.push({text: 'Отменить', role: 'cancel'});

        const actionSheet = this.actionSheetCtrl.create({
            title: 'Выберите ветку для отображения',
            buttons: buttons
        });

        actionSheet.present();
    }
}
