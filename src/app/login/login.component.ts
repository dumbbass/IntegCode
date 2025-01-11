import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { AuthService } from '../auth.service'; // Ensure the correct import path

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  private apiUrl = 'http://localhost/API/carexusapi/backend/carexus.php?action=login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onLogin(event: Event): void {
    event.preventDefault();
    console.log('Login attempt with:', this.loginData);
  
    // Call the backend API to validate login credentials
    this.http.post<any>(this.apiUrl, this.loginData).subscribe(
      (response) => {
        console.log('Response from backend:', response);  // Log the response
  
        if (response.status) {
          // Store the session data (token and role) in localStorage
          this.authService.setSession(response.token, response.user.role);
  
          // Redirect to the appropriate dashboard based on the 'dashboard' field in the response
          if (response.user.role === 'admin') {
            this.router.navigate(['/admindashboard']);
          } else if (response.user.role === 'user') {
            this.router.navigate(['/userdashboard']);
          }
        } else {
          alert('Login failed: ' + response.message);
        }
      },
      (error) => {
        console.log('Error during login:', error);  // Log the error
        alert('An error occurred. Please try again later.');
      }
    );
  }  
}
