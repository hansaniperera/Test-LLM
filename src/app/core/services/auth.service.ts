import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendUrl;
  // Use a BehaviorSubject to manage login status reactively
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  // Simulated in-memory storage for access token (for demo purposes only)
  // In a real app, this would be derived from a secure HttpOnly cookie
  private _accessToken: string | null = null;

  constructor(private http: HttpClient) {
    // On service initialization, check if already "logged in"
    // In a real app, this would involve checking for valid HttpOnly cookies
    this.checkLoginStatusOnInit();
  }

  // Method to check if the user is authenticated on app load
  // In a real app, this would try to validate existing HttpOnly cookies
  private checkLoginStatusOnInit(): void {
    // This is a placeholder. In a real scenario, the browser would
    // automatically send HttpOnly cookies on the first request.
    // A backend endpoint might return user info or a success status if the session is valid.
    // For now, we simulate being logged out initially until a successful login.
    // If you had a mechanism to receive an access token securely (e.g. from an HttpOnly cookie
    // parsed by a server-side rendered app or a secure channel), you'd set it here.
    console.log('AuthService initialized. Checking login status...');
    // For demonstration, let's assume we are NOT logged in initially unless a login happens.
    // If you have a backend endpoint to check session validity, call it here.
    // E.g., this.http.get(`${this.apiUrl}/check-session`).subscribe(...)
    this.loggedInSubject.next(false);
  }

  // Getter for the simulated access token
  get accessToken(): string | null {
    return this._accessToken;
  }

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    console.log('Attempting login...');

    // When the backend successfully authenticates, it should:
    // 1. Set a secure, HttpOnly, SameSite=Lax/Strict cookie containing the refresh token.
    // 2. Optionally, return a short-lived access token in the response body (less secure for session tokens)
    //    OR, prefer to only send the access token in subsequent HttpOnly cookies.
    // 3. For CSRF protection, the backend should send a CSRF token (e.g., in a header or body).
    //    The frontend needs to capture this and send it back with state-changing requests.

    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginPayload, {
      withCredentials: true // Important for sending/receiving cookies
    }).pipe(
      tap(response => {
        // If your backend *returns* an access token in the response body (not ideal for session):
        // This is still less secure than HttpOnly cookies for session tokens.
        // For demo, we simulate getting it.
        if (response && response.accessToken) {
          this._accessToken = response.accessToken; // Store in-memory
        }

        // Backend is responsible for setting HttpOnly cookies.
        // No direct `localStorage.setItem('authToken', ...)` here!
        this.loggedInSubject.next(true); // Update login status
        console.log('Login successful. Backend should have set HttpOnly cookies.');
      }),
      catchError(error => {
        console.error('AuthService Login failed:', error);
        this.loggedInSubject.next(false); // Ensure login status is false on error
        return throwError(() => new Error('Login failed. Please check credentials.')); // Re-throw a generic error for the component
      })
    );
  }

  // In a real application, this would primarily check for the existence of secure HttpOnly cookies
  // or the validity of an in-memory token (if used short-term with a refresh token).
  isLoggedIn(): boolean {
    // If using HttpOnly cookies, the browser handles the token,
    // so this method might need to make a lightweight backend call to validate the session.
    // For this example, we'll rely on the BehaviorSubject's state.
    return this.loggedInSubject.getValue();
  }

  logout(): Observable<any> {
    console.log('Attempting logout...');
    // Invalidate the session on the backend.
    // The backend should clear the HttpOnly cookie.
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true // Important for sending/receiving cookies
    }).pipe(
      tap(() => {
        this._accessToken = null; // Clear in-memory token
        this.loggedInSubject.next(false); // Update login status
        console.log('User logged out successfully. Backend cleared session.');
      }),
      catchError(error => {
        console.error('AuthService Logout failed:', error);
        // Even if logout fails on backend, we should clear frontend state
        this._accessToken = null;
        this.loggedInSubject.next(false);
        return throwError(() => new Error('Logout failed. Please try again.'));
      })
    );
  }

  // This method would be called by the ErrorInterceptor if a refresh token is needed
  // and the backend supports it.
  refreshToken(): Observable<any> {
    console.log('Attempting to refresh token...');
    // This request should typically rely on an HttpOnly refresh token cookie
    // that the browser automatically sends.
    return this.http.post<any>(`${this.apiUrl}/auth/refresh-token`, {}, {
      withCredentials: true // Important for sending/receiving refresh token cookie
    }).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this._accessToken = response.accessToken; // Update in-memory access token
          console.log('Access token refreshed.');
        } else {
          // If refresh token fails (e.g., expired, invalid), force logout
          this.logout().subscribe(); // Perform full logout
          throw new Error('Refresh token failed. User logged out.');
        }
      }),
      catchError(error => {
        console.error('Refresh token failed:', error);
        // On refresh failure, typically force logout
        this.logout().subscribe();
        return throwError(() => new Error('Refresh token failed. User logged out.'));
      })
    );
  }
}