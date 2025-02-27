import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/authService';
import { ProfileService } from '../services/profile.services';
import { User } from '../model/User';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { EmployeeModel } from '../model/Employee';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[CommonModule,ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userEmail: string = '';
  userId: string = '';
  userProfile: any = null;
  modalInstance: any;
  employeeCount: number = 0;
  employees: EmployeeModel[] = [];
  showLoader:boolean=false;
  updatestatusmessage?:string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private profileService: ProfileService
  ) {}


 

  
  ngOnInit(): void {

 

   

    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.showLoader=true;
        this.userEmail = user.email;
        this.userId = user.id;
        this.loadUserProfile();
      }
    });

    this.employeeService.getAllEmployees().subscribe( {next:(data) => {
      this.employees=data;
      this.employeeCount=data.length;
     
    },error:(error)=>{
      // console.log(error);
     console.log(error);

  }});

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      contactNum: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    // Initialize Bootstrap Modal
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  }

  // Load existing user profile data
  loadUserProfile() {
    this.showLoader=true;
    this.profileService.getProfile(this.userId).subscribe((data) => {
      if (data) {
        this.userProfile = data;
        this.profileForm.patchValue(data);
        this.showLoader = false;
      }
      else{
        setTimeout(()=>{
          this.showLoader=false;
         this.updatestatusmessage="Please update the details";

        },5000)
      }
    });
  }

  openModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  onSave() {
    if (this.profileForm.invalid) return;

    const profileData = {
      ...this.profileForm.value,
      email: this.userEmail,
      userId: this.userId
    };

    this.profileService.updateProfile(profileData).subscribe(() => {
      alert('Profile Updated Successfully!');
      this.updatestatusmessage='';
      this.userProfile = profileData;
      this.closeModal(); // Close modal after saving
    });
  }
}
