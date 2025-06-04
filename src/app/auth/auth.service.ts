import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private refreshUrl = `${environment.apiUrl}/refresh`;
  private logoutUrl = `${environment.apiUrl}/logout`;
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password })
      .pipe(
        tap(() => {
          this.isAuthenticated = true;
          this.router.navigate(['/home']);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(this.refreshUrl, {})
      .pipe(
        tap(() => this.isAuthenticated = true),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.http.post(this.logoutUrl, {}).subscribe({
      complete: () => {
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again.';
    if (error.status === 401) {
      errorMessage = 'Invalid username or password.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    // Sanitize error message to prevent XSS
    return throwError(() => new Error(errorMessage.replace(/<[^>]*>/g, '')));
  }
}