import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggingOut = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.loggingOut = true;
    this.authService.logout()
      .pipe(finalize(() => this.loggingOut = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed:', err);
          // Even if backend logout fails, clear frontend state and navigate
          this.router.navigate(['/login']);
        }
      });
  }
}