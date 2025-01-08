import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Store admin credentials directly in the service
  private adminCredentials = {
    email: 'jeffry@gmail.com',
    password: '123'
  };

  constructor() {}

  isAdminEmail(email: string): boolean {
    return email.toLowerCase() === this.adminCredentials.email.toLowerCase();
  }

  validateAdminCredentials(email: string, password: string): boolean {
    return (
      email.toLowerCase() === this.adminCredentials.email.toLowerCase() &&
      password === this.adminCredentials.password
    );
  }
} 