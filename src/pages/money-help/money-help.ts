import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {Api, Flash, User} from "../../providers";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector: 'page-money-help',
    templateUrl: 'money-help.html',
})
export class MoneyHelpPage implements OnInit {
    form: FormGroup;

    private _token: string;

    submited: boolean = false;

    public attachments: any = [];

    url: string;

    finn_types: any[] = [];
    info_statuses: any[] = [];
    
    post: any;

    constructor(public navCtrl: NavController,
                public formBuilder: FormBuilder,
                public api: Api,
                public flash: Flash,
                public loadingCtrl: LoadingController,
                private user: User,
                public plt: Platform,
                public navParams: NavParams,
                public translateService: TranslateService
                ) {
        this.post = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;

        this.url = this.post ? 'posts/' + this.post.id : 'posts';

        this.form = this.formBuilder.group({
            title: new FormControl(this.post ? this.post.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            info_status_id: new FormControl(this.post ? this.post.info_status_id : ''),
            log_comment: new FormControl(''),
            body: new FormControl(this.post ? String(this.post.body ? this.post.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),

            pdf_passport_seria: new FormControl(this.post ? this.post.financial_info.pdf_passport_seria : '', Validators.required),
            pdf_passport_code: new FormControl(this.post ? this.post.financial_info.pdf_passport_code : '', Validators.required),
            pdf_extradited: new FormControl(this.post ? this.post.financial_info.pdf_extradited : '', Validators.required),
            pdf_identification: new FormControl(this.post ? this.post.financial_info.pdf_identification : '', Validators.required),
            pdf_card: new FormControl(this.post ? this.post.financial_info.pdf_card : '', Validators.required),
            pdf_bank: new FormControl(this.post ? this.post.financial_info.pdf_bank : '', Validators.required),
            pdf_rr: new FormControl(this.post ? this.post.financial_info.pdf_rr : '', Validators.required),
            pdf_mfo: new FormControl(this.post ? this.post.financial_info.pdf_mfo : '', Validators.required),
            pdf_edrpoy: new FormControl(this.post ? this.post.financial_info.pdf_edrpoy : '', Validators.required),
            attachments:  this.attachments
        });
    }

    ngOnInit(): void {
        this.api.get('financial/types').subscribe((ctx: any) => {
            this.finn_types = ctx.data
        });

        if (this.post) {
            this.api.get('posts/info_statuses').subscribe((ctx: any) => {
                this.info_statuses = ctx.data
            });
        }

        this.user.getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
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

    storeFinnHelp() {
        this.submited = true;

        if (!this.form.valid) {
            this.flash.push('Заполните все поля!');

            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.url, {
                branch_id: 2,
                importance: 1,
                title: this.form.value.title,
                info_status_id: this.form.value.info_status_id,
                log_comment: this.form.value.log_comment,
                type: 'finn_help',
                status: 'published',

                pdf_rr: this.form.value.pdf_rr,
                pdf_mfo: this.form.value.pdf_mfo,
                pdf_card: this.form.value.pdf_card,
                pdf_bank: this.form.value.pdf_bank,
                pdf_edrpoy: this.form.value.pdf_edrpoy,
                pdf_extradited: this.form.value.pdf_extradited,
                pdf_passport_code: this.form.value.pdf_passport_code,
                pdf_passport_seria: this.form.value.pdf_passport_seria,
                pdf_identification: this.form.value.pdf_identification,
            }).subscribe(() => {
                this.translateService.get(this.post ? 'SUCCESS_UPDATE_FINN_HELP' : 'SUCCESS_CREATE_FINN_HELP').subscribe((value) => {
                    this.flash.push(value);
                });
                loader.dismiss();
                this.navCtrl.pop();
                this.submited = false;
            }, () => {
                this.flash.push('Ошибка! Повторите попытку!');
                loader.dismiss();
            })

            return;
        }

        this.api.multipleFiles(this.url, {
            branch_id: 2,
            importance: 1,
            title: this.form.value.title,
            info_status_id: this.form.value.info_status_id,
            type: 'finn_help',
            status: 'published',

            pdf_rr: this.form.value.pdf_rr,
            pdf_mfo: this.form.value.pdf_mfo,
            pdf_card: this.form.value.pdf_card,
            pdf_bank: this.form.value.pdf_bank,
            pdf_edrpoy: this.form.value.pdf_edrpoy,
            pdf_extradited: this.form.value.pdf_extradited,
            pdf_passport_code: this.form.value.pdf_passport_code,
            pdf_passport_seria: this.form.value.pdf_passport_seria,
            pdf_identification: this.form.value.pdf_identification,
            Authorization: `Bearer ${this._token}`
        }, 'attachments', this.form.value.attachments, !this.post).then(() => {
            this.translateService.get(this.post ? 'SUCCESS_UPDATE_FINN_HELP' : 'SUCCESS_CREATE_FINN_HELP').subscribe((value) => {
                this.flash.push(value);
            });
            loader.dismiss();
            this.navCtrl.pop();
            this.submited = false;
        }, (err:any) => {
            console.log(err);
            this.flash.push('Ошибка! Повторите попытку!');
            loader.dismiss();
        })
    }
}
