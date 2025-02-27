
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminLoginComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-component/admin-component.component';
import { AdminGuard } from './admin-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'admin',component:AdminLoginComponent},


    { 
    path: 'admin', 
    
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent,canActivate:[AdminGuard] },
     
    ] 
  },




  // {path:'admin-dashboard',component:AdminDashboardComponent,canActivate:[AdminGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]}
];
