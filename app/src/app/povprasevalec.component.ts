import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { SebmGoogleMap } from 'angular2-google-maps/core';

import { subscribedCategorie_class } from './subscribed_categorie.class';
import { categoriesService } from './categories.service';
import { jobService } from './job.service';
import { Joblistpovprasevalec } from './joblistpovprasevalec.component';
import { Job_class } from './job.class';
import { Offer } from './offer.class';
import { Private_jobpovprasevalec_class } from './privatejob_povprasevalec.class';
import { Private_joblistpovprasevalec } from './private_joblistpovprasevalec.component';
import { offerView } from './offer.component';
import 'jquery';
import 'bootstrap';

@Component({
  selector: 'povprasevalec',
  templateUrl: './povprasevalec.component.html',
  providers: [categoriesService, jobService]
})
export class povprasevalecView {
  errorMessage: any = '';
  job_list_mode: string = "Received private jobs";
  categories: any[] = [];
  selected_categorie: string = "";
  new_subscribed_categories: subscribedCategorie_class[] = [];
  subscribed_categories: any[] = [];
  registeredPovprasevalec: boolean;
  jobs: Job_class[] = [];
  private_received_jobs: Private_jobpovprasevalec_class[] = [];
  allow_offers: boolean[];
  offers: Offer[] = [];
  notification: string = "";
  public_or_private_jobs: boolean = true;
  upArrow: boolean = false;

  @ViewChild('newsubscribecategorie') selectedSubscribeCategorie;
  @ViewChild('bio') bio;
  @ViewChild('summarybio') summarybio;
  @ViewChild('offersModal') offersModal;
  @ViewChild('notificationsModal') notificationsModal;

  mode = "all";
  NumberOfPendingPrivateJobs: number = null;
  modalOffersType: number = -1;

  @ViewChildren(SebmGoogleMap) maps: QueryList<SebmGoogleMap>;

  constructor(
    private categoriesFetch: categoriesService,
    private jobService: jobService
  ) {
    this.registeredPovprasevalec = (localStorage.getItem('registeredPovprasevalec') == 'true');
  }

