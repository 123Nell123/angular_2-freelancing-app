import { Component,Input,ViewChild } from "@angular/core";

import { Job_class } from './job.class';
import { jobService } from './job.service';
import { Offer } from './offer.class';
import { statsService } from './stats.service';
import 'jquery';
import 'bootstrap';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Image, Action, ImageModalEvent, Description} from 'angular-modal-gallery';

@Component({
  selector: 'jobponudnik',
  templateUrl: './jobponudnik.component.html',
  providers: [jobService,statsService]
})
export class Jobponudnik {
  @Input('data') data: Job_class;
  private errorMessage: any = '';
  private offers: Offer[] = [];
  private offers_visible: boolean = false;
  private can_accept: boolean = true;
  private offer_accepted_authorID: string = "";
  private offer_accepted_price: number = 0;
  private offer_accepted_id: string = "";
  @ViewChild ('notificationModal') notificationModal;
  private firstStarStyle: string = "glyphicon-star-empty";
  private secondStarStyle: string = "glyphicon-star-empty";
  private thirdStarStyle: string = "glyphicon-star-empty";
  private forthStarStyle: string = "glyphicon-star-empty";
  private fifthStarStyle: string = "glyphicon-star-empty";
  private notification: string = "";
  private coins: number = 0;

  private myRating: number = null;
  private saveRating: boolean = false;

  openModalWindow: boolean = false;
  imagePointer: number = 0;

  openModalWindowObservable: boolean = false;
  imagePointerObservable: number = 0;

  constructor(private jobService: jobService, private statsService: statsService) {
    this.data = new Job_class();
  }

