import { Component,Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { Private_jobpovprasevalec_class } from './privatejob_povprasevalec.class';
import { Private_jobpovprasevalec } from './private_jobpovprasevalec.component';

@Component({
  selector: 'private_joblistpovprasevalec',
  templateUrl: './private_joblistpovprasevalec.component.html'
})
export class Private_joblistpovprasevalec {
  @Input('jobs') jobs: Private_jobpovprasevalec_class[] = [];
}
