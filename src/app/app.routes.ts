import { Routes } from '@angular/router';
import {Auth} from './auth/auth';
import {Main} from './main/main';
import {authGuard} from './auth/auth-guard';
import {AdventureList} from './adventure-list/adventure-list';
import {Adventure} from './adventure/adventure';
import {Heroes} from './heroes/heroes';
import {Hero} from './heroes/hero/hero';
import {Wiki} from './wiki/wiki';

export const routes: Routes = [
  {path:'auth', component: Auth},
  {path:'', component:Main, canActivate: [authGuard]},
  {path:'adventures', component: AdventureList, canActivate: [authGuard]},
  {path:'adventures/:id', component: Adventure, canActivate: [authGuard]},
  {path:'heroes', component: Heroes, canActivate: [authGuard]},
  {path:'heroes/:id', component: Hero, canActivate: [authGuard]},
  {path:'wiki', component: Wiki, canActivate: [authGuard]},
];
