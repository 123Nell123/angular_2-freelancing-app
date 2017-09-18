import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { SebmGoogleMap } from 'angular2-google-maps/core';

import { categoriesService } from './categories.service';
import { jobService } from './job.service';
import { Joblistponudnik } from './joblistponudnik.component';
import { Private_joblistponudnik } from './private_joblistponudnik.component';
import { Categorie } from './categorie.class';
import { Job_class } from './job.class';
import { Private_job_class } from './privatejob.class';
import { User } from './user.class';
import { userService } from './user.service';
import { statsService } from './stats.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ponudnik',
  templateUrl: './ponudnik.component.html',
  providers: [categoriesService, jobService, userService, statsService]
})
export class ponudnikView {
  @ViewChild('naslov') title;
  @ViewChild('kategorija') categorie;
  @ViewChild('opis') description;
  @ViewChild('lokacija') location;
  @ViewChild('fileupload') upload;
  @ViewChild('usersListModal') usersListModal;
  @ViewChild('jobSendConformation') jobSendConformation;
  @ViewChild('alert') alert;
  @ViewChild('coinsalert') coinsalert;
  @ViewChild('userssearch') userssearch;
  @ViewChild('privatesubmitbutton') privatesubmitbutton;
  @ViewChild('publicsubmitbutton') publicsubmitbutton;

  @ViewChildren(SebmGoogleMap) maps: QueryList<SebmGoogleMap>;

  private alert_string: string = "You did not fill out all the required input fields";

  @ViewChild('joblist') joblist;
  @ViewChild('inputprice') inputprice;
  @ViewChild('searchUsersByCategorie') searchUsersByCategorie_;
  private jobs: Job_class[] = [];
  private private_jobs: Private_job_class[] = [];
  private public_or_private_jobs: boolean = true;
  private errorMessage: any = '';
  private private_job_notification: any = "";
  private categories: Categorie[] = [];
  private job_list_mode: string = "Private jobs";
  private users: User[] = [];
  private recommendedUsersVisible: boolean = false;
  private showSkills = false;
  private showBio = false;
  private showGpsLocation = false;

  private lat: number = null;
  private lng: number = null;
  private allowMaps: boolean = false;
  private upArrow: boolean = false;

  private queryError: string = "";

  @ViewChild('recommendationModal') recommendationModal;
  private recommendedUsers: User[] = [];

  private individualJobReceiversFullname = "";
  private mode = "all";

  private selectUserVisible = false;

  private expire_date: Date;
  private job_start_date: Date;
  private expiration_range = 1;
  private job_start_range = 2;



  datepickerOpts2 = {
    placeholder: 'Job date',
    startDate: new Date(),
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    format: 'D, d MM yyyy'
  }

  datepickerOpts1 = {
    placeholder: 'Expiration date',
    startDate: new Date(),
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    format: 'D, d MM yyyy'
  }

  constructor(private categoriesService: categoriesService, private jobService: jobService,
    private userService: userService, private statsService: statsService,
    private router: Router, private r: ActivatedRoute) {
      this.expire_date = new Date();
      this.expire_date.setDate(this.expire_date.getDate() + 1);

      this.job_start_date = new Date();
      this.job_start_date.setDate(this.job_start_date.getDate() + 2);

      this.datepickerOpts1.startDate.setDate(this.datepickerOpts1.startDate.getDate() + 1);
      this.datepickerOpts2.startDate.setDate(this.datepickerOpts2.startDate.getDate() + 2);
  }

