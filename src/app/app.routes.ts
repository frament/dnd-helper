import { Routes } from '@angular/router';
import {Auth} from './auth/auth';
import {Main} from './main/main';
import {authGuard} from './auth/auth-guard';

export const routes: Routes = [
  {path:'auth', component: Auth},
  {path:'', component:Main, canActivate: [authGuard]},
];
