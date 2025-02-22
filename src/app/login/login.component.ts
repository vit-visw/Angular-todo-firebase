import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { Login } from '../model/Login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  loginForm: FormGroup;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
 

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmitted() {
    console.log(this.loginForm.value);
  }

 
}
