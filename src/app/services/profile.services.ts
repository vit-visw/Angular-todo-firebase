import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private dbUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/profiles'; // Replace with your second DB URL

  http = inject(HttpClient);

  // Fetch user profile by userId
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.dbUrl}/${userId}.json`);
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.dbUrl}/${profileData.userId}.json`, profileData);
  }
}
