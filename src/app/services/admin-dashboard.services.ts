import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, take } from 'rxjs';
import { EmployeeModel } from '../model/Employee';
import { AuthService } from './authService';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardervice {
    private apiUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json';
  private http = inject(HttpClient);
  private adminServ=inject(AdminService);

 

//   getAllEmployees(): Observable<EmployeeModel[]> {
//     const url_with_authToken = 'https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNjI2MmYzZTk3NzIzOWMwMDUzY2ViODY0Yjc3NDBmZjMxZmNkY2MiLCJ0eXAiOiJKV1QifQ';
  
  
//     return this.http.get<{ [key: string]: EmployeeModel }>(url_with_authToken).pipe(
//       map(res => {
//         let emps: EmployeeModel[] = [];
//         for (let key in res) {
//           emps.push({ ...res[key], id: key });
//         }
//         return emps;
//       })
//     );
//   }


  private appendAuthParams(url: string): Observable<string> {
    return this.adminServ.adminToken$.pipe(
      take(1), 
      map(user => user?.token ? `${url}?auth=${user.token}` : url)
    );
  }

  getAllEmployees(): Observable<EmployeeModel[]> { 
    return this.adminServ.adminToken$.pipe(
      take(1),
      switchMap(user => {
        if (!user) return ([]); // Return empty if no user
        return this.appendAuthParams(this.apiUrl).pipe(
          switchMap(url => this.http.get<{ [key: string]: EmployeeModel }>(url)),
          map(res => {
            let emps: EmployeeModel[] = [];
            for (let key in res) {
             // Filter by user ID
                emps.push({ ...res[key], id: key });
              
            }
            return emps;
          })
        );
      })
    );
  }

  getAllProfile(): Observable<any> {


    return this.adminServ.adminToken$.pipe(
        take(1),
        switchMap(user => {
          if (!user) return ([]); // Return empty if no user
          return this.appendAuthParams('https://httpprojectdemo-default-rtdb.firebaseio.com/profiles.json').pipe(
            switchMap(url => this.http.get<{ [key: string]: EmployeeModel }>(url)),
            map(res => {
              let emps: any[] = [];
              for (let key in res) {
               // Filter by user ID
                  emps.push({ ...res[key], id: key });
                
              }
              return emps;
            })
          );
        })
      );
    
  }

  
  
      


}
