import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './USERS/register/register.component';
import { UserchatComponent } from './USERS/userchat/userchat.component';
import { AuthGuard } from './auth.guard';
import { UserprofileComponent } from './USERS/userprofile/userprofile.component';
import { SymptomsComponent } from './ADMIN/symptoms/symptoms.component'; // Ensure the correct path
import { InformationComponent } from './ADMIN/information/information.component';
import { UserreceiptComponent } from './USERS/userreceipt/userreceipt.component';
import { CreatereceiptComponent } from './ADMIN/createreceipt/createreceipt.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userchat', component: UserchatComponent, canActivate: [AuthGuard] },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'symptoms', component: SymptomsComponent },
  { path: 'informal', component: InformationComponent },
  { path: 'userreceipt', component: UserreceiptComponent },
  { path: 'createreceipt', component: CreatereceiptComponent },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
