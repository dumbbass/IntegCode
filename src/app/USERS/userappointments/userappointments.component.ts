import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../../auth.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient, 
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService
  ) {}
  private getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

private renderCalendar(year: number, month: number): void {
    const daysContainer = document.querySelector(".calendar-grid");
    if (!daysContainer) return;
    
    daysContainer.innerHTML = ""; // Clear previous month
    const firstDay = this.getFirstDayOfMonth(year, month);
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("day", "empty");
        daysContainer.appendChild(emptyDiv);
    }

    for (let i = 1; i <= totalDays; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = i.toString();
        daysContainer.appendChild(dayDiv);
    }
}



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

    // Get the week number of the selected date
    const selectedWeek = this.getWeekNumber(this.selectedDate);

    // Count the number of appointments already booked for this week
    const appointmentsThisWeek = this.appointments.filter(app => 
        this.getWeekNumber(new Date(app.appointment_date)) === selectedWeek
    );

    if (appointmentsThisWeek.length >= 3) {
        alert('You can only book up to 3 appointments per week.');
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
                alert('Appointment booked successfully!');
                this.fetchAppointments(); // Refresh appointments list
                this.selectedDate = null;
                this.selectedTime = null;
                this.appointmentPurpose = '';
            } else {
                alert('Failed to book appointment: ' + response.message);
            }
        },
        (error) => {
            console.error('Error booking appointment:', error);
            alert('An error occurred while booking the appointment.');
        }
    );
}

// Function to get the week number of a given date
getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

  deleteAppointment(appointmentId: number): void {
    if (!confirm('Are you sure you want to delete this appointment?')) {
        return;
    }

    const apiUrl = `http://localhost/API/carexusapi/backend/delete_appointment.php?action=deleteAppointment&appointmentId=${appointmentId}`;

    this.http.get<{ status: boolean; message: string }>(apiUrl).subscribe(
        (response) => {
            if (response.status) {
                alert('Appointment deleted successfully');
                this.fetchAppointments(); // Refresh the list
            } else {
                alert('Failed to delete appointment: ' + response.message);
            }
        },
        (error) => {
            console.error('Error deleting appointment:', error);
            alert('There was an error deleting the appointment.');
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
  
    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.daysInMonth.push(new Date(year, month, day));
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
      this.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Ensures 00:00:00 time
      const dateKey = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
      this.availableTimes = this.timeSlots[dateKey] || [];
      this.selectedTime = null;
    }
  }
  
  

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  isAvailableDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison
    return date >= today;
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDates.some((selectedDate) => selectedDate.toDateString() === date.toDateString());
  }

  confirmAppointment(): void {
    if (this.selectedDate && this.selectedTime && this.selectedDoctorId && this.appointmentPurpose) {
      // Ensure date is stored without time shift
      this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate());
  
      this.bookAppointment();
    } else {
      alert('Please fill in all the required fields');
    }
  }
  

  openModal(date: Date): void {
    const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Ensure it's at midnight
    const dateKey = adjustedDate.toISOString().split('T')[0]; // Get proper date string
  
    this.modalTimes = this.timeSlots[dateKey] || ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
    this.modalDate = adjustedDate;
    this.isModalOpen = true;
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
