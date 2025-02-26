import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/authService';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        const isAuth = !!user;
        const isLoginRoute = route.routeConfig?.path === 'login';


        if (!isAuth && !isLoginRoute) {
          this.router.navigate(['/login']); // Store return URL
          return false;
        }

        return true;
      })
    );
  }
}
