import { Component,Input,ViewChild, Output, EventEmitter } from "@angular/core";

import { subscribedCategorie_class  } from './subscribed_categorie.class';

@Component({
  selector: 'subscribedcategorie',
  templateUrl: './subscribed_categorie.component.html'
})
export class subscribedCategorie {
  @Input('data') categorie: subscribedCategorie_class;
  @ViewChild('addskill') addskill;


  addNewSkill() {
    if(this.addskill.nativeElement.value.length > 0) {
      this.categorie.skills.unshift(this.addskill.nativeElement.value);
      this.addskill.nativeElement.value = "";
    }
  }
}
