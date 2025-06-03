import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // IMPORTANT: Replace with your actual backend login URL.
  // This should be an HTTPS endpoint in a production environment.
  private loginUrl = 'http://your-backend-api.com/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {
    // On service initialization, check for an existing token.
    // In a real application, you might also validate the token's expiry here.
  }

  /**
   * Sends user credentials to the backend for authentication.
   * On successful login, stores the authentication token.
   * @param credentials An object containing username and password.
   * @returns An Observable of boolean, true for success, false for failure.
   */
  login(credentials: any): Observable<boolean> {
    return this.http.post<any>(this.loginUrl, credentials).pipe(
      map(response => {
        // Assuming your backend returns a 'token' upon successful login.
        // It's recommended to use JWT (JSON Web Token) for authentication.
        if (response && response.token) {
          localStorage.setItem('authToken', response.token); // Securely store the token (e.g., in localStorage or sessionStorage)
          return true; // Login successful
        }
        return false; // Login failed (e.g., no token in response, although backend usually returns 401/403)
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Logs out the user by removing the authentication token and navigating to the login page.
   */
  logout(): void {
    localStorage.removeItem('authToken'); // Remove the stored token
    // Navigate back to the login page after logout
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the user is currently logged in based on the presence of an authentication token.
   * In a real application, this should also involve validating the token's integrity and expiry.
   * @returns True if a token exists, false otherwise.
   */
  isLoggedIn(): boolean {
    // Simple check: presence of a token.
    // For enhanced security, consider decoding JWT and checking expiry, or validating with backend.
    return !!localStorage.getItem('authToken');
  }

  /**
   * Handles HTTP errors from API calls.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that emits an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Invalid username or password.';
      } else if (error.error && error.error.message) {
        // Use a more specific error message from the backend if available
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }
    console.error(`Login Error: ${errorMessage}`, error); // Log the full error for debugging
    return throwError(() => new Error(errorMessage)); // Rethrow as an observable error for the component to handle
  }
}