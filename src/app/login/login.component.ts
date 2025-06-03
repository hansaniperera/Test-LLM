import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const credentials = { username: this.username, password: this.password };
    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.errorMessage = 'Invalid credentials. Please try again.'
    });
  }
}
