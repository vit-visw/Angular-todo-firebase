import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { AuthResponse } from "../model/AuthResponse";
import { User } from "../model/User";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();
    private tokenExpirationTimer: any;
    private readonly API_KEY = 'AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA';
    private readonly LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
    private readonly SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;

    constructor(private http: HttpClient, private router: Router) {
        this.autoLogin();
    }

    signup(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.SIGNUP_URL, { email, password, returnSecureToken: true })
            .pipe(tap(res => this.handleAuthentication(res)));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.LOGIN_URL, { email, password, returnSecureToken: true })
            .pipe(tap(res => this.handleAuthentication(res)));
    }


    
    autoLogin(): void {
        const userData = localStorage.getItem('userData');
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
            this.autoLogout(0);
            return;
        }
    
        this.userSubject.next(loadedUser);
        
        
        // Calculate remaining session time and auto logout
        const expirationDuration = new Date(parsedUser._tokenExpirationDate).getTime() - new Date().getTime();
        console.log(expirationDuration);
        this.autoLogout(expirationDuration);
        this.router.navigate(['/home']);
    }
    

    logout(): void {
        if(confirm("Are you sure want ton logout?")){ 
        this.userSubject.next(null);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.router.navigate(['/login']);
    }
    }

    autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.userSubject.next(null);
            localStorage.removeItem('userData');
            if (this.tokenExpirationTimer) {
                clearTimeout(this.tokenExpirationTimer);
            }
    
            this.router.navigate(['/login']);
        }, expirationDuration);
    }

    private handleAuthentication(res: AuthResponse): void {
        const expirationDate = new Date(new Date().getTime() + Number(res.expiresIn) * 1000);
        const user = new User(res.email, res.localId, res.idToken, expirationDate);
        // console.log(res);
        this.userSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(Number(res.expiresIn) * 1000);
        this.router.navigate(['/home']);
    }
}
