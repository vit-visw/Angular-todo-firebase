import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { of } from 'rxjs';
import { User } from '../model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    
  private adminTokenSubject = new BehaviorSubject<User | null>(null);
  adminToken$ = this.adminTokenSubject.asObservable();
  
  private readonly API_KEY = 'AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA';
    private readonly LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  constructor(private http: HttpClient,private router:Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(this.LOGIN_URL, { email, password, returnSecureToken: true }).pipe(
      tap(res => {
        const expirationDate = new Date(new Date().getTime() + Number(res.expiresIn) * 1000);
        const user = new User(res.email, res.localId, res.idToken, expirationDate);
        this.adminTokenSubject.next(user);
        localStorage.setItem('adminData', JSON.stringify(user));
      })
    );
  }

//   getAdminToken(): string | null {
//     return localStorage.getItem('admin');
//   }
logoutauto(){
  this.adminTokenSubject.next(null);
    localStorage.removeItem('adminData');
}
  logout() {
    this.adminTokenSubject.next(null);
    localStorage.removeItem('adminData');
    this.router.navigate(['/admin']);
  }

   
  autoLogin(): void {
    const userData = localStorage.getItem('adminData');
    if (!userData) return;

    const parsedUser = JSON.parse(userData);
//   console.log(parsedUser);
    // Recreate a proper User instance
    const loadedUser = new User(
        parsedUser.email,
        parsedUser.id,
        parsedUser._token,
        new Date(parsedUser._tokenExpirationDate) // Convert string to Date
    );
    // console.log(parsedUser._tokenExpirationDate);

    if (!loadedUser.token) {
        this.logout();
        return;
    }

    this.adminTokenSubject.next(loadedUser);
    
    
    // Calculate remaining session time and auto logout
    const expirationDuration = new Date(parsedUser._tokenExpirationDate).getTime() - new Date().getTime();
    console.log(expirationDuration);
    // this.autoLogout(expirationDuration);
    this.router.navigate(['/admin/admin-dashboard']);
}

}
