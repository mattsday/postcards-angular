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
import {
  PostcardRequest,
  PostcardResponse,
} from '../../../lib/schema/postcard-request';
import { Auth, idToken } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { img } from './image';
import { PostcardResponseComponent } from '../../components/postcard-response/postcard-response.component';
import { mapImg } from './map';

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
    PostcardResponseComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  postcardForm = new FormGroup({
    sender: new FormControl('Matt'),
    recipient: new FormControl('Stephanie'),
    start: new FormControl('Battersea Power Station, London'),
    end: new FormControl('Tower Bridge, London'),
  });
  mapsApiKey = environment.mapsPublic;

  loading = signal<boolean>(false);
  errorText = '';

  image = signal<string>(img);
  story = signal<string>(`Dearest Friend,

I just had to send you a postcard from London! It's truly incredible here. The London Eye is a sight to behold, and the River Thames is even more beautiful in person. I'm currently enjoying a delicious cup of tea and a scone (of course!), and I can't wait to see what other adventures this city holds. Wish you were here!

Best,

Matt`);
  map = signal<string>(mapImg);
  description =
    signal<string>(`My journey from Battersea Power Station to Tower Bridge was a delight! I took in the sights of London's most iconic landmarks, including:

* **The Tate Britain:** A world-class art gallery, a must-visit for any art lover.
* **The Houses of Parliament:** An imposing building with a rich history, a symbol of British democracy.
* **Tower Bridge:** A stunning architectural masterpiece, offering breathtaking views of the city.
* **Buckingham Palace:** The official residence of the Queen, a glimpse into the lives of the royal family.
* **Borough Market:** A bustling market offering fresh produce, street food, and artisan goods.
* **St. Paul's Cathedral:** A magnificent cathedral with stunning architecture and a history dating back to the 7th century.`);

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
    if (this.postcardForm.invalid || this.loading()) {
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
        return;
      }
      const data = (await response.json()) as PostcardResponse;
      this.image.set(data.image);
      this.story.set(data.story);
      this.map.set(data.map);
      this.description.set(data.description);
    } catch (error) {
      this.errorText = `${error}`;
    } finally {
      this.loading.set(false);
    }
  }
}
