import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.example.com/login'; // Replace with your secure HTTPS API endpoint

  constructor(private http: HttpClient) {}

  login(user: User): Observable<{ success: boolean, token?: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Helps with CSRF protection
    });
    return this.http.post<{ success: boolean, token?: string }>(this.apiUrl, user, { headers })
      .pipe(
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token); // Store JWT securely
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}