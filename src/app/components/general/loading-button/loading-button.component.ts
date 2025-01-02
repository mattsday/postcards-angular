import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-button',
  imports: [MatProgressSpinnerModule, MatButtonModule, NgIf],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss',
})
export class LoadingButtonComponent {
  loading = input.required<boolean>();
  disabled = input<boolean>(false);
  class = input<string>('');
  style = input<string>('');
}
