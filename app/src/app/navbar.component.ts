// core/navbar.component.ts
import { Component } from '@angular/core';
@Component({
    selector: 'ct-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent
{
    isIn = false;   // store state
    toggleState() { // click handler
        let bool = this.isIn;
        this.isIn = bool === false ? true : false; 
    }
}