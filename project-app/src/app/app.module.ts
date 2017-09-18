//angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {enableProdMode} from '@angular/core';
enableProdMode();

//ng bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

//components
import { AppComponent } from './app.component';
import { routes } from './app.router';
import { Firstpage } from './firstpage.component';
import { Signup } from './signup.component';
import { Login } from './login.component';
import { Mainpage } from './mainpage.component';
import { Home } from './home.component';
import { ponudnikView } from './ponudnik.component';
import { povprasevalecView } from './povprasevalec.component';
import { Header } from './header.component';
import { Jobponudnik } from './jobponudnik.component';
import { Joblistponudnik } from './joblistponudnik.component';
import { Private_jobponudnik } from './private_jobponudnik.component';
import { Private_joblistponudnik } from './private_joblistponudnik.component';
import { Jobpovprasevalec } from './jobpovprasevalec.component';
import { Joblistpovprasevalec } from './joblistpovprasevalec.component'; ///
import { Private_joblistpovprasevalec} from './private_joblistpovprasevalec.component';
import { Private_jobpovprasevalec } from './private_jobpovprasevalec.component';
import { subscribedCategorie } from './subscribed_categorie.component'; ///
import { Settings } from './settings.component';
import { PonudnikStats } from './ponudnik_stats.component';
import { offerView } from './offer.component';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

//fullpage include
import { MnFullpageModule } from "ngx-fullpage";

//navbar(s)
import {NavbarComponent} from './navbar.component';

import 'hammerjs'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save hammerjs`)
import 'mousetrap'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save mousetrap`)
import { ModalGalleryModule } from 'angular-modal-gallery'; // <----------------- angular-modal-gallery library import

import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css';
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-timepicker/css/bootstrap-timepicker.min.css';
import 'bootstrap-timepicker/js/bootstrap-timepicker.js';

import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import * as $ from 'jquery';

@NgModule({
  declarations: [
    //components
    AppComponent,
    Firstpage,
    Signup,
    Login,
    Mainpage,
    Home,
    ponudnikView,
    povprasevalecView,
    Header,
    Jobponudnik,
    Joblistponudnik,
    Jobpovprasevalec,
    Joblistpovprasevalec,
    subscribedCategorie,
    //navbar(s)
    NavbarComponent,
    Settings,
    Private_joblistponudnik,
    Private_jobponudnik,
    Private_joblistpovprasevalec,
    Private_jobpovprasevalec,
    PonudnikStats,
    offerView
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes,
    ChartsModule,
    MnFullpageModule.forRoot(),
    NgbModule.forRoot(),
    Ng2Bs3ModalModule,
    ModalGalleryModule.forRoot(),
    NKDatetimeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCY3lW8ssu5AajlMUV1hyC85xkRBw64ltU'
    })
  ],
  providers:  [],
  bootstrap: [AppComponent]
})
export class AppModule { }
