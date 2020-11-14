import {Component, OnInit} from '@angular/core';
import {
    IonicPage, NavController, NavParams, LoadingController, ActionSheetController, Events,
    AlertController
} from 'ionic-angular';
import {FormControl, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Platform} from 'ionic-angular';
import {Api, User, Flash} from '../../providers';
import {iProfile} from "../../providers/user/user";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit {

    private form: FormGroup;

    private profile: iProfile;

    private _token: string;

    private submitted: boolean = false;

    private imagePicker: any;

    private cameraConfirmTrans: any = {
        title: '',
        message: '',
        success: '',
        cancel: ''
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public events: Events,
                public api: Api,
                public user: User,
                public plt: Platform,
                public camera: Camera,
                public formBuilder: FormBuilder,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public actionSheetCtrl: ActionSheetController,
                private alertCtrl: AlertController,
                public flash: Flash) {
    }

    ngOnInit(): void {
        this.user.getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
        this.user.getProfile().subscribe((profile: iProfile) => {
            this.profile = profile;
            this.form = this.formBuilder.group({
                first_name: new FormControl(this.profile.first_name, Validators.required),
                last_name: new FormControl(this.profile.last_name, Validators.required),
                phone: new FormControl(this.profile.phone, Validators.required),
                position: new FormControl(this.profile.position, Validators.required),
                birthday: new FormControl(this.profile.birthday, Validators.required),
                password: new FormControl(''),
                password_confirm: new FormControl(''),
            })
        });
        this.initCameraConfirmTrans();
    }
    updateStateProfile() {
        this.user.loadState()
    }

    ionViewWillEnter() {
        this.initImagePickerTranslate();
    }

    initImagePickerTranslate() {
        this.translateService.get('IMAGE_PICKER').subscribe((value) => {
            this.imagePicker = value;
        });
    }

    initCameraConfirmTrans() {
        this.translateService.get(['CAMERA_CONFIRM_TITLE', 'CAMERA_CONFIRM_MESSAGE', 'CAMERA_CONFIRM_SUCCESS', 'CAMERA_CONFIRM_CANCEL']).subscribe((value) => {
            this.cameraConfirmTrans.title = value['CAMERA_CONFIRM_TITLE'];
            this.cameraConfirmTrans.message = value['CAMERA_CONFIRM_MESSAGE'];
            this.cameraConfirmTrans.success = value['CAMERA_CONFIRM_SUCCESS'];
            this.cameraConfirmTrans.cancel = value['CAMERA_CONFIRM_CANCEL'];
        });
    }

    submit() {
        this.submitted = true;

        if (!this.form.valid) {
            this.flash.push('Заполните все поля');
            return;
        }

        if(this.profile.no_avatar) {
            this.translateService.get('NEED_UPLOAD_AVATAR').subscribe((value) => {
                this.flash.push(value);
            });
            return;
        }

        this.events.publish('loading_start');

        this.api.post('settings/account', this.form.value).subscribe((res: any) => {
            this.flash.push(res.message);
            this.updateProfile();
            this.submitted = false;
            this.events.publish('loading_end');
        }, () => {
            this.submitted = false;
            this.events.publish('loading_end');
        });
    }

    getImage(source) {
        let destination = this.camera.DestinationType.FILE_URI;

        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI
        }

        const options: CameraOptions = {
            quality: 100,
            destinationType: destination,
            sourceType: source,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {
            this.saveAvatar(imageData);
        }, (err) => {
            console.log(err);
        });
    }

    saveAvatar(imageURI) {
        this.events.publish('loading_start');
        this.api.file('settings/account', {
            first_name: this.form.value.first_name,
            last_name: this.form.value.last_name,
            phone: this.form.value.phone,
            Authorization: `Bearer ${this._token}`
        }, 'image', imageURI).then(() => {
            this.flash.push('Вы успешно обновили профиль.');
            this.events.publish('loading_end');
            this.navCtrl.pop();
            this.submitted = false;
            this.updateStateProfile();
        }, () => {
            this.submitted = false;
            this.events.publish('loading_end');
        })
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    updateProfile() {
        this.profile.first_name = this.form.value.first_name;
        this.profile.last_name = this.form.value.last_name;
        this.profile.phone = this.form.value.phone;
        this.profile.position = this.form.value.position;
        this.profile.birthday = this.form.value.birthday;

        this.user.updateProfile(this.profile);
    }

    filterActionSheet() {
        let buttons: {}[] = [
            {
                text: this.imagePicker.CAMERA,
                handler: () => {
                    return this.confirmCamera().then(_ => {
                        this.getImage(this.camera.PictureSourceType.CAMERA);
                    }).catch( _ => {
                        return false;
                    });
                }
            },
            {
                text: this.imagePicker.GALLERY,
                handler: () => {
                    this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }
        ];

        buttons.push({text: this.imagePicker.CANCEL, role: 'cancel'});

        const actionSheet = this.actionSheetCtrl.create({
            title: this.imagePicker.TITLE,
            buttons: buttons
        });

        actionSheet.present();
    }

    confirmCamera() {

        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: this.cameraConfirmTrans.title,
                message: this.cameraConfirmTrans.message,
                buttons: [
                    {
                        text: this.cameraConfirmTrans.cancel,
                        role: 'cancel',
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: this.cameraConfirmTrans.success,
                        handler: () => {
                            resolve();
                        }
                    }
                ]
            });
            alert.present();
        });


    }
}
