import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';


@Component({
    selector: 'app-admindashboard',
    imports: [
        CommonModule,
        RouterModule,
        AdminsidenavComponent
    ],
    templateUrl: './admindashboard.component.html',
    styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {
  showAppointmentForm: boolean = false;
  showAppointmentTime: boolean = false;
}
