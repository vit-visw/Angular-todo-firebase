import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpClientModule} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmployeeModel } from '../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json';
  private http = inject(HttpClient);

  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<{ [key: string]: EmployeeModel }>(this.apiUrl).pipe(
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
