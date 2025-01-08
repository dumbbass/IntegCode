import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserchatComponent } from './userchat/userchat.component';
import { AuthGuard } from './auth.guard';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SymptomsComponent } from './symptoms/symptoms.component'; // Ensure the correct path
import { InformationComponent } from './information/information.component';
import { UserreceiptComponent } from './userreceipt/userreceipt.component';
import { CreatereceiptComponent } from './createreceipt/createreceipt.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'userchat', component: UserchatComponent, canActivate: [AuthGuard] },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'symptoms', component: SymptomsComponent },
  { path: 'informal', component: InformationComponent},
  { path: 'userreceipt', component: UserreceiptComponent},
  { path: 'createreceipt', component: CreatereceiptComponent},

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
