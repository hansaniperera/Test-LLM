import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }, { withCredentials: true });
  }

  logout(): void {
    // Clear cookies on backend and client session (if any)
  }

  isAuthenticated(): boolean {
    // This should ideally verify a secure cookie or make a request to check session
    return !!document.cookie.match(/session_token=/);
  }
}
