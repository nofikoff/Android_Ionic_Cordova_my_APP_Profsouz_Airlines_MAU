import {Component, ViewChild, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Chart} from 'chart.js';


@IonicPage()
@Component({
    selector: 'page-vote-result',
    templateUrl: 'vote-result.html',
})
export class VoteResultPage implements OnInit {
    @ViewChild('barCanvas') barCanvas;

    private barChart: any;

    private post: any = null;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.post = navParams.get('post');
    }

    ngOnInit(): void {
        let options = this.post.question.options;

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

    doRefresh(refresher) {
        refresher.complete();
    }

    randomInt(min = 1, max = 255) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    winnerName() {
        let option = this.post.question.options.find((v) => {
            return v.id === this.post.question.winner_id;
        });
        return option ? option.name : '';
    }

}
