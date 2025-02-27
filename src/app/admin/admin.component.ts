import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports:[ReactiveFormsModule],
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router) {

    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.adminService.autoLogin();
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.adminService.login(email, password).subscribe({next:() => {this.router.navigateByUrl('/admin/admin-dashboard')},
    error:(error) => {console.log(error);this.errorMessage = error.error.error.message;}
      
  }
    );
  }
}
