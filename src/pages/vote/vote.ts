import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Api, Flash} from '../../providers';


@IonicPage()
@Component({
    selector: 'page-vote',
    templateUrl: 'vote.html',
})
export class VotePage {

    selected: any;

    post: any = null;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public navParams: NavParams) {
        this.post = navParams.get('post');
        this.selected = this.post.question.user_option_id;
    }

    doRefresh(refresher) {
        refresher.complete();
    }

    vote() {
        if (!this.selected) {
            return;
        }

        this.api.post('posts/question/vote', {question_option_id: this.selected})
            .subscribe((res: any) => {
                if (res.success) {
                    this.flash.push('Вы успешно проголосовали.');
                    this.navCtrl.push('FeedPage');
                }
            }, (err) => {
                console.log(err);
            });
    }

    option(option: any) {
        return `${option.name} (${option.votes_count})`;
    }

    setWinner(option: any) {
        this.api.post(`posts/question/vote/action`, {
            post_id: this.post.id,
            option_id: option.id
        }).subscribe((res: any) => {
            if (res.success) {
                this.flash.push('Победитель выбран');
                this.navCtrl.pop();
            }
        }, () => {
            this.navCtrl.push('Ошибка выбора победителя, попробуйте ещё.')
        })
    }

    goHistory() {
        this.navCtrl.push('PostHistoryPage', {post: this.post});
    }

    downloadAttachment(fileUrl: string) {
        this.api.download('posts/attachment/' + fileUrl);
    }
}
