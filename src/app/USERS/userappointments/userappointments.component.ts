import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-userappointments',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SidenavComponent, FormsModule],
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.css']
})
export class UserappointmentsComponent implements OnInit {
  showAppointmentForm: boolean = false;
  doctors: any[] = [];
  selectedDoctorId: string | null = null;
  appointmentDate: string = '';
  appointmentPurpose: string = '';
  patientId: number | null = null;
  appointments: any[] = [];

  constructor(
    private dataService: DataService,  // Use DataService instead of individual services
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
    this.fetchPatientData();  // Fetch patient data on initialization
  }

  fetchPatientData(): void {
    const patientIdFromAuth = this.authService.getUserId();
    console.log('Fetched patientId from AuthService:', patientIdFromAuth);
  
    if (patientIdFromAuth !== null) {
      this.patientId = patientIdFromAuth;
      console.log('Setting patientId:', this.patientId);
  
      this.dataService.getPatientInfo(this.patientId).subscribe(
        (response: any) => {
          console.log('Response from getPatientInfo:', response);
  
          if (response && response.payload && response.payload.length > 0) {
            const patientData = response.payload[0];  // Accessing the first element of the payload array
            console.log('Patient data fetched:', patientData);
            this.patientId = patientData.patient_id;  // Assigning the patient_id from the fetched data
            this.fetchAppointments();
          } else {
            console.error('Patient data not found in response');
          }
        },
        (error: any) => {
          console.error('Error fetching patient data:', error);
        }
      );
    } else {
      console.error('Patient ID is null');
    }
  }
  

  fetchAppointments(): void {
    if (this.patientId !== null) {
      this.dataService.getAppointments(this.patientId.toString()).subscribe(
        (response) => {
          // Update this line to access the correct part of the response
          if (response.payload && response.payload.length > 0) {
            this.appointments = response.payload; // Assign the payload to the appointments array
            console.log('Appointments fetched:', this.appointments);
          } else {
            console.log('No appointments found.');
          }
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    } else {
      console.error('patientId is null');
    }
  }
  

  fetchDoctors(): void {
    console.log('Fetching doctors...');
    this.dataService.getDoctors().subscribe(
      (response) => {
        if (response.status) {
          this.doctors = response.payload;  // Ensure the payload contains the doctor data
        } else {
          console.error('No doctors found');
        }
      },
      (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
  

  bookAppointment(): void {
    const patientId = this.authService.getPatientId();  // Retrieve patient_id from authService
    console.log('Booking appointment with patientId:', patientId);
  
    // Ensure all fields are filled in
    if (!this.selectedDoctorId || !this.appointmentDate || !this.appointmentPurpose || !patientId) {
      alert('Please fill in all the required fields');
      return;
    }
  
    const appointmentData = {
      patient_id: patientId,
      doctor_id: +this.selectedDoctorId, // Convert doctor_id to a number
      appointment_date: this.appointmentDate,
      purpose: this.appointmentPurpose,
    };
  
    console.log('Appointment data to be sent:', appointmentData);
  
    this.dataService.scheduleAppointment(appointmentData).subscribe(
      (response) => {
        console.log('Response from scheduleAppointment:', response);
        if (response.status) {
          alert('Appointment scheduled successfully');
          this.showAppointmentForm = false;
        } else {
          console.error('Error scheduling appointment:', response.message);
          alert('Error scheduling appointment: ' + response.message);
        }
      },
      (error) => {
        console.error('Error scheduling appointment:', error);
        alert('There was an error scheduling your appointment.');
      }
    );
  }
}
