import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, Signal } from '@angular/core';
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
import { LoadingButtonComponent } from "../../components/general/loading-button/loading-button.component";

@Component({
  selector: 'app-home',
  imports: [
    // NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingButtonComponent
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

  placeEvent(t: string, e: Event) {
    const eventValue = (e.target as HTMLSelectElement).value;
    const place = eventValue as unknown as google.maps.places.Place;
    console.log(place);
    this.postcardForm.patchValue({ [t]: `${place.displayName}, ${place.formattedAddress}` || '' });
    // console.log(e);
    console.log(this.postcardForm.value);
  }
}
