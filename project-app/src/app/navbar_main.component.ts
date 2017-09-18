// core/navbar.component.ts
import { Component } from '@angular/core';
@Component({
    selector: 'main-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarMainComponent
{
    isIn = false;   // store state
    toggleState() { // click handler
        let bool = this.isIn;
        this.isIn = bool === false ? true : false; 
    }
}