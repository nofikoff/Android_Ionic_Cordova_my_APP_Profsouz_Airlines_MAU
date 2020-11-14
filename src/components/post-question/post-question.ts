import {Component, Input, ViewChild, AfterViewInit} from '@angular/core';
import {ActionSheetController, Events, NavController} from "ionic-angular";
import {Api} from "../../providers/api/api";
import {Flash} from "../../providers/flash/flash";
import {Clipboard} from "@ionic-native/clipboard";
import {Chart} from 'chart.js';


@Component({
    selector: 'post-question',
    templateUrl: 'post-question.html'
})
export class PostQuestionComponent implements AfterViewInit {

    @Input() item: any;

    @ViewChild('barCanvas') barCanvas;

    private selected: any;

    private barChart: any;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                public events: Events,
                public actionSheetCtrl: ActionSheetController) {
    }

    ngAfterViewInit(): void {
        if (this.voted()) {
            this.initBar();
        }
    }

    initBar() {
        let options = this.item.question.options;

        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: options.map((v) => {
                    return v.name
                }),
                datasets: [{
                    data: options.map((v) => {
                        return v.votes_count
                    }),
                    backgroundColor: options.map(() => {
                        return `rgba(${this.randomInt()}, ${this.randomInt()}, ${this.randomInt()}, 1)`
                    }),
                    borderColor: options.map(() => {
                        return `rgba(${this.randomInt()}, ${this.randomInt()}, ${this.randomInt()}, 1)`
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) { if (Number.isInteger(value)) { return value; } }
                        }
                    }]
                }
            }

        });
    }

    feedActionSheet(post: any) {

        let buttons = [
            {
                text: 'Редактировать',
                handler: () => {
                    this.editPost(post)
                }
            },
            {
                text: 'Скопировать ссылку',
                handler: () => {
                    this.copyLink(post)
                }
            },
            {
                text: 'Удалить',
                handler: () => {
                    this.deletePost(post)
                }
            },
            {
                text: 'Отменить',
                role: 'cancel',
                handler: () => {
                    return
                }
            }
        ];

        const actionSheet = this.actionSheetCtrl.create({
            title: 'Что сделать с записью',
            buttons: buttons.filter((v) => {
                switch (v.text) {
                    case 'Редактировать':
                        return post.editable;
                    case 'Удалить':
                        return post.deletable;
                    default:
                        return true;
                }
            })
        });

        actionSheet.present();
    }

    deletePost(post: any) {
        this.api.delete(`posts/${post.id}`).subscribe((res: any) => {
            if (res.success) {
                this.events.publish('posts:delete', post.id);
                this.flash.push('Пост успешно удален');
            }
        }, (err: any) => {
            console.log(err);
        })
    }

    editPost(post: any) {
        this.navCtrl.push('NewVotePage', {post: post});
    }

    copyLink(post: any) {
        this.clipboard.copy(post.link);
    }

    toPost(post: any) {
        let page = 'VotePage',
            question = post.question;

        if (question.is_expired && question.can_set_winner && !question.winner_id) {
            page = 'VotePage';
        } else if (!question.user_option_id && !question.is_expired) {
            page = 'VotePage'
        } else {
            page = 'VoteResultPage'
        }

        this.navCtrl.push(page, {post: post});
    }


    optionName(option: any) {
        return `${option.name} (${option.votes_count})`;
    }

    setWinner(option: any) {
        this.api.post(`posts/question/vote/action`, {
            post_id: this.item.id,
            option_id: option.id
        }).subscribe((res: any) => {
            if (res.success) {
                this.flash.push('Победитель выбран');
                this.navCtrl.push('FeedPage');
            }
        }, () => {
            this.navCtrl.push('Ошибка выбора победителя, попробуйте ещё.')
        })
    }

    randomInt(min = 1, max = 255) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    canVote() {
        return !this.item.question.user_option_id && !this.item.question.is_expired
    }

    voted() {
        return this.item.question.winner_id ||
            this.item.question.is_expired ||
            this.item.question.user_option_id;
    }

    winnerName() {
        let option = this.item.question.options.find((v) => {
            return v.id === this.item.question.winner_id;
        });
        return option ? option.name : '';
    }

    toProfile(post: any) {
        this.navCtrl.push('ProfilePage', {user: post.user_id});
    }

}
