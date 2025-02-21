import { CommonModule } from '@angular/common';
import { Component, inject, Injector, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { HttpClient,HttpClientModule, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'crud';
  employeeForm:FormGroup = new FormGroup({});
  employeeList : EmployeeModel[]=[];
  employeeObj:EmployeeModel = new EmployeeModel();
  http = inject(HttpClient);
  constructor() {
    this.createForm();
    this.LoadAllData();

  }
  ngOnInit(): void {
    
  }
  LoadAllData(){
    this.fetchAllData();
  }
 private fetchAllData(){ 
    this.http.get<{ [key: string]: EmployeeModel }>('https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json')
      .subscribe((res) => { 
        console.log(res);
  
        let emps: EmployeeModel[] = [];
  
        for (let key in res) {
          emps.push({ ...res[key] ,id:key}); 
        }
        
        this.employeeList = emps;
        console.log("updaated", this.employeeList);
      });
  }
  
  createNewForm(){
    this.employeeObj=new EmployeeModel();
    this.employeeForm = new FormGroup(
      {
          empId:new FormControl(this.employeeObj.empId),
          name:new FormControl(this.employeeObj.name,[Validators.required, Validators.minLength(3)]),
          city:new FormControl(this.employeeObj.city),
        state:new FormControl(this.employeeObj.state),
          emailId:new FormControl(this.employeeObj.emailId,  [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
          contactNum:new FormControl(this.employeeObj.contactNum, [ Validators.required,Validators.pattern('^[0-9]{10}$'),Validators.maxLength(10)]),
          address:new FormControl(this.employeeObj.address),
          pincode:new FormControl(this.employeeObj.pincode,  [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
          id:new FormControl(this.employeeObj.id)


      }
    )
  }
  createForm(){
   
    this.employeeForm = new FormGroup(
      {
          empId:new FormControl(this.employeeObj.empId),
          name:new FormControl(this.employeeObj.name,[Validators.required, Validators.minLength(3)]),
          city:new FormControl(this.employeeObj.city),
        state:new FormControl(this.employeeObj.state),
          emailId:new FormControl(this.employeeObj.emailId,  [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
          contactNum:new FormControl(this.employeeObj.contactNum, [ Validators.required,Validators.pattern('^[0-9]{10}$'),Validators.maxLength(10)]),
          address:new FormControl(this.employeeObj.address),
          pincode:new FormControl(this.employeeObj.pincode,  [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
          id:new FormControl(this.employeeObj.id)


      }
    )
  }

  onSave() {
    console.log(this.employeeForm.value);

    // Ensure HttpClient is properly injected
    if (!this.http) {
      console.error('HttpClient is not initialized.');
      return;
    }
  
    const headers = new HttpHeaders({'myheader':'hello-world'});
    this.http.post<{name:string}>('https://httpprojectdemo-default-rtdb.firebaseio.com/employees.json', this.employeeForm.value,{headers:headers})
      .subscribe({
        next: (response) => {
          console.log('Response from Firebase:', response);
        },
        error: (error) => {
          console.error('Error while saving data to Firebase:', error);
        }
      });
    this.LoadAllData();
    this.employeeObj = new EmployeeModel();
   
    this.createNewForm();
    
  }

  trackByEmpId(index: number, employee: EmployeeModel): number {
    return employee.empId; // Tracking by unique employee ID
  }
  OnEdit(item:EmployeeModel){
  this.employeeObj = item;
 this.createForm();
  }
  onReset(){
    this.createNewForm();
  }
  onUpdate(){
    if(this.employeeForm.valid){
      let data=this.employeeForm.value;
      this.http.put<{name:string}>('https://httpprojectdemo-default-rtdb.firebaseio.com/employees/'+data.id+'.json', data)
      .subscribe((response)=>{console.log(response);});
  this.LoadAllData();
  this.createNewForm();
    }
   
  }
  
  OnDelete(id:string| undefined){
  this.http.delete('https://httpprojectdemo-default-rtdb.firebaseio.com/employees/'+id+'.json').subscribe();
  this.LoadAllData();
  this.createForm();
    
  }
  
 
  

}
