import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginResponse {
  message: string;
  token?: string; // Assuming your backend returns a token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.apiUrl}/login`; // Backend login API endpoint

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials)
      .pipe(
        tap(response => {
          // On successful login, you would typically store a token here:
          // if (response.token) {
          //   localStorage.setItem('authToken', response.token);
          // }
          console.log('Login successful:', response);
          this.router.navigate(['/home']); // Navigate to home on success
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied.';
      } else if (error.status === 404) {
        errorMessage = 'Login endpoint not found.';
      } else {
        errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    // localStorage.removeItem('authToken'); // Remove token if stored
    this.router.navigate(['/login']);
  }
}