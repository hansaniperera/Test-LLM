import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { // Unauthorized - Access token expired or invalid
          return this.handle401Error(request, next);
        } else if (error.status === 403) { // Forbidden - User doesn't have permission
          console.error('Forbidden access:', error.error.message || error.message);
          // Redirect to login or a "forbidden" page
          this.authService.logout().subscribe(() => { // Force logout to clear session
            this.router.navigate(['/login'], { queryParams: { error: 'access_denied' } });
          });
          return throwError(() => error);
        }
        // For other errors, re-throw
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Clear previous token

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken); // Update with new access token
          // Retry the original request with the new token
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError((err: any) => {
          this.isRefreshing = false;
          // If refresh token fails, log out the user
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login'], { queryParams: { error: 'session_expired' } });
          });
          return throwError(() => err);
        })
      );
    } else {
      // If a refresh is already in progress, queue subsequent requests
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token)))
      );
    }
  }

  private addToken(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}