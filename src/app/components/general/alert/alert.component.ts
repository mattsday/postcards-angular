import {
  NgClass,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  imports: [NgClass, MatIcon, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  type = input.required<string>();
  body = input.required<string>();
  title = input.required<string>();
}
