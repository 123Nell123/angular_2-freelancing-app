import { Component, ViewChild, ViewChildren, QueryList, Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { SebmGoogleMap } from 'angular2-google-maps/core';
import { Offer } from './offer.class';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Image, Action, ImageModalEvent, Description} from 'angular-modal-gallery';

@Component({
  selector: 'offer',
  templateUrl: './offer.component.html',
  providers: []
})
export class offerView {

  @Input('data') data: Offer;
  @ViewChild('imageModal') imageModal;

  @ViewChildren(SebmGoogleMap) maps: QueryList<SebmGoogleMap>;

  constructor() {

  }

  ngOnInit() {
    setTimeout(() => {
      setTimeout(() => {
        this.maps.toArray().forEach((child) => { child.triggerResize(); console.log("hm"); })
      }, 10);
    }, 500);
  }

  showAllImages() {
    this.imageModal.open();
  }
}
