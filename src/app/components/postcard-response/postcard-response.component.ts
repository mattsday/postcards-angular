import {
  ChangeDetectionStrategy,
  Component,
  signal,
  input,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { provideMarkdown } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PostcardResponse } from '../../../lib/schema/postcard-request';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-postcard-response',
  imports: [
    NgIf,
    MarkdownModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  providers: [provideMarkdown()],
  templateUrl: './postcard-response.component.html',
  styleUrl: './postcard-response.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostcardResponseComponent {
  data = input.required<PostcardResponse | null>();
  loading = input<boolean>(false);

  readonly panelOpenState = signal(true);
}
