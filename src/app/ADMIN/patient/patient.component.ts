import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { DataService } from '../../USERS/services/data.service';


@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

  patients: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getPatients();  // Call the method to fetch patients
  }

  // For Schedule Component
  // getPatients(): void {
  //   const userId = localStorage.getItem('doctorId');  // Retrieve the userId (doctor's ID)

  //   if (userId) {
  //     // Pass the userId to the service method
  //     this.dataService.getDoctorsPatients(Number(userId)).subscribe(
  //       (response) => {
  //         if (response && response.payload) {
  //           this.patients = response.payload;  // Populate the patients list
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching patients:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Doctor ID is missing from localStorage');
  //   }
  // }


    getPatients(): void {
    const userId = localStorage.getItem('doctorId');  // Retrieve the userId (doctor's ID)

    if (userId) {
      // Pass the userId to the service method
      this.dataService.getDoctorsPatients(Number(userId)).subscribe(
        (response) => {
          if (response && response.payload) {
            // Extract unique patients based on patient_id
            this.patients = this.filterUniquePatients(response.payload);
          }
        },
        (error) => {
          console.error('Error fetching patients:', error);
        }
      );
    } else {
      console.error('Doctor ID is missing from localStorage');
    }
  }

  // Method to filter out duplicate patients by patient_id
  filterUniquePatients(patients: any[]): any[] {
    const uniquePatientsMap = new Map();
    patients.forEach(patient => {
      if (!uniquePatientsMap.has(patient.patient_id)) {
        uniquePatientsMap.set(patient.patient_id, patient);
      }
    });
    return Array.from(uniquePatientsMap.values());
  }
}