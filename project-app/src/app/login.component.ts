import { Component,ViewChild } from "@angular/core";
import { authenticationService } from './authentication.service';
import { LocalStorageService } from 'angular-2-local-storage';

import 'jquery';
import 'bootstrap';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [authenticationService]
})
export class Login {
  @ViewChild('email') email;
  @ViewChild('password') password;
  @ViewChild('modal') modal;
  private errorMessage: any = '';
  private notification: string = "";
  constructor(private authenticate: authenticationService) {}

  loginClick() {
    this.authenticate.login(this.email.nativeElement.value,this.password.nativeElement.value)
      .then(
        login_notification => {
          if(login_notification.success) {
            localStorage.setItem('token',login_notification.token);
            localStorage.setItem('email',this.email.nativeElement.value);
            localStorage.setItem('fullname',login_notification.fullname);
            localStorage.setItem('registeredPovprasevalec',String(login_notification.povprasevalec));
            localStorage.setItem('coins',String(login_notification.coins));
            localStorage.setItem('loginCount',String(login_notification.loginCount));
            localStorage.setItem('skillPrompt',"0");
            localStorage.setItem('phonenumber',login_notification.phone_number);
            window.location.href = "http://localhost:4200/mainpage/home";
          }
          else {
            this.password.nativeElement.value = "";
            this.notification = login_notification.message;
            this.modal.open();
          }
        },
        error => this.errorMessage = <any>error
      );
  }
}
