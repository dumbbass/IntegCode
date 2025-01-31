import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../../auth.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'app-userappointments',
    imports: [CommonModule, SidenavComponent, FormsModule],
    templateUrl: './userappointments.component.html',
    styleUrls: ['./userappointments.component.css']
})
export class UserappointmentsComponent implements OnInit {
  showAppointmentForm: boolean = false;
  showLimitModal: boolean = false;
  doctors: any[] = [];
  selectedDoctorId: string | null = null;
  appointmentDate: string = '';
  appointmentPurpose: string = '';
  patientId: number | null = null;
  appointments: any[] = [];
  currentMonth: Date = new Date();
  selectedDates: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth: Date[] = [];

  availableDates: Date[] = [new Date(), new Date(new Date().setDate(new Date().getDate() + 2)), new Date(new Date().setDate(new Date().getDate() + 5))];
  availableTimes: string[] = [];
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  isModalOpen: boolean = false; // Modal visibility state
  modalDate: Date | null = null; // Date selected for the modal
  modalTimes: string[] = []; // Available times for the selected date

  // Mock availability for specific dates
  timeSlots: { [key: string]: string[] } = {
    '2025-01-29': ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    '2025-01-31': ['10:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
    '2025-02-03': ['08:30 AM', '12:00 PM', '03:00 PM']
  };

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
    this.fetchPatientData();
    this.generateCalendar();
  }

  fetchPatientData(): void {
    const patientIdFromAuth = this.authService.getPatientId();
    if (patientIdFromAuth !== null) {
      this.patientId = patientIdFromAuth;
      this.fetchAppointments();
    } else {
      console.error('Patient ID is null');
    }
  }

  fetchAppointments(): void {
    if (this.patientId !== null) {
      this.appointmentService.getAppointments(this.patientId.toString()).subscribe(
        (response) => {
          if (response.status) {
            this.appointments = response.appointments;
          } else {
            console.error('Failed to fetch appointments:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    }
  }

  fetchDoctors(): void {
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
    const patientId = this.authService.getPatientId();
    if (!this.selectedDoctorId || !this.selectedDate || !this.selectedTime || !this.appointmentPurpose || !patientId) {
        alert('Please fill in all the required fields');
        return;
    }

    const appointmentData = {
        patient_id: patientId,
        doctor_id: +this.selectedDoctorId,
        appointment_date: this.selectedDate.toISOString().split('T')[0],
        appointment_time: this.selectedTime,
        purpose: this.appointmentPurpose,
    };

    this.appointmentService.scheduleAppointment(appointmentData).subscribe(
        (response) => {
            if (response.status) {
                alert('Appointment scheduled successfully');
                this.showAppointmentForm = false;
                this.fetchAppointments();
                this.resetSelections();
            } else {
                alert('Error scheduling appointment: ' + response.message);
            }
        },
        (error) => {
            alert('There was an error scheduling your appointment.');
            console.error('Error scheduling appointment:', error);
        }
    );
  }

  resetSelections(): void {
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableTimes = [];
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.daysInMonth = [];
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      this.daysInMonth.push(new Date(date));
    }
  }

  goToPreviousMonth(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    this.currentMonth = new Date(year, month - 1, 1);
    this.generateCalendar();
  }

  goToNextMonth(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    this.currentMonth = new Date(year, month + 1, 1);
    this.generateCalendar();
  }

  selectDate(date: Date): void {
    if (this.isAvailableDate(date)) {
      this.selectedDate = date;
      const dateKey = date.toISOString().split('T')[0];
      this.availableTimes = this.timeSlots[dateKey] || [];
      this.selectedTime = null; // Reset selected time
    }
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  isAvailableDate(day: Date): boolean {
    const dateKey = day.toISOString().split('T')[0]; // Format date
    return this.timeSlots.hasOwnProperty(dateKey); // Check if the date exists in timeSlots
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDates.some((selectedDate) => selectedDate.toDateString() === date.toDateString());
  }

  confirmAppointment(): void {
    if (this.selectedDate && this.selectedTime && this.selectedDoctorId && this.appointmentPurpose) {
        this.bookAppointment();
    } else {
        alert('Please fill in all the required fields');
    }
  }

  openModal(day: Date): void {
    this.modalDate = day;
    const dateKey = day.toISOString().split('T')[0]; // Convert date to 'YYYY-MM-DD'
    
    // Check if there are available times for the selected date
    this.modalTimes = this.timeSlots[dateKey] || [];
  
    if (this.modalTimes.length > 0) {
      this.isModalOpen = true;
    } else {
      alert('No available time slots for this date.');
    }
  }
  
  closeModal(): void {
    this.isModalOpen = false; // Close the modal
    this.modalDate = null;
    this.modalTimes = [];
  }

  selectTimeFromModal(time: string): void {
    this.selectedDate = this.modalDate;
    this.selectedTime = time;
    this.isModalOpen = false; // Close the modal after selection
  }
}