  ngOnInit() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else if (!this.registeredPovprasevalec) { //ce se ni registriran kot povprasevalec, se mu prikaze forma in fetchajo se kategorije
      this.categoriesFetch.fetchCategories()
        .then(
        categories => { this.categories = categories; },
        error => { this.errorMessage = <any>error; }
        );
    }
    else {
      this.getSubscribedCategories();
      this.getBrowsingCategories();
      this.getJobs();
      this.getNumberOfPendingPrivateJobs();
    }
  }

  getNumberOfPendingPrivateJobs() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.jobService.fetchNumberOfPendingPrivateJobs(localStorage.getItem('email'))
      .then(
        number => { this.NumberOfPendingPrivateJobs = number.numberOfPendingJobs;},
        error => { this.errorMessage = <any>error;}
      );
    }
  }

  mouseEnter() {
    this.upArrow = true;
  }

  mouseLeave() {
    this.upArrow = false;
  }

  getSubscribedCategories() { //fetchajo kategorije, za katere se je prijavil in vpisal skille
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.categoriesFetch.fetchSubscribedCategories(localStorage.getItem('email'))
        .then(
        categories => { this.subscribed_categories = categories; },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  getBrowsingCategories() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.categoriesFetch.fetchCategories()
        .then(
        categories => {
          for (var i = 0; i < this.subscribed_categories.length; i++) {
            this.categories.push({ name: this.subscribed_categories[i].categorie });
          }
          var found = false;
          for (var i = 0; i < categories.length; i++) {
            for (var j = 0; j < this.categories.length; j++) {
              if (this.categories[j].name == categories[i].name) {
                found = true;
                break;
              }
            }
            if (found === false) {
              this.categories.push(categories[i]);
            }
            found = false;
          }
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  getJobs() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.jobService.getJobsForPovprasevalec(localStorage.getItem('email'))
        .then(
        jobs => {
          this.allow_offers = [];
          this.jobs = jobs;
          this.selected_categorie = "evrythng";
          for(var i=0;i<this.jobs.length;i++) {
            var allow = false;
            for (var j = 0; j < this.subscribed_categories.length; j++) {
              if (this.jobs[i].categorie === this.subscribed_categories[j].categorie) {
                allow = true;
                break;
              }
            }
            this.allow_offers.push(allow);
          }
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  addSubscribedCategorie() { //dodamo kategorije v formi
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      var new_categorie = this.selectedSubscribeCategorie.nativeElement.options[this.selectedSubscribeCategorie.nativeElement.selectedIndex].text;
      this.selectedSubscribeCategorie.nativeElement.remove(this.selectedSubscribeCategorie.nativeElement.selectedIndex);
      var newSubsCategorie = new subscribedCategorie_class();
      newSubsCategorie.categorie = new_categorie;
      this.new_subscribed_categories.unshift(newSubsCategorie);
    }
  }

  submitPovprasevalecForm() { //submitamo formo za registracijo kot povprasevalec
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.jobService.uploadPovprasevalecData(localStorage.getItem('email'), this.bio.nativeElement.value, this.summarybio.nativeElement.value, this.new_subscribed_categories)
        .then(
        notification => {
          if (notification.success) {
            localStorage.setItem('registeredPovprasevalec', String(notification.allowSearchingForJobs));
            this.registeredPovprasevalec = notification.allowSearchingForJobs; this.notification = notification.message; this.notificationsModal.open();
            this.getSubscribedCategories();
            this.getJobs();
          }
          else { this.notification = notification.message; this.notificationsModal.open(); }
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  categoriesearchTag(categorie) {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.allow_offers = [];
      var allow = false;
      for (var i = 0; i < this.subscribed_categories.length; i++) {
        if (categorie === this.subscribed_categories[i].categorie) {
          allow = true;
          break;
        }
      }
      this.jobService.getJobsByCategorie(categorie)
        .then(
        jobs => {
          this.selected_categorie = categorie;
          this.jobs = jobs;
          for(var i=0;i<this.jobs.length;i++) {
            this.allow_offers.push(true);
          }
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  categorieRecommendByMyStats() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.allow_offers = [];
      this.jobService.getPonudnikStats(localStorage.getItem('email'))
        .then(
        results => {
          if (results.sorted_offers.length > 0) {
            var doughnutOffersLabels: string[] = [];
            for (var i = 0; i < results.sorted_offers.length; i++) {
              doughnutOffersLabels.push(results.sorted_offers[i][0]);
            }

            this.jobService.getJobsRecommendedByMyStats(doughnutOffersLabels)
              .then(
              jobs => {

                this.selected_categorie = "rcmmnd";
                this.jobs = jobs;
                for(var i=0;i<this.jobs.length;i++) {
                  this.allow_offers.push(true);
                }
              },
              error => { this.errorMessage = <any>error; }
              );
          }
          else {
            //Nič jih ni.
            this.jobs = [];
          }
        });
    }
  }

  acceptedOffers() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.modalOffersType = 0;
      this.jobService.getAcceptedOffersForUser(localStorage.getItem('email'))
        .then(
        offers => {
          this.offers = offers; this.offersModal.open();
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  allOffers() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.modalOffersType = 1;
      this.jobService.getAllOffersForUser(localStorage.getItem('email'))
        .then(
        offers => {
          this.offers = offers; console.log(this.offers); this.offersModal.open();
          setTimeout(() => {
            setTimeout(() => {
              this.maps.toArray().forEach((child) => { child.triggerResize(); })
            }, 10);
          }, 500);
        },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  changeJobList() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.public_or_private_jobs = !this.public_or_private_jobs;
      if (this.job_list_mode == "Received private jobs") {
        this.job_list_mode = "Browse public jobs";
        this.getIndividualReceivedJobs();
      }
      else {
        this.job_list_mode = "Received private jobs";
        this.private_received_jobs = [];
      }
    }
  }


  getIndividualReceivedJobs() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.jobService.getIndividualReceivedJobs(localStorage.getItem('email'))
        .then(
        private_received_jobs => { this.private_received_jobs = private_received_jobs; },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  myprivatejobssearchTag(tag) {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      if (tag == "All received jobs") {
        this.mode = "all";
      }
      else if (tag == "Accepted received jobs") {
        this.mode = "accepted";
      }
      else if (tag == "Pending received jobs") {
        this.mode = "pending";
      }
      this.jobService.getReceivedJobsByTag(localStorage.getItem('email'), this.mode)
        .then(
        private_received_jobs => { this.private_received_jobs = private_received_jobs; },
        error => { this.errorMessage = <any>error; }
        );
    }
  }
}
