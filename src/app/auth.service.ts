import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    // Add your authentication logic here
    // For example, check if a token exists in local storage
    return !!localStorage.getItem('authToken');
  }
}  
