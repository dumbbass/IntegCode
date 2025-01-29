import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../../auth.service';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {} from '@angular/common/http';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isWithinInterval } from 'date-fns';

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
    if (!this.selectedDoctorId || !this.appointmentDate || !this.appointmentPurpose || !patientId) {
      alert('Please fill in all the required fields');
      return;
    }

    if (this.isAppointmentLimitReached(this.appointmentDate)) {
      this.showLimitModal = true;
      return;
    }

    const appointmentData = {
      patient_id: patientId,
      doctor_id: +this.selectedDoctorId,
      appointment_date: this.appointmentDate,
      purpose: this.appointmentPurpose,
    };

    this.appointmentService.scheduleAppointment(appointmentData).subscribe(
      (response) => {
        if (response.status) {
          alert('Appointment scheduled successfully');
          this.showAppointmentForm = false;
          this.fetchAppointments();
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

  isAppointmentLimitReached(appointmentDate: string): boolean {
    const dateToCheck = new Date(appointmentDate);

    const appointmentsThisWeek = this.appointments.filter(appointment =>
      isWithinInterval(new Date(appointment.appointment_date), {
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date())
      })
    );

    const appointmentsThisMonth = this.appointments.filter(appointment =>
      isWithinInterval(new Date(appointment.appointment_date), {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      })
    );

    return appointmentsThisWeek.length >= 2 || appointmentsThisMonth.length >= 8;
  }

  closeLimitModal(): void {
    this.showLimitModal = false;
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
    this.generateCalendar();
  }

  generateCalendar(): void {
    const start = startOfWeek(startOfMonth(this.currentMonth));
    const end = endOfWeek(endOfMonth(this.currentMonth));
    this.daysInMonth = [];

    let day = start;
    while (day <= end) {
      this.daysInMonth.push(new Date(day));
      day = addDays(day, 1);
    }
  }

  toggleDate(date: Date): void {
    const index = this.selectedDates.findIndex((d) => isSameDay(d, date));
    if (index > -1) {
      this.selectedDates.splice(index, 1);
    } else {
      this.selectedDates.push(date);
    }
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.some((d) => isSameDay(d, date));
  }

  getWeeks(): Date[][] {
    return this.daysInMonth.reduce((weeks, day, index) => {
      if (index % 7 === 0) weeks.push([]);
      weeks[weeks.length - 1].push(day);
      return weeks;
    }, [] as Date[][]);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return isSameDay(date, today);
  }
}
