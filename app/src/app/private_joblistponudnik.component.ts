import { Component,Input } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';

import { Private_job_class } from './privatejob.class';
import { Private_jobponudnik } from './private_jobponudnik.component';

@Component({
  selector: 'private_joblistponudnik',
  templateUrl: './private_joblistponudnik.component.html'
})
export class Private_joblistponudnik {
  @Input('jobs') jobs: Private_job_class[] = [];
}
