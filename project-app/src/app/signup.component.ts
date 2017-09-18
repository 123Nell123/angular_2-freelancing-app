import { Component,ViewChild } from "@angular/core";
import { authenticationService } from './authentication.service';
import { LocalStorageService } from 'angular-2-local-storage';

import 'jquery';
import 'bootstrap';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  providers: [authenticationService]
})
export class Signup {
  @ViewChild('email') email;
  @ViewChild('password') password;
  @ViewChild('fullname') fullname;
  @ViewChild('location') location;
  @ViewChild('phonenumber') phonenumber;
  @ViewChild('modalNotification') modalNotification;
  @ViewChild('marker') marker;
  private allowMaps: boolean = false;

  private errorMessage: any = '';
  private notification: string = "";

  private lat: number = null;
  private lng: number = null;

  constructor(private authenticate: authenticationService) {}

  ngOnInit() {
    if(!!navigator.geolocation) {
      this.allowMaps = true;
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));

    } else {
      this.allowMaps = false;
    }
  }

  setPosition(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  signUpClick() {
    if(this.email.nativeElement.value.length > 0 && this.password.nativeElement.value.length > 7
          && this.fullname.nativeElement.value.length > 0 && this.location.nativeElement.value.length > 0
          && this.phonenumber.nativeElement.value.length > 0 && this.email.nativeElement.value.indexOf('@') > -1)
    {
        this.authenticate.signup(this.email.nativeElement.value,this.password.nativeElement.value,this.fullname.nativeElement.value, this.location.nativeElement.value,
          this.allowMaps,this.lat,this.lng,this.phonenumber.nativeElement.value)
        .then(
          signup_notification => {
            this.notification = signup_notification.message;
            this.modalNotification.open();
          },
          error => this.errorMessage = <any>error
        );
    }
    else if(this.email.nativeElement.value.length > 0 && this.password.nativeElement.value.length < 8
          && this.fullname.nativeElement.value.length > 0 && this.location.nativeElement.value.length > 0)
    {
      this.notification = 'You password is too short';
      this.modalNotification.open();
    }
    else if(this.email.nativeElement.value.indexOf('@') == -1)
    {
      this.notification = "You did not enter an email in 'E-mail' input field";
      this.modalNotification.open();
    }
    else
    {
      this.notification = 'You did not properly fill out the registration form';
      this.modalNotification.open();
    }
  }

  signUpLocation(e) {
    if(typeof e !== 'undefined') {
      this.lat = e.coords.lat;
      this.lng = e.coords.lng;
    }
    console.log(this.lat + " " + this.lng);
  }
}
