import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './authService';
import { exhaustMap, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.user$.pipe(
    take(1),
    exhaustMap(user => {
      if (!user?.token) return next(req);

      const modifiedReq = req.clone({
        setParams: { auth: user.token }
      });

      return next(modifiedReq);
    })
  );
};
