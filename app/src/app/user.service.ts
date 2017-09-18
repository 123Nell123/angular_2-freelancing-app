import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions, BaseRequestOptions } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { User } from './user.class';

//var url = "http://164.8.230.115:8080";
var url = "http://localhost:8080";

@Injectable()
export class userService extends BaseRequestOptions {
  constructor(private http: Http) {
    super();
  }

  getAllUsers() : Promise<User[]> {
    return this.http.get(url+'/api/users/all')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getPonudnikStats(email: string) : Promise<any> {
    var obj = {
      email: email
    };
    return this.http.post(url+'/api/users/stats',obj)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getUsersByCategorie(categorie: string) : Promise<User[]> {
    console.log(categorie);
    return this.http.get(url+'/api/users/bycategorie/'+categorie)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAllUsersWithName(name: string) : Promise<User[]> {
    return this.http.get(url+'/api/users/withname/'+name)
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
