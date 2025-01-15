import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check for the existence of an auth token
  }

  // Set session data (authToken, userRole, userId, and optionally patientId)
  setSession(authToken: string, role: string, userId: number, patient_id?: number): void {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId.toString());

    // Store patientId if it's provided
    if (patient_id !== undefined) {
      localStorage.setItem('patientId', patient_id.toString());
    }
  }

  // Get the stored user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Get the stored user ID
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;  // Return user ID or null if not found
  }

  // Get the stored patient ID
  getPatientId(): number | null {
    const patientId = localStorage.getItem('patientId');
    return patientId ? parseInt(patientId, 10) : null;  // Return patient ID or null if not found
  }

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientId');  // Corrected to remove patientId
    localStorage.removeItem('userId');  // Remove user ID when logging out
  }
}
