import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, BaseRequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { Job_class } from './job.class';
import { Povprasevalec_notification } from './povprasevalec_notification.class';
import { subscribedCategorie_class } from './subscribed_categorie.class';
import { offerNotification } from './offer_notification.class';
import { Offer } from './offer.class';
import { NumberOfPendingPrivateJobs } from './numberofpendingjobs.class';
import { Private_job_class } from './privatejob.class';
import { Private_jobpovprasevalec_class } from './privatejob_povprasevalec.class';

//var url = "http://164.8.230.115:8080";
var url = "http://localhost:8080";

@Injectable()
export class jobService extends BaseRequestOptions {
  constructor(private http: Http) {
    super();
  }

  postNewJob(email: string, title: string, categorie: string, description: string,
    location: string, expirationdays: number, jobdays: number, files: FileList, allowMaps: boolean,
    lat: number, lng: number, phone_number: string): Promise<Job_class> {

    let formData: FormData = new FormData();


    formData.append('email', email);
    formData.append('title', title);
    formData.append('categorie', categorie);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('expirationdays', String(expirationdays));
    formData.append('jobdays', String(jobdays));
    for(var i=0;i<files.length;i++) {
      formData.append('files[]', files[i]);
    }
    formData.append('allow_gps', String(allowMaps));
    formData.append('lat', String(lat));
    formData.append('lng', String(lng));

    return this.http.post(url + '/api/jobs/new', formData)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  fetchNumberOfPendingPrivateJobs(email: string): Promise<NumberOfPendingPrivateJobs> {
    var obj = {
      'email': email
    };
    return this.http.post(url + '/api/jobs/receivedjobs/number_of_jobs_pending', obj)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  postNewIndividualJob(email: string, title: string, categorie: string, description: string,
    location: string, expirationdays: number, jobdays: number, files: FileList, receiver_email: string, receiver_fullname: string,
    receiver_id: string, payment: number, notification: string, allowMaps: boolean, lat: number, lng: number, phone_number: string): Promise<Private_job_class> {
    let formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('title', title);
    formData.append('categorie', categorie);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('expirationdays', String(expirationdays));
    formData.append('jobdays', String(jobdays));
    for(var i=0;i<files.length;i++) {
      formData.append('files[]', files[i]);
    }
    formData.append('receiver_email', receiver_email);
    formData.append('receiver_fullname', receiver_fullname);
    formData.append('receiver_id', receiver_id);
    formData.append('payment', String(payment));
    formData.append('notification', notification);
    formData.append('allow_gps', String(allowMaps));
    formData.append('lat', String(lat));
    formData.append('lng', String(lng));
    formData.append('receiver_phone_number', phone_number);
    return this.http.post(url + '/api/jobs/newindividual', formData)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getUsersJobs(email: string): Promise<Job_class[]> {
    var obj_to_send = {
      email: email
    };
    return this.http.post(url + '/api/users/alljobs', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  uploadPovprasevalecData(email: string, bio: string, summary_bio: string, categories: subscribedCategorie_class[]): Promise<Povprasevalec_notification> {
    var obj_to_send = {
      email: email,
      bio: bio,
      summary_bio: summary_bio,
      categories: categories
    };
    return this.http.post(url + '/api/users/submitinfo', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  updatePovprasevalecData(email: string, bio: string, summary_bio: string, categories: subscribedCategorie_class[]): Promise<Povprasevalec_notification> {
    var obj_to_send = {
      email: email,
      bio: bio,
      summary_bio: summary_bio,
      categories: categories
    };
    console.log(obj_to_send);
    return this.http.post(url + '/api/users/submitinfo', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  editPovprasevalecData(email: string, bio: string, summary_bio: string, location: string): Promise<Povprasevalec_notification> {
    var obj_to_send = {
      email: email,
      bio: bio,
      summary_bio: summary_bio,
      location: location
    };
    console.log(obj_to_send);
    return this.http.post(url + '/api/users/editinfo', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getJobsByCategorie(categorie: string): Promise<Job_class[]> {
    return this.http.get(url + '/api/jobs/categories/' + categorie)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  //To sem kopiral iz user service ker če user service vključim v povprasevalec.component.ts vse neha delat
  getPonudnikStats(email: string): Promise<any> {
    var obj = {
      email: email
    };
    return this.http.post(url + '/api/users/stats', obj)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getJobsRecommendedByMyStats(doughnutOffersLabels: string[]): Promise<Job_class[]> {
    return this.http.get(url + '/api/users/jobsbycategories/' + JSON.stringify(doughnutOffersLabels))
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getJobsForPovprasevalec(email: string): Promise<Job_class[]> {
    return this.http.get(url + '/api/jobs/all')
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  newOffer(email: string, price: number, _id: string): Promise<offerNotification> {
    var obj_to_send = {
      povprasevalec_email: email,
      price: price,
      job_id: _id
    };
    return this.http.post(url + '/api/jobs/offer/post', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAllOffers(job_id: string): Promise<Offer[]> {
    return this.http.get(url + '/api/jobs/offers/all/' + job_id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  acceptOffer(job_id: string, offer_id: string, notification: string, offer_id_unique: string): Promise<offerNotification> {
    var obj_to_send = {
      job_id: job_id,
      offer_id: offer_id,
      notification: notification,
      offer_id_unique: offer_id_unique
    };
    return this.http.post(url + '/api/jobs/offer/accept', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getSelectedJobs(email: string, type: string): Promise<Job_class[]> {
    var obj_to_send = {
      email: email
    };
    if (type == "all") {
      return this.http.post(url + '/api/users/alljobs', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "accepted") {
      return this.http.post(url + '/api/users/acceptedjobs', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "pending") {
      return this.http.post(url + '/api/users/pendingjobs', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }

  getPrivateSelectedJobs(email: string, type: string): Promise<Private_job_class[]> {
    var obj_to_send = {
      email: email
    };

    if (type == "all") {
      return this.http.post(url + '/api/jobs/individualjobs/all', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "accepted") {
      return this.http.post(url + '/api/jobs/individualjobs/accepted', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "pending") {
      return this.http.post(url + '/api/jobs/individualjobs/pending', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }

  pay(_id: string, author_id: string, price: number, offer_id: string, email: string, notification: string,
    user_rating: number, save_rating: boolean, categorie: string): Promise<string> {
    var obj_to_send = {
      _id: _id,
      author_id: author_id,
      price: price,
      email: email,
      offer_id: offer_id,
      notification: notification,
      save_rating: save_rating,
      user_rating: user_rating,
      categorie: categorie
    };
    return this.http.post(url + '/api/jobs/pay', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAllOffersForUser(email: string): Promise<Offer[]> {
    var obj_to_send = {
      email: email
    };
    return this.http.post(url + '/api/jobs/offer/all', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAcceptedOffersForUser(email: string): Promise<Offer[]> {
    var obj_to_send = {
      email: email
    };

    return this.http.post(url + '/api/jobs/offer/accepted', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getIndividualJobs(email: string): Promise<Private_job_class[]> {
    var obj_to_send = {
      email: email
    };

    return this.http.post(url + '/api/jobs/individualjobs/posted', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getIndividualReceivedJobs(email: string): Promise<Private_jobpovprasevalec_class[]> {
    var obj_to_send = {
      email: email
    };

    return this.http.post(url + '/api/jobs/individualjobs/received', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getReceivedJobsByTag(email: string, type: string): Promise<Private_jobpovprasevalec_class[]> {
    var obj_to_send = {
      email: email
    };

    if (type == "all") {
      return this.http.post(url + '/api/jobs/receivedjobs/all', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "accepted") {
      return this.http.post(url + '/api/jobs/receivedjobs/accepted', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else if (type == "pending") {
      return this.http.post(url + '/api/jobs/receivedjobs/pending', obj_to_send)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
  }

  acceptReceivedJob(job_id: string, notification: string): Promise<string> {
    var obj_to_send = {
      job_id: job_id,
      notification: notification
    };

    return this.http.post(url + '/api/jobs/individualjobs/accept', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  payAcceptedPrivateJob(job_id: string, price: number, notification: string, myRating: number, saveRating: boolean, categorie: string): Promise<string> {
    var obj_to_send = {
      job_id: job_id,
      price: price,
      notification: notification,
      saveRating: saveRating,
      myRating: myRating,
      categorie: categorie
    };

    return this.http.post(url + '/api/jobs/individualjobs/pay', obj_to_send)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}
