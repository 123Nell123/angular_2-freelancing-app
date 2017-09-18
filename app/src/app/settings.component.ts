import { Component,ViewChild } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { userdataService } from './userdata.service';
import { UserData } from './userdata.class';
import { categoriesService } from './categories.service';
import { subscribedCategorie_class } from './subscribed_categorie.class';
import { jobService } from './job.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  providers: [userdataService,categoriesService,jobService]
})
export class Settings {
  user: UserData = new UserData();
  errorMessage: any = '';
  subscribed_categories: any[] = [];
  categories: any[] = [];
  available_categories: any[] = [];
  new_subscribed_categories: subscribedCategorie_class[] = [];
  notification: string = "";

  @ViewChild('newsubscribecategorie') selectedSubscribeCategorie;
  @ViewChild('bio') bio;
  @ViewChild('summarybio') summarybio;
  @ViewChild('notificationsModal') notificationsModal;
  @ViewChild('location') location;

  constructor(private userdataService: userdataService,
              private categoriesFetch: categoriesService,
              private jobService: jobService) {}

  ngOnInit() {
    if(localStorage.getItem('registeredPovprasevalec') == 'true') {
    this.userdataService.getUserData(localStorage.getItem('email'))
      .then(
        result => {this.user = result;
                  this.getBrowsingCategories();},
        error => {this.errorMessage = <any>error;}
      );
    }
    else {
      window.location.href = "/mainpage/home";
    }

  }

  getSubscribedCategories() {
    this.categoriesFetch.fetchSubscribedCategories(localStorage.getItem('email'))
      .then(
        categories => {this.subscribed_categories = categories;
        var found = false;
        for(var i=0;i<this.categories.length;i++) {
          found = false;
          for(var j=0;j<this.subscribed_categories.length;j++) {
            if(this.subscribed_categories[j].categorie === this.categories[i].name) {
              found = true;
              break;
            }
          }
          if(found == false) {
            this.available_categories.push(this.categories[i]);
          }
        }
        },
        error => {this.errorMessage = <any>error;}
    );
  }

  getBrowsingCategories() {
    this.categoriesFetch.fetchCategories()
      .then(
        categories => { this.categories = categories;
                      this.getSubscribedCategories();},
        error => {this.errorMessage = <any>error;}
      );
  }

  addSubscribedCategorie() {
    var new_categorie = this.selectedSubscribeCategorie.nativeElement.options[this.selectedSubscribeCategorie.nativeElement.selectedIndex].text;
    this.selectedSubscribeCategorie.nativeElement.remove(this.selectedSubscribeCategorie.nativeElement.selectedIndex);
    var newSubsCategorie = new subscribedCategorie_class();
    newSubsCategorie.categorie = new_categorie;
    this.new_subscribed_categories.unshift(newSubsCategorie);
    this.user.categories.push(newSubsCategorie);
  }

  submitEditForm() {
    this.jobService.editPovprasevalecData(localStorage.getItem('email'),this.bio.nativeElement.value,this.summarybio.nativeElement.value,this.location.nativeElement.value)
    .then(
      notification => {
          this.notification = notification.message;
          this.notificationsModal.open();
        },
        error =>{this.errorMessage=<any>error;console.log(error);}
    );
  }

  closeNotification() {
    this.notificationsModal.close();
    window.location.href = "/mainpage/povprasevalec";
  }
}
