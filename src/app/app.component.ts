import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>', // This renders the component corresponding to the active route
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'asset-management-system';
}