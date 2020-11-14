import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';


@Component({
    selector: 'comments',
    templateUrl: 'comments.html'
})
export class CommentsComponent {

    @Input('comments') comments: Array<Object>;
    @Input('reply_disabled') reply_disabled: boolean = false;
    constructor(public navCtrl: NavController) {
    }

    reply(comment: any) {
        this.navCtrl.push('NewCommentPage', {
            post_id: comment.post_id,
            parent_id: comment.id
        });
    }

    toProfile(comment: any) {
        this.navCtrl.push('ProfilePage', {user: comment.user_id});
    }

    toEdit(comment) {
        this.navCtrl.push('NewCommentPage', {comment: comment, post_id: comment.post_id})
    }

}
