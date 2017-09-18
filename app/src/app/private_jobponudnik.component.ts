import { Component,Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { jobService } from './job.service';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Image, Action, ImageModalEvent, Description} from 'angular-modal-gallery';

@Component({
  selector: 'private_jobponudnik',
  templateUrl: './private_jobponudnik.component.html',
  providers: [jobService]
})
export class Private_jobponudnik {
  @Input('data') data;
  errorMessage: any = '';

  myRating: number = null;
  saveRating: boolean = false;
  firstStarStyle: string = "glyphicon-star-empty";
  secondStarStyle: string = "glyphicon-star-empty";
  thirdStarStyle: string = "glyphicon-star-empty";
  forthStarStyle: string = "glyphicon-star-empty";
  fifthStarStyle: string = "glyphicon-star-empty";

  openModalWindow: boolean = false;
  imagePointer: number = 0;

  openModalWindowObservable: boolean = false;
  imagePointerObservable: number = 0;

  constructor(private jobService: jobService) {}

  payAcceptedPrivateJob() {
    if(localStorage.getItem('email') === null || localStorage.getItem('token') === null
        || localStorage.getItem('fullname') === null ||localStorage.getItem('registeredPovprasevalec') === null
         || localStorage.getItem('coins') === null) {
           window.location.href="/firstpage";
    }
    else {
      var notification = localStorage.getItem('fullname') + " payed you " + this.data.price +" for the job: " + this.data.title;
      this.jobService.payAcceptedPrivateJob(this.data.job_id,this.data.price,notification,this.myRating,this.saveRating,this.data.categorie)
      .then(
        result => {console.log(result);if(result == 'success') {this.data.payed=true;var curr_money = Number(localStorage.getItem('coins'));localStorage.setItem('coins',String(curr_money-this.data.price));}},
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
