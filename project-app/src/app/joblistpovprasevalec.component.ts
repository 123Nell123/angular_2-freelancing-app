import { Component,Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { jobService } from './job.service';
import { Job_class } from './job.class';
import { Jobpovprasevalec } from './jobpovprasevalec.component';

@Component({
  selector: 'joblistpovprasevalec',
  templateUrl: './joblistpovprasevalec.component.html'
})
export class Joblistpovprasevalec {
  private errorMessage: any = '';
  @Input('jobs') jobs;
  @Input('offers') offers: boolean[];

  constructor(private jobService: jobService) {
  }
}
