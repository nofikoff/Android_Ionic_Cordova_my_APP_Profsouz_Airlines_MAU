import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api} from "../../providers";
import {Contacts, Contact, ContactField, ContactName} from '@ionic-native/contacts';


/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-contacts',
    templateUrl: 'contacts.html',
})
export class ContactsPage {
    users: any[] = [];

    search: string = '';
    searchTimer: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public events: Events,
                private contacts: Contacts) {
        this.getContacts();
    }

    getContacts() {
        this.events.publish('loading_start');
        this.api.get('users/contacts', {search: this.search}).subscribe((res: any) => {
            this.users = res.data;
            this.events.publish('loading_end');
        }, _ => {
            this.events.publish('loading_end');
        })
    }

    searching() {

        if(this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(() => {
            this.getContacts();
        }, 1000)

    }

    addToContact(user: any) {
        let contact: Contact = this.contacts.create();

        contact.name = new ContactName(null, user.last_name, user.first_name);
        contact.phoneNumbers = [new ContactField('mobile', user.phone)];
        contact.save().then(
            () => console.log('Contact saved!', contact),
            (error: any) => console.error('Error saving contact.', error)
        );
    }

    formatPhone(phone: string) {
        let pattern = "+##(###)### ## ##";

        let i = 0,
            v = phone.toString();
        return pattern.replace(/#/g, _ => v[i++]);
    }

    toProfile(user: any) {
        this.navCtrl.push('ProfilePage', {user: user.id});
    }
}
