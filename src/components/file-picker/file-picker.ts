import {Component, Input, forwardRef} from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheetController, AlertController, Platform} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms'

/**
 * Generated class for the FilePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'file-picker',
    templateUrl: 'file-picker.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FilePickerComponent), multi: true}
    ]
})
export class FilePickerComponent implements ControlValueAccessor {
    propagateChange: any = () => {
    };
    onTouched: any = () => {
    };
    private imagePicker: any;
    private cameraConfirmTrans: any = {
        title: '',
        message: '',
        success: '',
        cancel: ''
    };
    @Input('files') _files: any = [];
    @Input('onlyImage') onlyImage: boolean = false;
    @Input('multiple') multiple: boolean = true;

    constructor(public camera: Camera,
                public plt: Platform,
                public actionSheetCtrl: ActionSheetController,
                public translateService: TranslateService,
                private alertCtrl: AlertController) {
        this.initImagePickerTranslate();
        this.initCameraConfirmTrans();
    }

    writeValue(value) {
        if (value) {
            this._files = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    setDisabledState() {
    };

    initCameraConfirmTrans() {
        this.translateService.get(['CAMERA_CONFIRM_TITLE', 'CAMERA_CONFIRM_MESSAGE', 'CAMERA_CONFIRM_SUCCESS', 'CAMERA_CONFIRM_CANCEL']).subscribe((value) => {
            this.cameraConfirmTrans.title = value['CAMERA_CONFIRM_TITLE'];
            this.cameraConfirmTrans.message = value['CAMERA_CONFIRM_MESSAGE'];
            this.cameraConfirmTrans.success = value['CAMERA_CONFIRM_SUCCESS'];
            this.cameraConfirmTrans.cancel = value['CAMERA_CONFIRM_CANCEL'];
        });
    }

    initImagePickerTranslate() {
        this.translateService.get('IMAGE_PICKER').subscribe((value) => {
            this.imagePicker = value;
        });
    }

    addFile(url) {
        this._files.push(url);
        this.propagateChange(this._files);
    }

    removeFile(index) {
        this._files.splice(index, 1);
        this.propagateChange(this._files);
    }

    getFile(source) {
        let destination = this.camera.DestinationType.FILE_URI;

        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI
        }

        const options: CameraOptions = {
            quality: 100,
            destinationType: destination,
            sourceType: source,
            mediaType: this.onlyImage ? this.camera.MediaType.PICTURE : this.camera.MediaType.ALLMEDIA
        };

        this.camera.getPicture(options).then((imageData) => {
            this.addFile(imageData);
        }, (err) => {
            console.log(err);
        });
    }

    filterActionSheet() {

        if (!this.onlyImage) {
            this.getFile(this.camera.PictureSourceType.PHOTOLIBRARY);
        } else {

            let buttons: {}[] = [
                {
                    text: this.imagePicker.CAMERA,
                    handler: () => {
                        return this.confirmCamera().then(_ => {
                            this.getFile(this.camera.PictureSourceType.CAMERA);
                        }).catch( _ => {
                            return false;
                        });
                    }
                },
                {
                    text: this.imagePicker.GALLERY,
                    handler: () => {
                        this.getFile(this.camera.PictureSourceType.PHOTOLIBRARY);
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


    getFileName(url) {
        let uri = url.split("/").pop();

        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }

        return uri;
    }
}
