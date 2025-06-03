import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth/auth.service'; // Import AuthService
import { AuthGuard } from './auth/auth.guard'; // Import AuthGuard

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    HttpClientModule // Add HttpClientModule here
  ],
  providers: [
    AuthService, // Provide AuthService
    AuthGuard    // Provide AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }