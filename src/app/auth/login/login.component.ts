import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = ''; // Clear previous error messages
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid username or password. Please try again.';
          }
        },
        error => {
          console.error('Login error:', error);
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password.';
    }
  }
}