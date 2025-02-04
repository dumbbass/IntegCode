import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { AdminAppointmentService, DoctorAppointment } from '../services/admin-appointment.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [AdminsidenavComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: DoctorAppointment[] = [];
  appointmentHistory: DoctorAppointment[] = [];
  modifiedAppointments: DoctorAppointment[] = [];
  showRemarksModal = false;
  selectedAppointmentId: number | null = null;
  remarks = '';
  searchQuery: string = ''; // Declare searchQuery
  approvedAppointments: DoctorAppointment[] = [];
  isEditing: { [key: number]: boolean } = {};
  editableRemarks: { [key: number]: string } = {};

  constructor(
    private adminAppointmentService: AdminAppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllAppointments();
  }

  loadAllAppointments(): void {
    const doctorId = this.authService.getUserId();
    console.log('Loading appointments for doctor ID:', doctorId);

    if (!doctorId) return;

    // Load current appointments
    this.adminAppointmentService.getDoctorAppointments(doctorId).subscribe({
      next: (response) => {
        console.log('Appointments response:', response);
        if (response.status && response.appointments) {
          this.appointments = response.appointments;
        }
      },
      error: (error: unknown) => console.error('Error loading appointments:', error)
    });

    // Load appointment history
    this.adminAppointmentService.getAppointmentHistory(doctorId).subscribe({
      next: (response) => {
        if (response.status && response.appointments) {
          this.appointmentHistory = response.appointments;
        }
      },
      error: (error: unknown) => console.error('Error loading appointment history:', error)
    });

    // Load modified appointments
    this.adminAppointmentService.getModifiedAppointments(doctorId).subscribe({
      next: (response) => {
        if (response.status && response.appointments) {
          this.modifiedAppointments = response.appointments;
        }
      },
      error: (error: unknown) => console.error('Error loading modified appointments:', error)
    });

    // Load approved appointments
    this.adminAppointmentService.getAppointmentHistory(doctorId).subscribe({
      next: (response) => {
        if (response.status && response.appointments) {
          // Filter only approved appointments
          this.approvedAppointments = response.appointments.filter(
            appointment => appointment.status === 'approved'
          );
        }
      },
      error: (error: unknown) => console.error('Error loading approved appointments:', error)
    });
  }

  approveAppointment(appointmentId: number): void {
    this.adminAppointmentService.updateAppointmentStatus({
      appointment_id: appointmentId,
      status: 'approved'
    }).subscribe({
      next: (response) => {
        if (response.status) {
          this.loadAllAppointments();
        } else {
          alert(response.message || 'Failed to approve appointment');
        }
      },
      error: (error) => {
        console.error('Error approving appointment:', error);
        alert('Failed to approve appointment. Please try again.');
      }
    });
  }

  openRemarksModal(appointmentId: number): void {
    this.selectedAppointmentId = appointmentId;
    this.remarks = '';
    this.showRemarksModal = true;
  }

  closeRemarksModal(): void {
    this.showRemarksModal = false;
    this.selectedAppointmentId = null;
    this.remarks = '';
  }

  declineAppointment(): void {
    if (!this.selectedAppointmentId || !this.remarks.trim()) {
      alert('Please provide remarks for declining the appointment');
      return;
    }

    this.adminAppointmentService.updateAppointmentStatus({
      appointment_id: this.selectedAppointmentId,
      status: 'declined',
      remarks: this.remarks.trim()
    }).subscribe({
      next: (response) => {
        if (response.status) {
          this.closeRemarksModal();
          this.loadAllAppointments();
        } else {
          alert(response.message || 'Failed to decline appointment');
        }
      },
      error: (error) => {
        console.error('Error declining appointment:', error);
        alert('Failed to decline appointment. Please try again.');
      }
    });
  }

  // Implement searchPatient method
  searchPatient(): void {
    if (this.searchQuery.trim()) {
      this.appointmentHistory = this.appointmentHistory.filter(appointment =>
        appointment.patient_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadAllAppointments(); // Reset to the full list if search query is empty
    }
  }

  startEditing(appointment: DoctorAppointment): void {
    this.isEditing[appointment.appointment_id] = true;
    this.editableRemarks[appointment.appointment_id] = appointment.remarks || '';
  }

  saveRemarks(appointmentId: number): void {
    const remarks = this.editableRemarks[appointmentId];
    
    this.adminAppointmentService.updateAppointmentStatus({
      appointment_id: appointmentId,
      status: 'approved',
      remarks: remarks.trim()
    }).subscribe({
      next: (response) => {
        if (response.status) {
          // Update the local data
          const appointment = this.approvedAppointments.find(a => a.appointment_id === appointmentId);
          if (appointment) {
            appointment.remarks = remarks.trim();
          }
          // Exit edit mode
          this.isEditing[appointmentId] = false;
          this.editableRemarks[appointmentId] = '';
        } else {
          alert(response.message || 'Failed to save remarks');
        }
      },
      error: (error) => {
        console.error('Error saving remarks:', error);
        alert('Failed to save remarks. Please try again.');
      }
    });
  }

  formatTableRemarks(remarks: string | undefined | null): string {
    if (!remarks) return '-';
    return remarks
      .split('.')
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim() + '.')
      .join('\n');
  }
}
