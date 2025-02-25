import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/authService';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  canActivate() {
    return this.authService.user$.pipe(
      map(user => {
        if (!!user) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
