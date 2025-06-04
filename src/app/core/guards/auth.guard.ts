import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, map } from 'rxjs/operators'; // For using observable from AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn$.pipe( // Listen to changes in login status
      take(1), // Take the first emitted value and complete
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        } else {
          // Not logged in, redirect to the login page
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}