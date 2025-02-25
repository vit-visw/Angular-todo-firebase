
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpClientModule, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable, Subject, catchError, map, switchMap, take, throwError } from 'rxjs';
import { EmployeeModel } from '../model/Employee';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json';
  private apiUrl1='https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaHR0cHByb2plY3RkZW1vIiwiYXVkIjoiaHR0cHByb2plY3RkZW1vIiwiYXV0aF90aW1lIjoxNzQwMzk5MzYzLCJ1c2VyX2lkIjoibkl2cHpETk1GWWg4Y0pIMHJvcjY3UVd1Q2FsMiIsInN1YiI6Im5JdnB6RE5NRlloOGNKSDByb3I2N1FXdUNhbDIiLCJpYXQiOjE3NDAzOTkzNjMsImV4cCI6MTc0MDQwMjk2MywiZW1haWwiOiJ2aXN3YXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInZpc3dhc0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.RzpkdTEazhyZI6ZLL7Yycegdnh2-K6_L864pqPbiqIbDkv5iCX2FAgGHWciD-PY1n_OFT2gMFmhzol25LzhlxQvkYDmvrhZxgkaZN9WeIg3_agzL7sEATiG31TONosQiBlc68vhi9Z1_nELH1biWHyV0kZJmj0azrph1UtBWdyeeqH7NuNwnySbmYYnQkyOUyyWqe7N_b2LrEWI3H2LObqZ3LIe5Uta1cM4t5PgbYdNA0CRa4UOHW2E0ErqQfEZPTagcJB1ZavqedVgj9dkoAbtLML2_U6S1slYiH4w1hrpMmqLE176UdkI-TVyxNmlFMd06kQkFouUXYENnMzetyg';
  private http = inject(HttpClient);
  authService:AuthService=inject(AuthService);
 
  
 
  private _token=this.authService.user_s?.token;
  params = new HttpParams().set('auth',this._token);
  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<{ [key: string]: EmployeeModel }>(this.apiUrl,{params:this.params}).pipe(
      map((res) => {
        let emps: EmployeeModel[] = [];
        for (let key in res) {
          emps.push({ ...res[key], id: key });
        }
        return emps;
      })
    );
  }
 

  addEmployee(employee: EmployeeModel):Observable<any>{
   
    return this.http.post<{ name: string }>(this.apiUrl, employee);
                // this.http.post<{name:String}>(this.apiUrl,employee).subscribe((response)=>{
                //     console.log(response);
                // });
  }

  updateEmployee(employee: EmployeeModel): Observable<any> {
    return this.http.put(`${this.apiUrl.replace('.json', '')}/${employee.id}.json`, employee,{ observe: 'body' });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl.replace('.json', '')}/${id}.json`);
  }

 
}
