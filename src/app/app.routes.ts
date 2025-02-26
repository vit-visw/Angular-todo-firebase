import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  {path:'home',component:HomeComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]}
];
