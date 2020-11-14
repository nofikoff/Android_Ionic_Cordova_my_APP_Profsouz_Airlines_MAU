import {Component} from '@angular/core';
import {Api, Flash} from "../../providers";
import {ActionSheetController, Events} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the SystemPostsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'system-posts',
    templateUrl: 'system-posts.html'
})
export class SystemPostsComponent {

    posts: any = [];

    loader;

    constructor(public events: Events,
                public api: Api,
                public flash: Flash,
                public translate: TranslateService,
                public actionSheetCtrl: ActionSheetController,
                ) {
        this.load();
    }

    feedActionSheet(id: any) {

        this.translate.get(['WHAT_DO_IN_POST', 'DELETE', 'CANCEL']).subscribe(values => {
            const actionSheet = this.actionSheetCtrl.create({
                title: values['WHAT_DO_IN_POST'],
                buttons: [
                    {
                        text: values['DELETE'],
                        handler: () => {
                            this.destroy(id)
                        }
                    },
                    {
                        text: values['CANCEL'],
                        role: 'cancel',
                        handler: () => {
                            return
                        }
                    }
                ]
            });

            actionSheet.present();
        });

    }

    load() {
        this.events.publish('loading_start');
        this.api.get('system-posts').subscribe((res) => {
            this.posts = res.data;
            this.events.publish('loading_end');
        }, () => {
            this.events.publish('loading_end');
        })
    }

    destroy(id) {
        this.events.publish('loading_start');
        this.api.delete(`system-posts/${id}`).subscribe(() => {
            this.events.publish('loading_end');
            this.successDestroy();
            this.load();
        }, () => {
            this.events.publish('loading_end');
        });
    }

    successDestroy() {
        console.log('destroy');
        this.translate.get('SUCCESSFULLY_DELETED').subscribe((value) => {
            this.flash.push(value);
        });
    }

}
