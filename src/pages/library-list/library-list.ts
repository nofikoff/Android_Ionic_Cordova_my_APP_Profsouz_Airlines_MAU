import {Component, OnInit} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Pages, Api, Flash} from "../../providers"
import {Clipboard} from "@ionic-native/clipboard";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector: 'page-library-list',
    templateUrl: 'library-list.html',
})
export class LibraryListPage implements OnInit {

    documents: any[] = [];

    branch: any;

    search: string = '';
    searchTimer: any;

    pages: Pages;

    constructor(
        public navCtrl: NavController,
        public api: Api,
        public navParams: NavParams,
        public clipboard: Clipboard,
        public translateService: TranslateService,
        public flash: Flash,
        public events: Events
    ) {
        this.loadDocuments();
    }

    loadDocuments() {

        return new Promise(resolve => {
            if (this.navParams.data.hasOwnProperty('branch')) {
                this.pages = new Pages(this.api, 'documents/branch/' + this.navParams.data.branch.alias, 'GET', {search: this.search});
                this.branch = this.navParams.data.branch;
                resolve();
            } else {
                this.pages = new Pages(this.api, 'documents');
                resolve();
            }
        });

    }

    ngOnInit() {
        this.getDocuments();
    }

    searching() {

        if(this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(() => {
            this.loadDocuments().then(_ => {
                this.getDocuments();
            });
        }, 1000)

    }

    doRefresh(refresher) {
        this.pages.refreshPages();
        this.documents = [];
        this.getDocuments().then(() => {
            refresher.complete();
        });
    }

    ionViewWillEnter() {
        this.refreshDocuments();
    }

    getNextPage(infiniteScroll) {
        this.getDocuments().then(() => {
            infiniteScroll.complete();
        })
    }

    getDocuments() {
        this.events.publish('loading_start');
        return this.pages.get().then((data: any) => {
            this.events.publish('loading_end');
            this.documents = data;
        }, _ => {
            this.events.publish('loading_end');
        });
    }

    hasMorePages() {
        return this.pages.hasMorePages();
    }

    refreshDocuments() {
        if (this.documents.length !== 0) {
            this.pages.refreshPages();
            this.documents = [];
            this.getDocuments();
        }
    }

    downloadDocument(document) {
        this.api.download(this.getDocumentUrl(document))
        // window.open(document.link, '_system');
    }


    startCopyLink(document) {
        this.clipboard.copy(this.api.getFullUrl(this.getDocumentUrl(document)).replace('/api', ''));
        this.translateService.get('SUCCESS_COPY').subscribe((value) => {
            this.flash.push(value);
        });
    }

    getDocumentUrl(document) {
        return 'documents/download/' + document;
    }

    openNewLibrary() {
        this.navCtrl.push('LibraryAddPage', {branch_id: this.branch.id});
    }
}
