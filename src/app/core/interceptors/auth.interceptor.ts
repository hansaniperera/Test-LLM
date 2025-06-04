import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.accessToken;
    const isApiUrl = request.url.startsWith(environment.backendUrl);

    // Attach access token only if available and request is to our backend API
    // and not a login/refresh token request itself (to avoid infinite loops)
    if (accessToken && isApiUrl && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh-token')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
        // If your backend expects a CSRF token in a header, add it here too:
        // 'X-CSRF-TOKEN': 'your-csrf-token-here'
      });
    }

    return next.handle(request);
  }
}