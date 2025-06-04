import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginCredentials, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-domain.com/api'; // Use HTTPS in production
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // CSRF protection
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            this.setAuthData(response.user, response.token);
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Clear all auth data
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    return !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  private setAuthData(user: User, token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error - don't expose details
      errorMessage = 'Connection error. Please try again.';
    } else {
      // Server-side error - sanitize response
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 429:
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
      }
    }
    
    return throwError(() => errorMessage);
  }
}