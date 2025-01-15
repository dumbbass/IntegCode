// patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost/API/carexusapi/backend/carexus.php?action=getPatients';  // Your API URL

  constructor(private http: HttpClient) {}

  // Fetch the patient details using the user ID
  getPatientInfo(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getPatients&id=${userId}`);
  }
}
