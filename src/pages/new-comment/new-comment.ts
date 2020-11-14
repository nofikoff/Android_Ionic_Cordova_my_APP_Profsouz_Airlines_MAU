import {Component, OnInit} from '@angular/core';
import {ActionSheetController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Api, Flash, User} from '../../providers';
import {Platform} from 'ionic-angular';
import {iUser} from "../../providers/user/user";
import {FormControl, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector: 'page-new-comment',
    templateUrl: 'new-comment.html',
})
export class NewCommentPage implements OnInit {

    private form: FormGroup;

    private _user: iUser;

    private _token: string;

    public attachments: any = [];

    private post_id: number;

    private errors: any = {};

    private api_url: string;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public user: User,
                public formBuilder: FormBuilder,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public translateService: TranslateService,
                public plt: Platform,
                public navParams: NavParams) {
        let parent = this.navParams.get('parent_id');
        this.post_id = this.navParams.get('post_id');
        let comment = this.navParams.data.hasOwnProperty('comment') ? this.navParams.get('comment') : false;

        this.api_url = comment ? `posts/${this.post_id}/comments/${comment.id}` : `posts/${this.post_id}/comments`;

        this.form = this.formBuilder.group({
            text: new FormControl(comment.text, Validators.compose([
                Validators.required,
                Validators.maxLength(3000),
            ])),
            parent_id: new FormControl(parent ? parent : 0, Validators.required),
            attachments: this.attachments
        });
    }

    ngOnInit(): void {
        this.user.getUser().subscribe(user => {
            this._user = user
        });
        this.user.getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    submit() {
        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.api_url, {
                text: this.form.value.text,
                parent_id: this.form.value.parent_id,
                Authorization: `Bearer ${this._token}`
            }).subscribe(() => {
                this.flash.push('Вы успешно добавили комментарий');
                loader.dismiss();
                this.navCtrl.pop();
            }, (err) => {
                this.errors = err.error.errors;

                for (let err in this.errors) {
                    if (this.errors.hasOwnProperty(err)) {
                        this.flash.push(this.errors[err]);
                    }
                }
                loader.dismiss();
            })

            return;
        }

        this.api.file(this.api_url, {
            text: this.form.value.text,
            parent_id: this.form.value.parent_id,
            Authorization: `Bearer ${this._token}`
        }, 'image', this.form.value.attachments[0]).then(() => {
            this.flash.push('Вы успешно добавили комментарий');
            loader.dismiss();
            this.navCtrl.pop();
        }, (err) => {
            this.errors = err.error.errors;

            for (let err in this.errors) {
                if (this.errors.hasOwnProperty(err)) {
                    this.flash.push(this.errors[err]);
                }
            }
            loader.dismiss();
        })
    }

    isError(name) {
        return this.errors.hasOwnProperty(name);
    }
}
