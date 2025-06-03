// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-endpoint.com/auth/login';
  private tokenKey = 'asset_mgmt_token';

  constructor(private http: HttpClient, private router: Router) { }

  login(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user).pipe(
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
