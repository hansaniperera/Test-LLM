import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://your-backend-api.com/auth/login';
  private isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('auth_token'));

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(this.apiUrl, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticated.next(true);
          this.router.navigate(['/home']);
        }),
        catchError(error => throwError(() => error))
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }
}
