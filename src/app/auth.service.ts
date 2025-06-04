import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.example.com/login'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.status === 401) {
          errorMessage = 'Invalid credentials. Please try again.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}