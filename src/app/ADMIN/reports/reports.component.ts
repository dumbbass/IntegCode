import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterModule, CommonModule, AdminsidenavComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
 // Summary data properties
 totalPatients: number = 500; // Example value
 appointmentsThisWeek: number = 30; // Example value
 appointmentsThisMonth: number = 120; // Example value
 totalAppointments: number = 120; // Example value
 missedAppointments: number = 10; // Example value

 // Method to handle exporting data
 exportData(type: string) {
   console.log(`Exporting ${type} data`);
   // Implement logic to export data as CSV or PDF
 }
}
