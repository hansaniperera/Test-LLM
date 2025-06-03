import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Basic client-side validation
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    // Sanitize inputs (Angular's template binding handles XSS)
    this.authService.login(this.user).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          this.authService.setToken(response.token); // Store JWT
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }
}