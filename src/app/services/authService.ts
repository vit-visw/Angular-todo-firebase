import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthResponse } from "../model/AuthResponse";

@Injectable({
    providedIn: 'root'
}) 
export class AuthService { 
    http: HttpClient = inject(HttpClient); 

    signup(email: string, password: string): Observable<AuthResponse> { 
        const data = { email, password, returnSecureToken: true }; 

        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA',
            data
        );
    }
    login(email:string,password:string):Observable<AuthResponse>{
        const data = { email, password, returnSecureToken: true }; 

        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyABZ2IX-YxCd5F8hEz1s1Ab10cq68oGkTA',
            data
        ); 

    }
}
