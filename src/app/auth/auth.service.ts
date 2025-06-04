import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface UserCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-backend-api.com/api/login'; // Use HTTPS!
  private loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(credentials: UserCredentials): Observable<any> {
    // Don't store tokens in localStorage; use HTTP-only cookies (set by backend)
    return this.http.post<any>(this.apiUrl, credentials, { withCredentials: true }).pipe(
      tap(() => this.loggedIn$.next(true)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    // Endpoint should clear the cookie
    return this.http.post('https://your-backend-api.com/api/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.loggedIn$.next(false)),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): Observable<boolean> {
    // Optionally, check with backend for session validity
    return this.loggedIn$.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred!';
    if (error.error && error.error.message) {
      msg = error.error.message;
    }
    return throwError(() => msg);
  }
}
