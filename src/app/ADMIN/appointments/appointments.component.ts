import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterModule, CommonModule, AdminsidenavComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {


  scheduleNewAppointment(event: Event) {
    event.preventDefault();
    console.log('Schedule new appointment action triggered');
    // Implement logic to schedule a new appointment
  }
}
