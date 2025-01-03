import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'fun-with-postcards',
        appId: '1:917408326342:web:d725a1b516b96a67822dc7',
        storageBucket: 'fun-with-postcards.firebasestorage.app',
        apiKey: 'AIzaSyC6Uq_E0gBA1_dYhTze6LiJGyEbHSbbJtc',
        authDomain: 'fun-with-postcards.firebaseapp.com',
        messagingSenderId: '917408326342',
        measurementId: 'G-4V822SZQ7K',
      })
    ),
    provideAuth(() => getAuth()),
    // provideAppCheck(() => {
    //   const provider =
    //     new ReCaptchaEnterpriseProvider(environment.recaptchaPublic);
    //   return initializeAppCheck(undefined, {
    //     provider,
    //     isTokenAutoRefreshEnabled: true,
    //   });
    // }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAnimationsAsync(),
  ],
};
