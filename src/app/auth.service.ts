import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check for the existence of an auth token
  }

  // Set session data (authToken, userRole, and userId)
  setSession(authToken: string, role: string, userId: number): void {
    localStorage.setItem('authToken', authToken);  // Store token
    localStorage.setItem('userRole', role);  // Store user role
    localStorage.setItem('userId', userId.toString());  // Store user ID
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

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');  // Remove user ID when logging out
  }
}
