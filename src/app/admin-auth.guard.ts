import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from './services/admin.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  adminService: AdminService = inject(AdminService);
  router: Router = inject(Router);

  canActivate() {
    return this.adminService.adminToken$.pipe(
      map(token => {
        if (!token) {
          this.router.navigate(['/admin']);
          return false;
        }
        return true;
      })
    );
  }
}
