import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {Api, Flash, User} from '../../providers';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@IonicPage()
@Component({
    selector: 'page-new-vote',
    templateUrl: 'new-vote.html',
})
export class NewVotePage implements OnInit {

    private branches: any[] = [];

    private form: FormGroup;

    private submitted: boolean = false;

    public attachments: any = [];
    info_statuses: any[] = [];
    public files: any = [];

    private _token: string;

    private options: any = [];

    private isEdit: boolean = false;

    private apiUrl: string = 'posts';
    static readonly postType: string = 'question';

    constructor(public navCtrl: NavController,
                public api: Api,
                public user: User,
                public formBuilder: FormBuilder,
                public loadingCtrl: LoadingController,
                public plt: Platform,
                public flash: Flash,
                public navParams: NavParams) {
        let vote = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;

        this.isEdit = this.navParams.data.hasOwnProperty('post');

        this.apiUrl = vote ? `posts/${vote.id}` : `posts`;

        this.form = this.formBuilder.group({
            title: new FormControl(vote ? vote.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            branch_id: new FormControl(vote ? vote.branch_id : null, Validators.required),
            type: new FormControl(NewVotePage.postType, Validators.required),
            body: new FormControl(vote ? String(vote.body ? vote.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),
            sms_notify: new FormControl(vote ? vote.sms_notify : false),
            expiration_at: new FormControl(vote ? new Date(vote.question.expiration) : null),
            options: this.formBuilder.array(this.options),
            attachments:  this.files,
            log_comment: new FormControl(''),
            info_status_id: new FormControl(vote ? vote.info_status_id : ''),
        });

        if (vote) {
            this.attachments = vote.attachments;
            this.api.get('posts/' + vote.id).subscribe((res: any) => {
                this.options = res.data.question.options.map((option) => {
                    return this.addOption(option.name);
                });
            })
        }
    }

    ngOnInit(): void {
        this.getAccessBranches();
        this.user.getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });

        if (this.isEdit) {
            this.api.get('posts/info_statuses').subscribe((ctx: any) => {
                this.info_statuses = ctx.data
            });
        }
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    getAccessBranches() {
        this.api.get('users/branch/access').subscribe((res: any) => {
            this.branches = res.data;
            this.setDefaultBranchId();
        });
    }

    createOption(value = '') {
        return this.formBuilder.group({
            value: value
        });
    }

    setDefaultBranchId() {
        if(this.branches.length && !this.form.value.branch_id) {
            this.form.controls['branch_id'].setValue(this.branches[0].id)
        }
    }

    addOption(value = '') {
        this.options = this.form.get('options') as FormArray;
        this.options.push(this.createOption(value));
    }

    deleteOption(i: number) {
        this.options = this.form.get('options') as FormArray;
        this.options.removeAt(i);
    }

    removeFile(fileId) {
        this.api.delete('posts/attachment/' + fileId).subscribe(() => {
            this.attachments = this.attachments.filter((file) => {
                return file.id != fileId;
            })
        });
    }

    submit(status: string = 'published') {
        console.log(this.form.value.options);
        this.submitted = true;

        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Сохраняем голосование..."
        });
        loader.present();

        let data = {
            type: NewVotePage.postType,
            status: status,
            title: this.form.value.title,
            branch_id: this.form.value.branch_id,
            body: this.form.value.body,
            log_comment: this.form.value.log_comment,
            info_status_id: this.form.value.info_status_id,
            sms_notify: this.form.value.sms_notify ? 1 : 0,
            options: this.form.value.options.map((item) => {
                return item.value.length > 0 ? item.value : null;
            }).join(','),
            expiration_at: new Date(this.form.value.expiration_at)
                .toISOString()
                .split('.')[0]
                .replace('T', ' '),
        };

        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.apiUrl, data).subscribe((res: any) => {
                if (res.success) {
                    this.flash.push(status == 'published' ? 'Вы успешно создали голосование' : 'Вы отправили голосование в черновики');
                    this.navCtrl.push('MorePage');
                }
                this.submitted = false;
                loader.dismiss();
            }, () => {
                this.flash.push('Исправьте ошибки в подсвеченных полях');
                this.submitted = false;
                loader.dismiss();
            });

            return;
        }

        this.api.file(this.apiUrl, Object.assign({
            Authorization: `Bearer ${this._token}`,
        }, data), 'attachments', this.form.value.attachments[0]).then(() => {
            this.flash.push(status == 'published' ? 'Вы успешно создали голосование' : 'Вы отправили голосование в черновики');
            this.navCtrl.push('MorePage');
            this.submitted = false;
            loader.dismiss();
        }, () => {
            this.flash.push('Исправьте ошибки в подсвеченных полях');
            this.submitted = false;
            loader.dismiss();
        })
    }
}
