import { Component,ViewChild } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { SebmGoogleMap} from 'angular2-google-maps/core';

import { coinsNotification } from './coins_notification.class';
import { statsService } from './stats.service';
import { User } from './user.class';
import { Rareskill } from './rareskill.class';

import 'jquery';
import 'bootstrap';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  providers: [statsService]
})
export class Header {
    constructor(private statsService: statsService) {}
    coins: number = null;
    notifications: any[] = [];
    errorMessage: any = '';
    @ViewChild('notificationsModal') notificationsModal;
    @ViewChild('buyCoins') buyCoins;
    @ViewChild('coinsInput') coinsInput;
    @ViewChild('skillPrompt') skillPrompt;
    @ViewChild('emailToSend') emailToSend;

    rare_skill: Rareskill = null;


    intervalId: any = 0;
    user_fullname: string = "";


    isIn = false;   // store state
    toggleState() { // click handler
        let bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }

    ngOnInit() {
      clearInterval(this.intervalId);
      this.coins = Number(localStorage.getItem('coins'));
      this.user_fullname = localStorage.getItem('fullname');
      console.log(localStorage.getItem('loginCount'));
      if(Number(localStorage.getItem('loginCount')) == 0 && Number(localStorage.getItem('skillPrompt')) == 0) {
        setTimeout(() => {
          localStorage.setItem('skillPrompt',"1");
          this.statsService.getRareSkill()
          .then(
            rare_skill => {if(rare_skill != null) {console.log(rare_skill);this.rare_skill = rare_skill; this.skillPrompt.open();}},
            error => {this.errorMessage = <any>error;}
          );
        }, 2000);

      }
    }

    sendEmail() {
      var email = this.emailToSend.nativeElement.value;
      this.statsService.sendEmail(localStorage.getItem('email'),email,this.rare_skill.name)
      .then(
        notification => {if(notification == 'success') {this.skillPrompt.close();}},
        error => {this.errorMessage = <any>error;}
      );
    }

    ngOnDestroy() {
      console.log("destroy in ngOnDestroy");
      clearInterval(this.intervalId);
    }

    clearSession() {
      console.log("destroy in clearSession");
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('fullname');
      localStorage.removeItem('registeredPovprasevalec');
      localStorage.removeItem('coins');
      localStorage.removeItem('skillPrompt');
    }

    routerOnActivate() {
      this.intervalId = setInterval(() => {
        this.updateData(); //destroyay ta interval on ngDestroy
      }, 20000);
    }

    routerOnDeactivate() {
      clearInterval(this.intervalId);
    }

    settingsClick() {
      if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
          || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
           || localStorage.getItem('coins') === null) {
             window.location.href="/firstpage";
      }
    }

    updateData() {
      this.statsService.fetchCoins(localStorage.getItem('email'))
        .then(
          notification => {this.coins = notification.coins},
          error => {this.errorMessage = <any>error;}
        );
    }

    showNotifications() {
      if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
          || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
           || localStorage.getItem('coins') === null) {
             window.location.href="/firstpage";
      }
      this.statsService.fetchNotifications(localStorage.getItem('email'))
        .then(
          notifications => {this.notifications = notifications;console.log(this.notifications);this.notificationsModal.open();},
          error => {this.errorMessage=<any>error;}
        );
    }

    buyMoreCoins() {
      if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
          || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
           || localStorage.getItem('coins') === null) {
             window.location.href="/firstpage";
      }
      this.buyCoins.open();
    }

    purchaseCoins() {
      var input = this.coinsInput.nativeElement.value;
      if(input > 0) {
        this.statsService.purchaseCoins(localStorage.getItem('email'),input)
          .then(
            result => {this.coins = Number(Number(this.coins)+Number(result)); localStorage.setItem('coins',String(this.coins)); this.buyCoins.close();},
            error => {this.errorMessage=<any>error;}
          );
      }
    }
}
