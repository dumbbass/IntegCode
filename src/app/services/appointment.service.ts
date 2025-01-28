import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost/API/carexusapi/backend/carexus.php?action=getAppointments';

  constructor(private http: HttpClient) {}

  getAppointmentsByPatientId(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}&patient_id=${patientId}`);
  }
} 