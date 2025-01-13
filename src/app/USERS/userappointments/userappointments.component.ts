import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userappointments',
  standalone: true,
  imports: [CommonModule, SidenavComponent], // Add CommonModule here
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.css'] // Corrected styleUrl to styleUrls
})
export class UserappointmentsComponent {
  showAppointmentForm: boolean = false; // Make sure this is defined

}
