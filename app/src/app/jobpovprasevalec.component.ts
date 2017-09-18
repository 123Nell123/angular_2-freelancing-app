import { Component,Input,ViewChild } from "@angular/core";

import { Job_class } from './job.class';
import { jobService} from './job.service';
import { offerNotification } from './offer_notification.class';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Image, Action, ImageModalEvent, Description} from 'angular-modal-gallery';

@Component({
  selector: 'jobpovprasevalec',
  templateUrl: './jobpovprasevalec.component.html',
  providers: [jobService]
})
export class Jobpovprasevalec {
  errorMessage: any = '';
  @Input('data') data: Job_class;
  @Input('offers') offers;
  @ViewChild ('myoffer') myoffer;
  @ViewChild ('notificationsModal') notificationsModal;

  give_offer: boolean;
  notification: offerNotification = new offerNotification();

  openModalWindow: boolean = false;
  imagePointer: number = 0;

  openModalWindowObservable: boolean = false;
  imagePointerObservable: number = 0;

  elapsed_time = null;

  constructor(private jobService: jobService) {
    this.data = new Job_class();
    this.give_offer = false;
  }

  giveOffer() {
    this.give_offer = !this.give_offer;
  }

  sendOffer() {
    if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
        || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
         || localStorage.getItem('coins') === null) {
           window.location.href="/firstpage";
    }
    else {
      this.jobService.newOffer(localStorage.getItem('email'),this.myoffer.nativeElement.value,this.data.job_id)
      .then(
        notification => {this.notification = notification; this.notificationsModal.open(); this.myoffer.nativeElement.value = ""; this.give_offer = false;},
        error => {this.errorMessage = <any>error;}
      );
    }
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

    var t1 = new Date(this.data.expiration_date);
    var t2 = new Date();
    var delta = Math.abs(t1.getTime() - t2.getTime()) / 1000;

    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    this.elapsed_time = "Expires in ";

    if(days == 0 && hours != 0) {
      this.elapsed_time += hours + " hours";
    }
    else if(days < 10) {
      if(days == 1) {
        this.elapsed_time += days + " day";
      }
      else {
        this.elapsed_time += days + " days";
      }
      if(hours != 0) {
        if(hours == 1) {
          this.elapsed_time += " and " + hours + " hour";
        }
        else {
          this.elapsed_time += " and " + hours + " hours";
        }
      }
    }
    else if(days >= 10 && days < 30) {
      this.elapsed_time += days + " days";
    }
    else {
      this.elapsed_time += "more than a month";
    }
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
