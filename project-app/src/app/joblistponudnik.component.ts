import { Component,Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { jobService } from './job.service';
import { Job_class } from './job.class';
import { Jobponudnik } from './jobponudnik.component';

@Component({
  selector: 'joblistponudnik',
  templateUrl: './joblistponudnik.component.html'
})
export class Joblistponudnik {
  private errorMessage: any = '';
  @Input('jobs') jobs: Job_class[] = [];

  constructor(private jobService: jobService) {}

  ngOnInit() {

  }

  addLastAddedJob(job: Job_class) {
    this.jobs.unshift(job);
  }
}
