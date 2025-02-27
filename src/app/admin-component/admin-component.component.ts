
import { Component, OnDestroy, OnInit } from '@angular/core';


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
export class AdminDashboardComponent implements OnInit{
  employees: EmployeeModel[] = [];
   profiles:any[]=[];
  constructor(private admindashboardserv:AdminDashboardervice,private adminServ:AdminService) {}
  // ngOnDestroy(): void {
  // this.logout();
  // }

  ngOnInit(): void {
    this.admindashboardserv.getAllEmployees().subscribe(data => {
      this.employees = data;
    });
    this.admindashboardserv.getAllProfile().subscribe((data) => {
      if (data) {
       this.profiles=data;
      }
      else{
        // setTimeout(()=>{
        //   this.showLoader=false;
        //  this.updatestatusmessage="Please update the details";

        // },5000)
      }
    });
  }

  logout() {
    this.adminServ.logout();
    }

}
