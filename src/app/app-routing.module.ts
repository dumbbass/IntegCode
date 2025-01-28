import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './USERS/register/register.component';
import { AuthGuard } from './auth.guard';
import { UserprofileComponent } from './USERS/userprofile/userprofile.component'; // Ensure the correct path
import { InformationComponent } from './ADMIN/information/information.component';
import { DashboardComponent } from './USERS/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'informal', component: InformationComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
