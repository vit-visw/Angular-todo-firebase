import { HttpClientModule,HttpClient,HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { EmployeeService } from '../services/employee.service';
import { LoggingService } from '../services/Logging.Service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  errorMesage:any =null;
  showLoader:boolean = false;
  employeeForm: FormGroup = new FormGroup({});
  employeeList: EmployeeModel[] = [];
  employeeObj: EmployeeModel = new EmployeeModel();

  constructor(private employeeService: EmployeeService ,private loggingService:LoggingService) {}

  ngOnInit(): void {
    this.createForm();
    this.loadAllData();
  }

  loadAllData(): void {
    this.showLoader=true;
    this.employeeService.getAllEmployees().subscribe( {next:(data) => {
      this.employeeList = data;
      this.showLoader=false;
    },error:(error)=>{
      // console.log(error);
      this.errorMesage=this.setErrorMessage(error);
      this.showLoader=false;
      setTimeout(()=>{
        this.errorMesage=null;
      },3000)

  }});
    
  }
  private setErrorMessage(err:HttpErrorResponse):any{
    console.log(err);
    if(err.error.error === 'Permission denied'){
      return "You dont have access to get data";
    }
  }

  createForm(): void {
  
    this.employeeForm = new FormGroup({
      name: new FormControl(this.employeeObj.name, [Validators.required, Validators.minLength(3)]),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]),
      contactNum: new FormControl(this.employeeObj.contactNum, [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
        Validators.maxLength(10)
      ]),
      address: new FormControl(this.employeeObj.address),
      pincode: new FormControl(this.employeeObj.pincode, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]),
      id: new FormControl(this.employeeObj.id)
    });
  }

  onSave(): void {
    if (this.employeeForm.invalid) return;
    this.employeeService.addEmployee(this.employeeForm.value).pipe(
      catchError((err) => {
          const errorObj = {
              statusCode: err.status || 500,
              errorMessage: err.message || 'Unknown error',
              datetime: new Date()
          };
          this.loggingService.logError(errorObj);
          return throwError(() => err);
      })
  ).subscribe(() => {
      this.loadAllData(); // Refresh list
      this.employeeObj = new EmployeeModel();
      this.createForm();
  });
                // this.employeeService.addEmployee(this.employeeForm.value);
                // this.loadAllData();
                // this.employeeObj=new EmployeeModel();
                // this.createForm();
  }

  onUpdate(): void {
    if (this.employeeForm.invalid) return;
    this.employeeService.updateEmployee(this.employeeForm.value).subscribe((data) => {
      console.log(data);
      this.loadAllData();
      this.employeeObj=new EmployeeModel();
      this.createForm();
    });
  }

  onDelete(id: string | undefined): void {
    if (id && confirm('Are you sure want to delete?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadAllData();
      });
    }
  }

  onEdit(item: EmployeeModel): void {
    this.employeeObj = item;
    this.createForm();
  }

  onReset(): void {
    this.employeeObj=new EmployeeModel();
    this.createForm();
  }

  trackByEmpId(index: number, employee: EmployeeModel): string |undefined {
    return employee.id;
  }

}
