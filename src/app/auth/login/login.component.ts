import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  private failedAttempts = 0;
  private maxAttempts = 5;
  private lockoutTime = 300000; // 5 minutes

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.logincontinueForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9!@#$%^&*]*$')
      ]]
    });
  }

  onSubmit(): void {
    if (this.failedAttempts >= this.maxAttempts) {
      this.errorMessage = 'Too many attempts. Please try again later.';
      setTimeout(() => this.failedAttempts = 0, this.lockoutTime);
      return;
    }
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.failedAttempts = 0;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
        this.failedAttempts++;
      }
    });
  }
}