import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';     // Required for form validation and handling
import { HttpClientModule } from '@angular/common/http';   // Required for making HTTP requests to the backend

import { AppRoutingModule } from './app-routing.module'; // Your routing module
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,       // Provides common directives and pipes
    AppRoutingModule,    // Configures application routes
    ReactiveFormsModule, // Enables reactive forms functionality
    HttpClientModule     // Enables HTTP client for API interactions
  ],
  providers: [], // Services like AuthService are provided in 'root' via @Injectable({ providedIn: 'root' })
  bootstrap: [AppComponent] // The root component to bootstrap
})
export class AppModule { }