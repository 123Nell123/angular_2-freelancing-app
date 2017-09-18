import {Component, Input, Output, ViewEncapsulation} from "@angular/core";
import { Router } from '@angular/router';
import { authenticationService } from './authentication.service';
import { LocalStorageService } from 'angular-2-local-storage';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { Signup } from './signup.component';
import { Login } from './login.component';

@Component({
  selector: 'firstpage',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './firstpage.component.html',
  providers: [authenticationService]
})
export class Firstpage {

  private errorMessage: any = '';
  constructor(  private authenticate: authenticationService){}

  ngOnInit() {
    if(localStorage.getItem('token') !== null) {
      this.authenticate.authenticate(localStorage.getItem('token'))
        .then(
          result => {if(result.allow) window.location.href = "http://localhost:4200/mainpage";},
          error => {this.errorMessage = <any>error;}
        );
      }
  }
}
