import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {Api, Flash, User} from "../../providers";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Platform} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {IOSFilePicker} from "@ionic-native/file-picker";


/**
 * Generated class for the LibraryAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-library-add',
    templateUrl: 'library-add.html',
})
export class LibraryAddPage implements OnInit {
    form: FormGroup;

    private _token: string;

    categories: any[] = [];

    submited: boolean = false;

    imageURI: any;

    notify: boolean = false;
    importance: boolean = false;

    static readonly branchUrl: string = "documents/branch";

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public navParams: NavParams,
                public formBuilder: FormBuilder,
                private camera: Camera,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public plt: Platform,
                public translateService: TranslateService,
                private user: User,
                private filePicker: IOSFilePicker
                ) {
        let defaultBranchId = this.navParams.data.hasOwnProperty('branch_id') ? this.navParams.get('branch_id') : '';
        this.form = this.formBuilder.group({
            category: new FormControl(defaultBranchId, Validators.required),
            description: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(255)
            ])),
        });
    }

    getFile() {
        if (this.plt.is('ios')) {
            this.filePicker.pickFile()
                .then(uri => this.setFile(uri))
                .catch(err => console.log('Error', err));
        } else {
            this.getDefaultFile()
        }
    }

    getDefaultFile() {

        let destination = this.camera.DestinationType.FILE_URI;

        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI
        }

        const options: CameraOptions = {
            quality: 100,
            destinationType: destination,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.ALLMEDIA
        };

        this.camera.getPicture(options).then((imageData) => {
            this.setFile(imageData);
        }, (err) => {
            console.log(err);
            this.presentToast(err);
        });
    }

    setDefaultCategory() {
        if(this.categories.length && !this.form.value.category) {
            this.form.controls['category'].setValue(this.categories[0].id)
        }
    }

    setFile(imageSoruce) {
        let uri = imageSoruce.split("/").pop();

        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }

        let extension = uri.split('.').pop();

        if(extension !== 'pdf' && extension !== 'docx'){
            this.translateService.get('FILE_LIBRARY_AVAILABLE_EXTENSION').subscribe((value) => {
                this.flash.push(value);
            });
        }else{
            this.imageURI = imageSoruce;
        }
    }



    uploadFile() {
        this.submited = true;

        if (!this.form.valid || !this.imageURI) {
            this.flash.push('Заполните все поля!');

            return;
        }

        let loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();

        if (!this.imageURI) {
            this.api.post('documents', {
                status: 'published',
                notify: this.notify,
                branch_id: this.form.value.category,
                importance: this.importance,
                description: this.form.value.description
            }).subscribe(() => {
                loader.dismiss();
                this.navCtrl.push('LibraryListPage')
            }, () => {
                loader.dismiss();
                this.flash.push('Ошибка!Повторите попытку позже!');
            });

            return;
        }

        this.api.file('documents', {
            status: 'published',
            notify: this.notify ? "true" : "false",
            branch_id: this.form.value.category,
            importance: this.importance ? "true" : "false",
            description: this.form.value.description,
            Authorization: `Bearer ${this._token}`
        }, 'file', this.imageURI).then(() => {
            loader.dismiss();
            this.navCtrl.push('LibraryListPage')
        }, (err) => {
            console.log(err);
            loader.dismiss();
            this.flash.push('Ошибка!Повторите попытку позже!');
        });
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 6000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    ngOnInit(): void {
        this.api.get(LibraryAddPage.branchUrl).subscribe((ctx: any) => {
            this.categories = ctx.data;
            this.setDefaultCategory();
        });

        this.user.getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
    }

    resetFile() {
        this.imageURI = '';
    }

    getFileName() {
        let uri = this.imageURI.split("/").pop();

        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }

        return uri;
    }

}
