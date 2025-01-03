import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import '@googlemaps/extended-component-library/api_loader.js';
import '@googlemaps/extended-component-library/place_picker.js';

import { environment } from '../../../environments/environment';
import { LoadingButtonComponent } from '../../components/general/loading-button/loading-button.component';
import { PostcardRequest, PostcardResponse } from '../../../lib/schema/postcard-request';
import { Auth, idToken } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  postcardForm = new FormGroup({
    sender: new FormControl(''),
    recipient: new FormControl(''),
    start: new FormControl(''),
    end: new FormControl(''),
  });
  mapsApiKey = environment.mapsPublic;

  loading = signal<boolean>(false);
  errorText = '';

  image = signal<string>('');
  story = signal<string>('');
  map = signal<string>('');

  // Firebase Auth sync - to get ID token
  private auth: Auth = inject(Auth);
  idTokenSubscription: Subscription;
  idToken$ = idToken(this.auth);
  private token: string | undefined;

  constructor() {
    // Subscribe to ID token from Firebase Auth
    this.idTokenSubscription = this.idToken$.subscribe((token) => {
      this.token = token || undefined;
    });
  }

  placeEvent(t: string, e: Event) {
    const eventValue = (e.target as HTMLSelectElement).value;
    const place = eventValue as unknown as google.maps.places.Place;
    this.postcardForm.patchValue({
      [t]: `${place.displayName}, ${place.formattedAddress}` || '',
    });
  }

  async processForm() {
    if (this.postcardForm.invalid) {
      return;
    }
    if (!this.token) {
      this.errorText = 'Unable to obtain auth token - try logging in again';
      return;
    }
    try {
      this.loading.set(true);
      const req: PostcardRequest = {
        sender: this.postcardForm.value.sender || '',
        recipient: this.postcardForm.value.recipient || '',
        start: this.postcardForm.value.start || '',
        end: this.postcardForm.value.end || '',
      };
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        const errorData = await response.json();
        this.errorText = `Voting failed: ${response.status} - ${
          errorData.message || response.statusText
        }`;
        return
      }
      const data = await response.json() as PostcardResponse;
      this.image.set(data.image);
      this.story.set(data.story);
      this.map.set(data.map);
    } catch (error) {
      this.errorText = `${error}`;
    } finally {
      this.loading.set(false);
    }
  }
}