  expirationDateRangeCalculation(e) {
    this.expire_date = e;
    var current_date = new Date();
    var diff = Math.abs(this.expire_date.getTime() - current_date.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    this.expiration_range = diffDays;
  }

  jobStartDateRangeCalculation(e) {
    this.job_start_date = e;
    var current_date = new Date();
    var diff = Math.abs(this.job_start_date.getTime() - current_date.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    this.job_start_range = diffDays;
  }

  ngOnInit() {
    //this.privatesubmitbutton.nativeElement.disabled = true;
    //this.publicsubmitbutton.nativeElement.disabled = false;
    this.categoriesService.fetchCategories()
      .then(
      categories => {
        this.categories = categories;
      },
      error => { this.errorMessage = <any>error; }
      );
    this.jobService.getUsersJobs(localStorage.getItem('email'))
      .then(
      jobs => { this.jobs = jobs; },
      error => { this.errorMessage = <any>error; }
      );
    if (!!navigator.geolocation) {
      this.allowMaps = true;
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    } else {
      this.allowMaps = false;
    }

    if (Number(localStorage.getItem('loginCount')) == 0) {
      localStorage.setItem('loginCount', "1"); //da ne bo ponovnih obvestil, ce refresha stran
      setTimeout(() => {
        this.statsService.getRecommendations(localStorage.getItem('email'))
          .then(
          results => {
            this.recommendedUsers = results; this.recommendationModal.open();
            setTimeout(() => {
              setTimeout(() => {
                this.maps.toArray().forEach((child) => { child.triggerResize(); })
              }, 10);
            }, 500);
          },
          error => { this.errorMessage = <any>error; }
          );
      }, 2000);
    }
  }

  showMyStats() {
    this.router.navigate(['../stats'], { relativeTo: this.r });
  }

  searchUsersByCategorieFunction(tag) {
    console.log(tag);
    if (tag == "Web Development") {
      tag = "web_development";
    }
    else if (tag == "Writing & Translation") {
      tag = "writing_&_translation";
    }
    else if (tag == "Design") {
      tag = "design";
    }
    else if (tag == "Video, Photo & Audio") {
      tag = "photo";
    }
    else if (tag == "Business Support") {
      tag = "business";
    }
    else if (tag == "Social Media") {
      tag = "social";
    }
    else if (tag == "Sales & Marketing") {
      tag = "sales";
    }
    else if (tag == "Software Dev & Mobile") {
      tag = "software";
    }
    this.userService.getUsersByCategorie(tag)
      .then(
      users => { this.users = []; this.users = users; },
      error => { this.errorMessage = <any>error; }
      );
  }

  setPosition(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  signUpLocation(e) {
    if (typeof e !== 'undefined') {
      this.lat = e.coords.lat;
      this.lng = e.coords.lng;
    }
    console.log(this.lat + " " + this.lng);
  }

  submitNewJob() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }

    else if (this.title.nativeElement.value.length > 0 && this.categorie.nativeElement.options[this.categorie.nativeElement.selectedIndex].text.length > 0
      && this.description.nativeElement.value.length > 0 && this.location.nativeElement.value.length > 0 &&
      this.expiration_range > 0 && this.job_start_range > 0) {
      let files: FileList = this.upload.nativeElement.files;
      let file: File = files[0];
      if (this.lat == null)
        this.lat = 0;
      if (this.lng == null)
        this.lng = 0;
      this.jobService.postNewJob(localStorage.getItem('email'), this.title.nativeElement.value,
        this.categorie.nativeElement.options[this.categorie.nativeElement.selectedIndex].text,
        this.description.nativeElement.value, this.location.nativeElement.value,
        this.expiration_range, this.job_start_range,
        this.upload.nativeElement.files, this.allowMaps, this.lat, this.lng, localStorage.getItem('phonenumber'))
        .then(
        new_job => {
          new_job.coordinate_latitude = Number(new_job.coordinate_latitude);
          new_job.coordinate_longitude = Number(new_job.coordinate_longitude);
          this.joblist.addLastAddedJob(new_job); this.title.nativeElement.value = "";
          this.description.nativeElement.value = ""; this.location.nativeElement.value = "";
          this.expiration_range = -1; this.job_start_range = -1;
          setTimeout(() => {
            setTimeout(() => {
              this.maps.toArray().forEach((child) => { child.triggerResize(); })
            }, 10);
          }, 500);
        },
        error => { this.errorMessage = <any>error; }
        );
    }
    else {
      this.alert.open();
    }
  }

  mouseEnter() {
    this.upArrow = true;
    console.log("in");
  }

  mouseLeave() {
    this.upArrow = false;
    console.log("out");
  }

  myjobssearchTag(tag) {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      if (tag == "All jobs") {
        this.mode = "all";
      }
      else if (tag == "Accepted jobs") {
        this.mode = "accepted";
      }
      else if (tag == "Pending jobs") {
        this.mode = "pending";
      }

      this.jobService.getSelectedJobs(localStorage.getItem('email'), this.mode)
        .then(
        jobs => { this.jobs = jobs; },
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
      console.log("domen");
      if (tag == "All private jobs") {
        this.mode = "all";
      }
      else if (tag == "Accepted private jobs") {
        this.mode = "accepted";
      }
      else if (tag == "Pending private jobs") {
        this.mode = "pending";
      }
      this.jobService.getPrivateSelectedJobs(localStorage.getItem('email'), this.mode)
        .then(
        private_jobs => { this.private_jobs = private_jobs; },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  showRecommendedUsers() {
    this.recommendedUsersVisible = !this.recommendedUsersVisible;
  }

  showUsersList() {
    this.statsService.fetchCoins(localStorage.getItem('email'))
      .then(
        notification => {
          if (notification.coins > this.inputprice.nativeElement.value && this.inputprice.nativeElement.value > 0) {
            if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
              || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
              || localStorage.getItem('coins') === null) {
              window.location.href = "/firstpage";
            }
            else if (this.inputprice.nativeElement.value.length > 0 && this.title.nativeElement.value.length > 0 && this.categorie.nativeElement.options[this.categorie.nativeElement.selectedIndex].text.length > 0
              && this.description.nativeElement.value.length > 0 && this.location.nativeElement.value.length > 0 &&
              this.expiration_range > 0 && this.job_start_range > 0) {
              if (this.recommendedUsers.length == 0) {
                this.statsService.getRecommendations(localStorage.getItem('email'))
                  .then(
                  results => {
                    this.recommendedUsers = results;
                  },
                  error => { this.errorMessage = <any>error; }
                  );
              }

              this.userService.getAllUsers()
                .then(
                users => {
                  this.users = users; console.log(this.users); this.usersListModal.open();
                  setTimeout(() => {
                    setTimeout(() => {
                      this.maps.toArray().forEach((child) => { child.triggerResize(); })
                    }, 10);
                  }, 500);
                },
                error => { this.errorMessage = <any>error; }
                );
            }
            else {
              this.alert.open();
            }
          }
          else {
            this.coinsalert.open();
          }
        },
        error => { this.errorMessage = <any>error; }
      );
  }

  searchForUsers() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      var userSearch = this.userssearch.nativeElement.value;
      if (userSearch.length > 0) {
        this.userService.getAllUsersWithName(userSearch)
          .then(
          users => {
            if (typeof (users) == "string") {
              this.queryError = users;
            } else {
              this.queryError = "";
              this.users = users;
            }
          },
          error => { this.errorMessage = <any>error; }
          );
      }
    }
  }

  sendIndividualJob(email: string, fullname: string, _id: string, phone_number: string) {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.statsService.fetchCoins(localStorage.getItem('email'))
        .then(

        notification => {
          if (notification.coins > this.inputprice.nativeElement.value && this.inputprice.nativeElement.value > 0) {
            var payment = this.inputprice.nativeElement.value;
            var notification_for_job = localStorage.getItem('fullname') + " offered you a job " + this.title.nativeElement.value;
            this.jobService.postNewIndividualJob(localStorage.getItem('email'), this.title.nativeElement.value,
              this.categorie.nativeElement.options[this.categorie.nativeElement.selectedIndex].text,
              this.description.nativeElement.value, this.location.nativeElement.value,
              this.expiration_range, this.job_start_range,
              this.upload.nativeElement.files, email, fullname, _id, payment, notification_for_job, this.allowMaps, this.lat, this.lng, phone_number)
              .then(

              new_job => {
                if (new_job.title.length > 0) {
                  new_job.coordinate_latitude = Number(new_job.coordinate_latitude);
                  new_job.coordinate_longitude = Number(new_job.coordinate_longitude); this.private_jobs.unshift(new_job);
                  this.usersListModal.close();
                  this.individualJobReceiversFullname = fullname;
                  this.jobSendConformation.open();
                  this.description.nativeElement.value = ""; this.location.nativeElement.value = "";
                  this.expiration_range = -1;
                  this.job_start_range = -1;
                  this.selectUserVisible = false;
                  setTimeout(() => {
                    setTimeout(() => {
                      this.maps.toArray().forEach((child) => { child.triggerResize(); })
                    }, 10);
                  }, 500);
                }
              },
              error => { this.errorMessage = <any>error; }
              );
          }
          else {
            this.private_job_notification = 'You did not input the price of job or you have too few coins';
          }
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
      if (this.job_list_mode == "Private jobs") {
        this.job_list_mode = "Public jobs";
        this.getIndividualJobs();
        this.mode = "all";
        //this.privatesubmitbutton.nativeElement.disabled = false;
        //this.publicsubmitbutton.nativeElement.disabled = true;
      }
      else {
        this.job_list_mode = "Private jobs";
        this.private_jobs = [];
        this.mode = "all";
        //this.privatesubmitbutton.nativeElement.disabled = true;
        //this.publicsubmitbutton.nativeElement.disabled = false;
      }
    }
  }

  getIndividualJobs() {
    if (localStorage.getItem('email') === null || localStorage.getItem('token') === null
      || localStorage.getItem('fullname') === null || localStorage.getItem('registeredPovprasevalec') === null
      || localStorage.getItem('coins') === null) {
      window.location.href = "/firstpage";
    }
    else {
      this.jobService.getIndividualJobs(localStorage.getItem('email'))
        .then(
        private_jobs => { this.private_jobs = private_jobs; },
        error => { this.errorMessage = <any>error; }
        );
    }
  }

  enableShowingSkills() {
    if(!this.showSkills) {
      this.showSkills = true;
      this.showBio = false;
      this.showGpsLocation = false;
    } else {
      this.showSkills = false;
      this.showBio = false;
      this.showGpsLocation = false;
    }
  }

  enableShowingBio() {
    if(!this.showBio) {
      this.showBio = true;
      this.showSkills = false;
      this.showGpsLocation = false;
    } else {
      this.showBio = false;
      this.showSkills = false;
      this.showGpsLocation = false;
    }
  }

  enableGpsLocation() {
    if(!this.showGpsLocation) {
      this.showSkills = false;
      this.showBio = false;
      this.showGpsLocation = true;
    } else {
      this.showSkills = false;
      this.showBio = false;
      this.showGpsLocation = false;
    }
  }

  enterPrivateJobPrice() {
    this.selectUserVisible = true;
  }

  closePrivateJobPrice() {
    this.selectUserVisible = false;
  }
}
