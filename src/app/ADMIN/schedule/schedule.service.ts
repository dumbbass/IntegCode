import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost/API/carexusapi/Backend/carexus.php?action=setAvailableSchedule'; // Adjust this URL

  constructor(private http: HttpClient) {}

  // Fetch schedule for a specific doctor
  getSchedule(doctorId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${doctorId}/schedule`);
  }

  // Save schedule for a specific doctor
  saveSchedule(doctorId: string, date: string, timeSlots: string[]): Observable<any> {
    const payload = {
      doctor_id: doctorId,
      date: date,
      time_slot: timeSlots
    };

    // Corrected the method from 'httpClient' to 'http'
    return this.http.post<any>(this.apiUrl, payload);
  }
}
