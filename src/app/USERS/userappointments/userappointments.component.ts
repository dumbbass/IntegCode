import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';  // Import AppointmentService
import { AuthService } from '../../auth.service'; // Import AuthService
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidenavComponent } from '../sidenav/sidenav.component';

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
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
    this.fetchPatientData();  // Fetch patient data on initialization
    // Fetch appointments will be called after patient data is fetched
  }

  fetchPatientData(): void {
    const patientIdFromAuth = this.authService.getPatientId();
    console.log('Fetched patientId from AuthService:', patientIdFromAuth);
  
    if (patientIdFromAuth !== null) {
        this.patientId = patientIdFromAuth;
        console.log('Setting patientId:', this.patientId);
        this.fetchAppointments(); // Fetch appointments after setting patientId
    } else {
        console.error('Patient ID is null');
    }
  }

  fetchAppointments(): void {
    if (this.patientId !== null) {
        this.appointmentService.getAppointments(this.patientId.toString()).subscribe(
            (response) => {
                console.log('Raw response:', response); // Log the raw response
                if (response.status) {
                    this.appointments = response.appointments;
                    console.log('Appointments fetched:', this.appointments); // Log the appointments array
                } else {
                    console.error('Failed to fetch appointments:', response.message);
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
    this.doctorService.getDoctors().subscribe(
      (response) => {
        if (response.status) {
          this.doctors = response.doctors;
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
  
    this.appointmentService.scheduleAppointment(appointmentData).subscribe(
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
