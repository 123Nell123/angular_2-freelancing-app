import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions, BaseRequestOptions } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { coinsNotification } from './coins_notification.class';

import { Recommendations } from './recommendations_class';
import { User } from './user.class';
import { Rareskill } from './rareskill.class';

//var url = "http://164.8.230.115:8080";
var url = "http://localhost:8080";

@Injectable()
export class statsService extends BaseRequestOptions {
  constructor(private http: Http) {
    super();
  }

  getRareSkill() : Promise<Rareskill> {
    return this.http.get(url+'/api/users/rareskills/getone')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  sendEmail(from: string,to: string, skill: string) : Promise<string> {
    var obj = {
      from: from,
      to: to,
      skill: skill
    };
    return this.http.post(url+'/api/users/send_email',obj)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  fetchCoins(email: string) : Promise<coinsNotification> {
    var obj_to_send = {
      email: email
    };
    return this.http.post(url+'/api/users/coins',obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  fetchNotifications(email: string) : Promise<string[]> {
    var obj_to_send = {
      email: email
    };

    return this.http.post(url+'/api/users/notifications',obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res:Response) {
    let body = res.json();
    return body || [];
  }

  getRecommendations(email: string) : Promise<User[]> {
    return this.http.get(url+'/api/users/recommendations/'+email)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error:any) {
    let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  purchaseCoins(email: string, input: number) : Promise<number>  {
    var obj_to_send = {
      coins: input,
      email: email
    };

    return this.http.post(url+'/api/users/purchasecoins',obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
}
