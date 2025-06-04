import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule // Important for routing within AuthModule if needed, though login route is in app-routing
  ],
  exports: [
    LoginComponent // Export if you need to use it in other modules (e.g., App Module)
  ]
})
export class AuthModule { }