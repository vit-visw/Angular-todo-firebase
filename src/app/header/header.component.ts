import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports:[CommonModule]
})
export class HeaderComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  onLogout() {
    this.authService.logout();
  }
}
