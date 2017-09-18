import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { Firstpage } from './firstpage.component';
import { Login } from './login.component';
import { Signup } from './signup.component';
import { Mainpage } from './mainpage.component';
import { Home } from './home.component';
import { povprasevalecView } from './povprasevalec.component';
import { ponudnikView } from './ponudnik.component';
import { Settings } from './settings.component';
import { PonudnikStats } from './ponudnik_stats.component';

export const router: Routes = [
    {path: 'firstpage', component: Firstpage,
    children: [
      {path: 'login', component: Login},
      {path: 'signup', component: Signup}
    ]},
    {path: 'mainpage',component: Mainpage,
    children: [
      {path: 'home', component: Home},
      {path: 'ponudnik', component: ponudnikView},
      {path: 'stats', component: PonudnikStats, pathMatch: 'full'},
      {path: 'povprasevalec', component: povprasevalecView},
      {path: 'settings', component: Settings},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}
    ]},
    {path: '', redirectTo: 'firstpage',pathMatch: 'full'},
    {path: '**', redirectTo: 'firstpage', pathMatch: 'full'}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
