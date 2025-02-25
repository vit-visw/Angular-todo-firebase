import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { AuthResponse } from "../model/AuthResponse";
import { User } from "../model/User";


@Injectable({
    providedIn: 'root'
}) 
export class AuthService { 
    http: HttpClient = inject(HttpClient); 
    router: Router = inject(Router);

    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();
    private tokenExpirationTimer: any;
    user_s:any=null;

    signup(email: string, password: string): Observable<AuthResponse> { 
        const data = { email, password, returnSecureToken: true }; 

        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA',
            data
        ).pipe(
            tap((res) => this.handleAuthentication(res))
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const data = { email, password, returnSecureToken: true }; 

        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA',
            data
        ).pipe(
            tap((res) => this.handleAuthentication(res))
        );
    }

    autoLogin() {
        const userData: { email: string, id: string, token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.token) return;

        const loadedUser = new User(userData.email, userData.id, userData.token, new Date(userData.tokenExpirationDate));
        if (loadedUser.token) {
            this.userSubject.next(loadedUser);
            const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.userSubject.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.router.navigate(['/login']);
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(res: AuthResponse) {
        const expiresIn = new Date(new Date().getTime() + +res.expiresIn * 1000);
        const user = new User(res.email, res.localId, res.idToken, expiresIn);
         this.user_s=user;
         
        this.userSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(+res.expiresIn * 1000);
        this.router.navigate(['/dashboard']);
    }
}
