import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check for the existence of an auth token
  }

  // Set session data (authToken and userRole)
  setSession(authToken: string, role: string): void {
    localStorage.setItem('authToken', authToken); // Store token
    localStorage.setItem('userRole', role); // Store user role
  }

  // Get the stored user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}
