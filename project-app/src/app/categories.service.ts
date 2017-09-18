import { Injectable } from '@angular/core';
import { Http, Response, Headers,RequestOptions, BaseRequestOptions } from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { Categorie } from './categorie.class';

//var url = "http://164.8.230.115:8080";
var url = "http://localhost:8080";

@Injectable()
export class categoriesService extends BaseRequestOptions {
  constructor(private http: Http) {
    super();
  }

  fetchCategories() : Promise<Categorie[]> {
    return this.http.get(url+'/api/categories/all')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  fetchSubscribedCategories(email: string) : Promise<Categorie[]> {
    return this.http.get(url+'/api/users/'+email+'/subscribedcategories')
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
