import { Component } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { authenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { Header } from './header.component';

@Component({
  selector: 'mainpage',
  templateUrl: './mainpage.component.html',
  providers: [authenticationService]
})
export class Mainpage {
  private errorMessage: any = '';
  constructor(private authenticate: authenticationService) {}

  ngOnInit() {
    if(localStorage.getItem('token') !== null) {
      this.authenticate.authenticate(localStorage.getItem('token'))
        .then(
          result => {if(!result.allow) window.location.href = "http://localhost:4200/firstpage";},
          error => {this.errorMessage = <any>error;}
        );
    }
    else if(localStorage.getItem('token') === null) {
      window.location.href = "http://localhost:4200/firstpage";
    }
  }
}
