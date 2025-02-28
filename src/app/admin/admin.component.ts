import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports:[ReactiveFormsModule,CommonModule],
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
   isLoading:boolean=false;
  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {

    this.isLoading=false;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.adminService.autoLogin();
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.isLoading=true
    const { email, password } = this.loginForm.value;
    if(email === "admin@gmail.com"){
    this.adminService.login(email, password).subscribe({next:() => {
      this.isLoading=false;
      this.router.navigateByUrl('/admin/admin-dashboard');
    },
    error:(error) => {
      this.isLoading=false;
      console.log(error);
      this.errorMessage = error.error.error.message;}
      
  }
    );
  }
  else{
    this.isLoading=false;
    this.errorMessage="Invalid crediantials";
  }
  }
}
