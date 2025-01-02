import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth = inject(Auth);
  private provider = new GoogleAuthProvider();
  router: Router = inject(Router);
  user$ = user(this.auth);

  constructor() {}

  login() {
    signInWithPopup(this.auth, this.provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.router.navigate(['/']);
      return credential;
    });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/', 'login']);
      })
      .catch((error) => {
        console.error('sign out error: ' + error);
      });
  }
}
