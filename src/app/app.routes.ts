import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PatientComponent } from './patient/patient.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MedicalreportsComponent } from './medicalreports/medicalreports.component';
import { AdminchatComponent } from './adminchat/adminchat.component';
import { BillingandinvoicingComponent } from './billingandinvoicing/billingandinvoicing.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { UserbillingComponent } from './userbilling/userbilling.component';
import { UsermedicalrecordsComponent } from './usermedicalrecords/usermedicalrecords.component';
import { UserchatComponent } from './userchat/userchat.component';
import { UserappointmentsComponent } from './userappointments/userappointments.component';
import { AuthGuard } from './auth.guard';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { SymptomsComponent } from './symptoms/symptoms.component';
import { InformationComponent } from './information/information.component';
import { UserreceiptComponent } from './userreceipt/userreceipt.component';
import { CreatereceiptComponent } from './createreceipt/createreceipt.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sidenav', component: SidenavComponent},
  { path: 'patient', component: PatientComponent},
  { path: 'admindashboard', component: AdmindashboardComponent},
  { path: 'schedule' , component: ScheduleComponent},
  { path: 'medicalreports', component: MedicalreportsComponent},
  { path: 'adminchat', component: AdminchatComponent},
  { path: 'billingandinvoicing', component: BillingandinvoicingComponent},
  { path: 'userprofile', component: UserprofileComponent},
  { path: 'userdashboard', component: UserdashboardComponent},
  { path: 'userbilling', component: UserbillingComponent},
  { path: 'usermedicalrecords', component: UsermedicalrecordsComponent}, 
  { path: 'userchat', component: UserchatComponent, canActivate: [AuthGuard] },
  { path: 'userappointments', component: UserappointmentsComponent},
  { path: 'adminlogin', component: AdminloginComponent },
  { path: 'symptoms', component: SymptomsComponent},
  { path: 'information', component: InformationComponent},
  { path: 'userreceipt', component: UserreceiptComponent},
  { path: 'createreceipt', component: CreatereceiptComponent},

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full'}, // Placeholder route
];
