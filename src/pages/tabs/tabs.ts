import {Component, AfterContentInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, Events} from 'ionic-angular';

import {Api} from "../../providers";

@IonicPage()
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage implements AfterContentInit {

    tab1Root: any = 'FeedPage';
    tab2Root: any = 'NotificationsPage';
    tab3Root: any = 'ProfilePage';
    tab4Root: any = 'MorePage';

    tab1Title = " ";
    tab2Title = " ";
    tab3Title = " ";

    unreadCount: number = 0;

    constructor(public navCtrl: NavController,
                public translateService: TranslateService,
                public api: Api,
                public events: Events) {
        translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
            this.tab1Title = values['TAB1_TITLE'];
            this.tab2Title = values['TAB2_TITLE'];
            this.tab3Title = values['TAB3_TITLE'];
        });
    }

    ngAfterContentInit(): void {
        this.getUnreadNotificationsCount();
        this.events.subscribe('notifications:change', () => {
            this.getUnreadNotificationsCount();
        })
    }

    getUnreadNotificationsCount() {
        this.api.get('notifications/unread/count').subscribe((res: any) => {
            this.unreadCount = res.count;
        })
    }
}
