import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.example.com/auth/login'; // Replace with actual API endpoint
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap(() => this.isAuthenticated = true),
      catchError(error => {
        return throwError(() => new Error('Login failed: ' + error.error.message));
      })
    );
  }

  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}