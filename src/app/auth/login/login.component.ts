import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators'; // For final callback regardless of success/error

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect to home if already logged in (e.g., valid session/token)
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Added minLength
      password: ['', [Validators.required, Validators.minLength(6)]]  // Added minLength
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null; // Clear previous errors

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password)
      .pipe(finalize(() => { this.loading = false; })) // Ensure loading is reset
      .subscribe({
        next: (response) => {
          // No direct token storage here. AuthService handles it (e.g., from HttpOnly cookie set by backend)
          console.log('Login successful. Redirecting...');
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please check your credentials.';
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
          console.error('Login error:', error);
          // Potential CAPTCHA integration here if multiple failed attempts
        }
      });
  }
}