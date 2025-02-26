import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, take } from 'rxjs';
import { EmployeeModel } from '../model/Employee';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper method to append the token dynamically
  private appendAuthParams(url: string): Observable<string> {
    return this.authService.user$.pipe(
      take(1), 
      map(user => user?.token ? `${url}?auth=${user.token}` : url)
    );
  }

  getAllEmployees(): Observable<EmployeeModel[]> { 
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) return ([]); // Return empty if no user
        return this.appendAuthParams(this.apiUrl).pipe(
          switchMap(url => this.http.get<{ [key: string]: EmployeeModel }>(url)),
          map(res => {
            let emps: EmployeeModel[] = [];
            for (let key in res) {
              if (res[key].usermail === user.email) { // Filter by user ID
                emps.push({ ...res[key], id: key });
              }
            }
            return emps;
          })
        );
      })
    );
  }
  

  // getAllEmployees(): Observable<EmployeeModel[]> {
  //   return this.appendAuthParams(this.apiUrl).pipe(
  //     switchMap(url => this.http.get<{ [key: string]: EmployeeModel }>(url)),
  //     map(res => {
  //       let emps: EmployeeModel[] = [];
  //       for (let key in res) {
  //         emps.push({ ...res[key], id: key });
  //       }
  //       return emps;
  //     })
  //   );
  // }

  // addEmployee(employee: EmployeeModel): Observable<any> {
  //   return this.appendAuthParams(this.apiUrl).pipe(
  //     switchMap(url => this.http.post<{ name: string }>(url, employee))
  //   );
  // }

  addEmployee(employee: EmployeeModel): Observable<any> { 
    return this.authService.user$.pipe(
      take(1), 
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        const employeeWithUserId = { ...employee, usermail:user.email }; // Attach user ID
        return this.appendAuthParams(this.apiUrl).pipe(
          switchMap(url => this.http.post<{ name: string }>(url, employeeWithUserId))
        );
      })
    );
  }
  


  // updateEmployee(employee: EmployeeModel): Observable<any> {
  //   return this.appendAuthParams(`${this.apiUrl.replace('.json', '')}/${employee.id}.json`).pipe(
  //     switchMap(url => this.http.put(url, employee))
  //   );
  // }
  // updateEmployee(employee: EmployeeModel): Observable<any> {
 
  //       return this.appendAuthParams(`${this.apiUrl.replace('.json', '')}/${employee.id}.json`).pipe(
  //         switchMap(url => this.http.put(url, employee))
  //       );
    
    
  // }

  updateEmployee(employee: Partial<EmployeeModel>): Observable<any> {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
  
        return this.appendAuthParams(`${this.apiUrl.replace('.json', '')}/${employee.id}.json`).pipe(
          switchMap(url => 
            this.http.get<EmployeeModel>(url).pipe(
              switchMap(existingEmployee => {
              
  
                // Merge new values while keeping other properties unchanged
                const updatedEmployee: EmployeeModel = {
                  ...existingEmployee,
                  ...employee, // Overwrites only provided fields
                  id: existingEmployee.id, // Ensure ID remains the same
                  usermail:existingEmployee.usermail,
                };
  
                return this.http.put(url, updatedEmployee);
              })
            )
          )
        );
      })
    );
  }
  

  

  deleteEmployee(id: string): Observable<any> {
    return this.appendAuthParams(`${this.apiUrl.replace('.json', '')}/${id}.json`).pipe(
      switchMap(url => this.http.delete(url))
    );
  }



}
