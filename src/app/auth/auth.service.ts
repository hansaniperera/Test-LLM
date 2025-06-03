import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<boolean> {
    // In a real application, you'd post credentials to your backend
    // and expect a token or success/failure response.
    // For demonstration, we'll simulate a successful login if username is 'user' and password is 'password'.
    // Replace this with an actual HTTP POST request to your backend login endpoint.

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // Assuming your backend sends a success status or a token upon successful login
        if (response && response.token) { // Example: if your backend returns a token
          localStorage.setItem('authToken', response.token); // Store the token
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        // Handle specific error codes if needed (e.g., 401 for invalid credentials)
        return of(false); // Return observable of false on error
      })
    );

    /* // Simulated login for demonstration (remove in production)
    if (credentials.username === 'user' && credentials.password === 'password') {
      localStorage.setItem('authToken', 'fake-jwt-token'); // Store a fake token
      return of(true);
    } else {
      return of(false);
    }
    */
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Check if a token exists
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remove the token on logout
  }
}