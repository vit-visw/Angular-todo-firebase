import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { Login } from '../model/Login';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-login',
  imports:[ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  authService:AuthService=inject(AuthService);
  loginForm: FormGroup=new FormGroup({});
  loginObject:Login=new Login()
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;

 

  constructor() {
    
    this.loginForm = new FormGroup({
      email: new FormControl(this.loginObject.email, [Validators.required, Validators.email]),
      password:new FormControl(this.loginObject.password,[Validators.required, Validators.minLength(8)])
     
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmitted() { 
    if (!this.isLoginMode) { // REGISTER
        this.isLoading = true;
        const { email, password } = this.loginForm.value; 
        this.authService.signup(email, password).subscribe({ 
            next: () => { this.isLoading = false; },
            error: (err) => { 
                this.errorMessage = err.error.error.message; 
                this.isLoading = false; 
            }
        });
    } else { // LOGIN
        this.isLoading = true;
        const { email, password } = this.loginForm.value; 
        this.authService.login(email, password).subscribe({ 
            next: () => { this.isLoading = false; },
            error: (err) => { 
                this.errorMessage = err.error.error.message; 
                this.isLoading = false; 
            }
        });
    }
}


 
}
