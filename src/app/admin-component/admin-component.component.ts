
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';


import { CommonModule } from '@angular/common';
import { AdminDashboardervice } from '../services/admin-dashboard.services';
import { EmployeeModel } from '../model/Employee';

import { AdminService } from '../services/admin.service';





@Component({
  selector: 'app-admin-component',
  imports: [CommonModule],
  templateUrl: './admin-component.component.html',
  styleUrl: './admin-component.component.css'
})
export class AdminDashboardComponent implements OnInit,OnChanges{
  employees: EmployeeModel[] = [];
   profiles:any[]=[];
   isLoading:boolean=false;
   isLoading1:boolean=false;
  constructor(private admindashboardserv:AdminDashboardervice,private adminServ:AdminService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading=true;
    this.isLoading1=true;
    this.admindashboardserv.getAllEmployees().subscribe(data => {
      this.employees = data;
      this.isLoading=false;
    });
    this.admindashboardserv.getAllProfile().subscribe((data) => {
      if (data) {
       this.profiles=data;
       this.isLoading1=false;
      }
      else{
        // setTimeout(()=>{
        //   this.showLoader=false;
        //  this.updatestatusmessage="Please update the details";

        // },5000)
      }
    });
  }
  LoadData(){
    this.isLoading=true;
    this.isLoading1=true;
    this.admindashboardserv.getAllEmployees().subscribe(data => {
      this.employees = data;
      this.isLoading=false;
    });
    this.admindashboardserv.getAllProfile().subscribe((data) => {
      if (data) {
       this.profiles=data;
       this.isLoading1=false;
      }
      else{
        // setTimeout(()=>{
        //   this.showLoader=false;
        //  this.updatestatusmessage="Please update the details";

        // },5000)
      }
    });
  }

  ngOnInit(): void {
    this.LoadData();
  }

  logout() {
    this.adminServ.logout();
    }

}
