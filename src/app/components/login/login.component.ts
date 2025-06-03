import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use definite assignment assertion as it's initialized in ngOnInit
  loading = false; // Flag to indicate if login is in progress
  submitted = false; // Flag to track if the form has been submitted
  error = ''; // Holds any login error messages

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // If the user is already logged in, redirect them to the home page
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    // Initialize the login form with form controls and validation rules
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], // Username is required
      password: ['', Validators.required]  // Password is required
    });
  }

  // Convenience getter to easily access form controls in the template
  get f() { return this.loginForm.controls; }

  /**
   * Handles the form submission when the login button is clicked.
   */
  onSubmit(): void {
    this.submitted = true; // Mark form as submitted
    this.error = '';       // Clear any previous error messages

    // Stop if the form is invalid (e.g., empty fields)
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true; // Show loading indicator

    // Call the authentication service to attempt login
    this.authService.login(this.loginForm.value).subscribe({
      next: (success) => {
        if (success) {
          // If login is successful, navigate to the home page
          this.router.navigate(['/home']);
        } else {
          // This path might be hit if the backend responds with 200 but no token (unlikely for proper auth)
          this.error = 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      },
      error: (err) => {
        // Handle specific error messages from the AuthService
        this.error = err.message || 'An unexpected error occurred during login. Please try again.';
        this.loading = false; // Hide loading indicator on error
      }
    });
  }
}