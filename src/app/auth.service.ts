import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userName: string | null = null;

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check for the existence of an auth token
  }

  // Set session data (authToken, userRole, userId, and optionally patientId)
  setSession(token: string, role: string, userId: number, patientId?: number, firstName?: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId.toString());
    if (patientId) {
      localStorage.setItem('patientId', patientId.toString());
    }
    if (firstName) {
      this.userName = firstName;
      localStorage.setItem('userName', firstName);
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

  // Get the stored user name
  getUserName(): string | null {
    return this.userName || localStorage.getItem('userName');
  }

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientId');  // Corrected to remove patientId
    localStorage.removeItem('userId');  // Remove user ID when logging out
  }
}
