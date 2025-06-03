import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  assets: any[] = [];
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAssets();
  }

  private loadAssets(): void {
    // Simulate loading assets - replace with actual API call
    setTimeout(() => {
      this.assets = [
        { id: 1, name: 'Laptop Dell XPS 13', type: 'Computer', status: 'Active', location: 'Office A' },
        { id: 2, name: 'iPhone 13 Pro', type: 'Mobile Device', status: 'Active', location: 'Office B' },
        { id: 3, name: 'Samsung Monitor 27"', type: 'Display', status: 'Maintenance', location: 'Office A' },
        { id: 4, name: 'Office Chair Ergonomic', type: 'Furniture', status: 'Active', location: 'Office C' }
      ];
      this.isLoading = false;
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}