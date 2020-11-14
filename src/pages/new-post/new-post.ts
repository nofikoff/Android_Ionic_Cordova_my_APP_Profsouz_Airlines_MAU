import {Component, OnInit} from '@angular/core';
import {ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {FormControl, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Flash, Api, User} from "../../providers";
import {iUser} from "../../providers/user/user";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-new-post',
    templateUrl: 'new-post.html'
})
export class NewPostPage implements OnInit {

    private form: FormGroup;

    private _user: iUser;

    public post: any;

    public attachments: any = [];
    info_statuses: any[] = [];
    branches: any[] = [];

    private apiUrl: string;

    private submitted: boolean = false;

    static readonly postType: string = 'default';

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public user: User,
                public formBuilder: FormBuilder,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public plt: Platform,
                public actionSheetCtrl: ActionSheetController,
                public navParams: NavParams) {
        let post = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;

        this.post = post;

        this.apiUrl = post ? `posts/${post.id}` : `posts`;

        this.form = this.formBuilder.group({
            title: new FormControl(post ? post.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            branch_id: new FormControl(post ? post.branch_id : null, Validators.required),
            type: new FormControl(NewPostPage.postType, Validators.required),
            body: new FormControl(post ? String(post.body ? post.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),
            is_commented: new FormControl(post ? post.is_commented : true),
            sms_notify: new FormControl(post ? post.sms_notify : false),
            log_comment: new FormControl(''),
            info_status_id: new FormControl(post ? post.info_status_id : ''),
            attachments:  this.attachments
        });
    }

    ngOnInit(): void {
        this.user.getUser().subscribe(user => {
            this._user = user
        });
        if (this.post) {
            this.api.get('posts/info_statuses').subscribe((ctx: any) => {
                this.info_statuses = ctx.data
            });
        }
        this.getAccessBranches();
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    removeFile(fileId) {
        this.api.delete('posts/attachment/' + fileId).subscribe(() => {
            this.post.attachments = this.post.attachments.filter((file) => {
                return file.id != fileId;
            })
        });
    }

    getAccessBranches() {
        this.api.get('users/branch/access').subscribe((res: any) => {
            this.branches = res.data;
            this.setDefaultBranchId();
        });
    }

    setDefaultBranchId() {
        if(this.branches.length && !this.form.value.branch_id) {
            this.form.controls['branch_id'].setValue(this.branches[0].id)
        }
    }


    submit(status: string = 'published') {
        this.submitted = true;

        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.apiUrl, Object.assign({
                type: NewPostPage.postType,
                status: status
            }, this.form.value)).subscribe((res: any) => {
                if (res.success) {
                    this.flash.push('Вы успешно создали пост.');
                    this.navCtrl.pop();
                }
                this.submitted = false;
                loader.dismiss();
            }, () => {
                this.flash.push('Ошибка создания поста.');
                this.submitted = false;
                loader.dismiss();
            });

            return;
        }

        let data = {
            type: NewPostPage.postType,
            status: status,
            title: this.form.value.title,
            branch_id: this.form.value.branch_id,
            body: this.form.value.body,
            log_comment: this.form.value.log_comment,
            info_status_id: this.form.value.info_status_id,
            Authorization: `Bearer ${this._user.access_token}`,
            is_commented: this.form.value.is_commented ? 1 : 0,
            sms_notify: this.form.value.sms_notify ? 1 : 0,
        };


        this.api.multipleFiles(this.apiUrl, data, 'attachments', this.form.value.attachments, !this.post).then(() => {
            this.flash.push('Вы успешно создали пост.');
            this.navCtrl.pop();
            this.submitted = false;
            loader.dismiss();
        }, () => {
            this.submitted = false;
            loader.dismiss();
        });
    }
}
