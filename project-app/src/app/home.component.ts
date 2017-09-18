import { Component } from "@angular/core";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  host: {"[style.background-image]":"red"},
  styleUrls: ['./home.component.css'],
})
export class Home {
}
