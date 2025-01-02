import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {
  canActivate,
  hasCustomClaim,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((mod) => mod.LoginComponent),
    ...canActivate(redirectLoggedInToItems),
  },
];
