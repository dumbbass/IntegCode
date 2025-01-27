import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost/API/carexusapi/backend/carexus.php';  // Base API URL

  constructor(private http: HttpClient) { }

  // Method to schedule an appointment
  scheduleAppointment(appointmentData: any): Observable<any> {
    // Send the request with action as query parameter
    const params = { action: 'scheduleAppointment' };
    return this.http.post<any>(this.apiUrl, appointmentData, { params });
  }

  // Method to get appointments for a patient
  getAppointments(patientId: string): Observable<any> {
    // Send the request with action and patient_id as query parameters
    const params = { action: 'getAppointments', patient_id: patientId };
    return this.http.get<any>(this.apiUrl, { params });
  }
}
