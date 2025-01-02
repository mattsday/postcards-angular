import { Component, inject } from '@angular/core';
import { AlertComponent } from "../../components/general/alert/alert.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(AuthService);
}
