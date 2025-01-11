import { Routes } from '@angular/router';
import { RegisterComponent } from './USERS/register/register.component';
import { LoginComponent } from './USERS/login/login.component';
import { SidenavComponent } from './USERS/sidenav/sidenav.component';
import { PatientComponent } from './ADMIN/patient/patient.component';
import { AdmindashboardComponent } from './ADMIN/admindashboard/admindashboard.component';
import { ScheduleComponent } from './ADMIN/schedule/schedule.component';
import { MedicalreportsComponent } from './ADMIN/medicalreports/medicalreports.component';
import { AdminchatComponent } from './ADMIN/adminchat/adminchat.component';
import { BillingandinvoicingComponent } from './ADMIN/billingandinvoicing/billingandinvoicing.component';
import { UserprofileComponent } from './USERS/userprofile/userprofile.component';
import { UserdashboardComponent } from './USERS/userdashboard/userdashboard.component';
import { UserbillingComponent } from './USERS/userbilling/userbilling.component';
import { UsermedicalrecordsComponent } from './USERS/usermedicalrecords/usermedicalrecords.component';
import { UserchatComponent } from './USERS/userchat/userchat.component';
import { UserappointmentsComponent } from './USERS/userappointments/userappointments.component';
import { AuthGuard } from './auth.guard';
import { AdminloginComponent } from './ADMIN/adminlogin/adminlogin.component';
import { SymptomsComponent } from './ADMIN/symptoms/symptoms.component';
import { InformationComponent } from './ADMIN/information/information.component';
import { UserreceiptComponent } from './USERS/userreceipt/userreceipt.component';
import { CreatereceiptComponent } from './ADMIN/createreceipt/createreceipt.component';

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
