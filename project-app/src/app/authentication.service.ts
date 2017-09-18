import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions, BaseRequestOptions } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { loginNotification } from './login_notification.class';
import { signupNotification } from './signup_notification.class';
import { authenticationNotification } from './auth_notification.class';

//var url = "http://164.8.230.115:8080";
var url = "http://localhost:8080";

@Injectable()
export class authenticationService extends BaseRequestOptions {
  constructor(private http: Http) {
    super();
  }

  login(email: string, password: string) : Promise<loginNotification> {
    var object_to_send = {
      email: email,
      password: password
    };

    return this.http.post(url+'/api/users/login',object_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  signup(email: string, password: string, fullname: string, location: string, allow_gps: boolean, lat: number, lng: number, phone_number: string) : Promise<signupNotification> {
    var object_to_send = {
      email: email,
      password: password,
      fullname: fullname,
      location: location,
      allow_gps: allow_gps,
      coordinate_latitude: lat,
      coordinate_longitude: lng,
      phone_number: phone_number
    };

    return this.http.post(url+'/api/users/register',object_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  authenticate(token: string) : Promise<authenticationNotification> {
    var object_to_send = {
      token: token
    };

    return this.http.post(url+'/api/users/authentication',object_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res:Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error:any) {
    let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

}
