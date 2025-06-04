import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!)
        .subscribe({
          error: (err) => {
            this.errorMessage = err.error?.message || 'Login failed. Please try again.';
          }
        });
    }
  }
}
