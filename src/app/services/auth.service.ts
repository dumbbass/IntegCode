import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Dummy Admin Account
  private adminCredentials = {
    email: 'jeffry@gmail.com',
    password: '123',
    role: 'admin'
  };

  // ✅ Dummy User Account
  private userCredentials = {
    email: 'keanu@gmail.com',
    password: '123',
    role: 'user'
  };

  constructor() {}

  // ✅ Check if the email belongs to an admin
  isAdminEmail(email: string): boolean {
    return email.toLowerCase() === this.adminCredentials.email.toLowerCase();
  }

  // ✅ Check if the email belongs to a regular user
  isUserEmail(email: string): boolean {
    return email.toLowerCase() === this.userCredentials.email.toLowerCase();
  }

  // ✅ Validate credentials for both admin and user
  validateCredentials(email: string, password: string): string | null {
    if (
      email.toLowerCase() === this.adminCredentials.email.toLowerCase() &&
      password === this.adminCredentials.password
    ) {
      return this.adminCredentials.role; // Returns 'admin'
    }

    if (
      email.toLowerCase() === this.userCredentials.email.toLowerCase() &&
      password === this.userCredentials.password
    ) {
      return this.userCredentials.role; // Returns 'user'
    }

    return null; // Invalid credentials
  }
}
