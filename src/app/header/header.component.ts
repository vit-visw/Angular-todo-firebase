import { AdminService } from './../services/admin.service';
import { Component, ElementRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/authService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports:[CommonModule,RouterModule]
})
export class HeaderComponent {
  constructor(
  public authService: AuthService,
  public adminService:AdminService,
  private router: Router,
  private el: ElementRef)
  {}
  

  ngOnInit(): void {
    this.setupNavbarToggle();
  }

  setupNavbarToggle() {
    const navbarNav = this.el.nativeElement.querySelector('.navbar-collapse');
    const navLinks = this.el.nativeElement.querySelectorAll('.nav-link');

    navLinks.forEach((link: HTMLElement) => {
      link.addEventListener('click', () => {
        if (navbarNav.classList.contains('show')) {
          navbarNav.classList.remove('show'); // Close menu
        }
      });
    });
  }


  onLogout() {
    this.authService.logout();
  }
}
