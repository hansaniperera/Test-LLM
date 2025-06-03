import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = null; // Clear previous errors

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // Navigation to /home is handled by AuthService
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.loginError = error.error?.message || error.message || 'Login failed. Please try again.';
          if (error.status === 401) {
            this.loginError = 'Invalid username or password.';
          } else if (error.status === 0) {
            this.loginError = 'Could not connect to the server. Please check your network connection.';
          }
        }
      });
  }
}