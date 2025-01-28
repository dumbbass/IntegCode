import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';  
import { AuthService } from '../../auth.service'; 
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {} from '@angular/common/http';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

@Component({
  selector: 'app-userappointments',
  standalone: true,
  imports: [CommonModule, 
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule, SidenavComponent, FormsModule],
  templateUrl: './userappointments.component.html',
  styleUrls: ['./userappointments.component.css']
})
export class UserappointmentsComponent implements OnInit {
  showAppointmentForm: boolean = false;
  showLimitModal: boolean = false;  // Variable to control modal display
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
    this.fetchPatientData();
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

    // Check if the user has already booked an appointment within the week or month limit
    if (this.isAppointmentLimitReached(this.appointmentDate)) {
      this.showLimitModal = true;  // Show the modal if limits are reached
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
          this.fetchAppointments(); // Fetch updated list of appointments
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

  // Helper function to check if the user has an appointment within the current week/month
  isAppointmentLimitReached(appointmentDate: string): boolean {
    const dateToCheck = new Date(appointmentDate);

    // Check appointments within the current week
    const appointmentsThisWeek = this.appointments.filter(appointment => 
      isWithinInterval(new Date(appointment.appointment_date), {
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date())
      })
    );

    // Check appointments within the current month
    const appointmentsThisMonth = this.appointments.filter(appointment =>
      isWithinInterval(new Date(appointment.appointment_date), {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
    );

    // Limit: 2 appointments per week and 8 appointments per month
    const isWeeklyLimitReached = appointmentsThisWeek.length >= 2;
    const isMonthlyLimitReached = appointmentsThisMonth.length >= 8;

    return isWeeklyLimitReached || isMonthlyLimitReached;
  }

  closeLimitModal(): void {
    this.showLimitModal = false;  // Close the modal
  }
}
