import { Component, ViewChild, ViewChildren } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { userService } from './user.service';

@Component({
  selector: 'ponudnik_stats',
  templateUrl: 'ponudnik_stats.component.html',
  providers: [userService]
})
export class PonudnikStats {

  private errorMessage: any = '';
  public doughnutOffersLabels: string[] = [];
  public doughnutOffersData: number[] = [];
  public doughnutOffersType: string = 'doughnut';
  public doughnutJobsLabels: string[] = [];
  public doughnutJobsData: number[] = [];
  public doughnutJobsType: string = 'doughnut';
  public doughnutRecJobsLabels: string[] = [];
  public doughnutRecJobsData: number[] = [];
  public doughnutRecJobsType: string = 'doughnut';
  public showOffersData: boolean = false;
  public showJobData: boolean = false;
  public showRecJobData: boolean = false;
  public myRating: number = 0;
  public receivedPayment: number = 0;
  constructor(private userService: userService) { }

  ngOnInit() {
    this.userService.getPonudnikStats(localStorage.getItem('email'))
      .then(
      results => {
        //console.log(results);
        if (results.sorted_offers.length > 0) {
          this.showOffersData = true;
          for (var i = 0; i < results.sorted_offers.length; i++) {
            this.doughnutOffersLabels.push(results.sorted_offers[i][0]);
            this.doughnutOffersData.push(results.sorted_offers[i][1]);
          }
        }
        if (results.sorted_jobs.length > 0) {
          this.showJobData = true;
          for (var i = 0; i < results.sorted_jobs.length; i++) {
            this.doughnutJobsLabels.push(results.sorted_jobs[i][0]);
            this.doughnutJobsData.push(results.sorted_jobs[i][1]);
          }
        }
        console.log(results.sorted_rec_jobs.length);
        if (results.sorted_rec_jobs.length > 0) {
          this.showRecJobData = true;
          for (var i = 0; i < results.sorted_rec_jobs.length; i++) {
            this.doughnutRecJobsLabels.push(results.sorted_rec_jobs[i][0]);
            this.doughnutRecJobsData.push(results.sorted_rec_jobs[i][1]);
          }
        }
        this.myRating = results.rating;
        this.receivedPayment = results.received_payment;
      },
      error => { this.errorMessage = <any>error; }
      );
  }

  //  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  //public doughnutChartData:number[] = [350, 450, 100];
  //public doughnutChartType:string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
