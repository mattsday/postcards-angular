import { ChangeDetectionStrategy, Component, signal, input } from '@angular/core';
import { NgIf } from '@angular/common';
import { provideMarkdown } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-postcard-response',
  imports: [NgIf, MarkdownModule, MatExpansionModule, MatCardModule],
  providers: [provideMarkdown()],
  templateUrl: './postcard-response.component.html',
  styleUrl: './postcard-response.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostcardResponseComponent {
  image = input.required<string>();
  story = input.required<string>();
  map = input.required<string>();
  description = input.required<string>();

  readonly panelOpenState = signal(true);
}