  getOffers(id: string) {
    if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
        || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
         || localStorage.getItem('coins') === null) {
           window.location.href="/firstpage";
    }
    else if(this.offers_visible==false)
    {
      console.log(id);
      this.jobService.getAllOffers(id)
        .then(
          offers => {this.offers = offers;if(this.offers.length > 0){this.offers_visible=true;}
            this.can_accept = true;
            for(var i=0;i<this.offers.length;i++) {
              if(this.offers[i].accepted) {
                this.can_accept = false;
                this.offer_accepted_authorID = this.offers[i].author_id;
                this.offer_accepted_price = this.offers[i].price;
                this.offer_accepted_id = this.offers[i].offer_id;
                break;
              }
            }
          },
          error => {this.errorMessage = <any>error;}
        );
    }
    else
    {
        this.offers_visible=false;
    }
  }

  acceptOffer(job_id: string,offer_id: string,offer_name: string, offer_id_unique: string) {
    if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
        || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
         || localStorage.getItem('coins') === null) {
           window.location.href="/firstpage";
    }
    else {
      console.log(job_id + " " + offer_id);
      var notification = localStorage.getItem('fullname') + " accepted your offer on " + offer_name;
      this.jobService.acceptOffer(job_id,offer_id,notification, offer_id_unique)
      .then(
        notification => {this.notification=notification.message;this.notificationModal.open();if(this.notification == "Offer accepted") {this.can_accept=false;this.data.finished=true;
          for(var i=0;i<this.offers.length;i++) {
            if(this.offers[i].offer_id == offer_id_unique) {
              this.offers[i].accepted = true;
              break;
            }
          }
        }},
        error => {this.errorMessage = <any>error;}
      );
    }
  }

  payClick(offer_name,offer_price) {
    if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
        || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
         || localStorage.getItem('coins') === null) {
           window.location.href="/firstpage";
    }
    else {
      this.statsService.fetchCoins(localStorage.getItem('email'))
      .then(
        notification => {this.coins = notification.coins;
          if(this.coins > offer_price) {
            for(var i=0;i<this.offers.length;i++) {
              if(this.offers[i].accepted) {
                this.can_accept = false;
                this.offer_accepted_authorID = this.offers[i].author_id;
                this.offer_accepted_price = this.offers[i].price;
                this.offer_accepted_id = this.offers[i].offer_id;
                break;
              }
            }
            var _notification = localStorage.getItem('fullname') + " payed you for " + offer_name;
            this.jobService.pay(this.data._id,this.offer_accepted_authorID,this.offer_accepted_price,this.offer_accepted_id,localStorage.getItem('email'),_notification,
                this.myRating,this.saveRating,this.data.categorie)
              .then(
                notification => {this.notification=notification;console.log(notification);this.notificationModal.open();this.data.payed=true;},
                error => {this.errorMessage = <any>error;}
              );
          }
          else {
            this.notification = "You do not have enough money to pay this, buy more coins";
            this.notificationModal.open();
          }
        },
        error => {this.errorMessage = <any>error;}
      );
    }
  }

  firstStar()
  {
    this.firstStarStyle = "glyphicon glyphicon-star";
    this.secondStarStyle = "glyphicon-star-empty";
    this.thirdStarStyle = "glyphicon-star-empty";
    this.forthStarStyle = "glyphicon-star-empty";
    this.fifthStarStyle = "glyphicon-star-empty";
    this.myRating = 1;
    this.saveRating = true;
  }
  secondStar()
  {
    this.firstStarStyle = "glyphicon glyphicon-star";
    this.secondStarStyle = "glyphicon glyphicon-star";
    this.thirdStarStyle = "glyphicon-star-empty";
    this.forthStarStyle = "glyphicon-star-empty";
    this.fifthStarStyle = "glyphicon-star-empty";
    this.myRating = 2;
    this.saveRating = true;
  }
  thirdStar()
  {
    this.firstStarStyle = "glyphicon glyphicon-star";
    this.secondStarStyle = "glyphicon glyphicon-star";
    this.thirdStarStyle = "glyphicon glyphicon-star";
    this.forthStarStyle = "glyphicon-star-empty";
    this.fifthStarStyle = "glyphicon-star-empty";
    this.myRating = 3;
    this.saveRating = true;
  }
  forthStar()
  {
    this.firstStarStyle = "glyphicon glyphicon-star";
    this.secondStarStyle = "glyphicon glyphicon-star";
    this.thirdStarStyle = "glyphicon glyphicon-star";
    this.forthStarStyle = "glyphicon glyphicon-star";
    this.fifthStarStyle = "glyphicon-star-empty";
    this.myRating = 4;
    this.saveRating = true;
  }
  fifthStar()
  {
    this.firstStarStyle = "glyphicon glyphicon-star";
    this.secondStarStyle = "glyphicon glyphicon-star";
    this.thirdStarStyle = "glyphicon glyphicon-star";
    this.forthStarStyle = "glyphicon glyphicon-star";
    this.fifthStarStyle = "glyphicon glyphicon-star";
    this.myRating = 5;
    this.saveRating = true;
  }


  imagesArray: Array<Image> = [];

  // observable of an array of images with a delay to simulate a network request
  images: Observable<Array<Image>> = Observable.of(this.imagesArray).delay(300);



  // array of images initialized inside the onNgInit() of this component
  // in an asynchronous way subscribing to an Observable with a delay.
  // This is not a real use-case, but it's a way to simulate a scenario where
  // you have to subscribe to an Observable to get data and to set public vars
  imagesArraySubscribed: Array<Image>;

  customDescription: Description = {
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customFullDescription: Description = {
    // you should build this value programmaticaly with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image',
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  private subscription: Subscription;
  private imagesArraySubscription: Subscription;

  ngOnInit() {
    this.imagesArraySubscription = Observable.of(null).delay(200).subscribe(() => {
      if(this.data.images.length > 0) {
        for(var i=0;i<this.data.images.length;i++) {
          this.imagesArray.push(new Image(
            "data:image/jpeg;base64," + this.data.images[i],
            "data:image/jpeg;base64," + this.data.images[i],
            null,
            null
          ));
        }
        this.imagesArraySubscribed = this.imagesArray;
      }
      else
        this.imagesArraySubscribed = [];
    });
  }

  openImageModal(image: Image) {
    this.imagePointer = this.imagesArray.indexOf(image);
    this.openModalWindow = true;
  }

  openImageModalObservable(image: Image) {
    this.subscription = this.images.subscribe((val: Image[]) => {
      this.imagePointerObservable = val.indexOf(image);
      this.openModalWindowObservable = true;
    });
  }

  onImageLoaded(event: ImageModalEvent) {
    // angular-modal-gallery will emit this event if it will load successfully input images
    console.log('onImageLoaded action: ' + Action[event.action]);
    console.log('onImageLoaded result:' + event.result);
  }

  onVisibleIndex(event: ImageModalEvent) {
    this.customFullDescription.customFullDescription = `Custom description of visible image with index= ${event.result}`;
    console.log('action: ' + Action[event.action]);
    console.log('result:' + event.result);
  }

  onIsFirstImage(event: ImageModalEvent) {
    console.log('onfirst action: ' + Action[event.action]);
    console.log('onfirst result:' + event.result);
  }

  onIsLastImage(event: ImageModalEvent) {
    console.log('onlast action: ' + Action[event.action]);
    console.log('onlast result:' + event.result);
  }

  onCloseImageModal(event: ImageModalEvent) {
    console.log('onClose action: ' + Action[event.action]);
    console.log('onClose result:' + event.result);
    this.openModalWindow = false;
    this.openModalWindowObservable = false;
  }

  addRandomImage() {
    this.imagesArray.push(this.imagesArray[Math.floor(Math.random() * this.imagesArray.length)]);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.imagesArraySubscription) {
      this.imagesArraySubscription.unsubscribe();
    }
  }
}
