import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  loginError = false;  // Flag to show error message
  errorMessage = '';   // Store the error message

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

    // Reset error flag and message before making the request
    this.loginError = false;
    this.errorMessage = '';

    // Check if email or password is empty
    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = true;
      this.errorMessage = 'Please enter your email and password';
      return; // Stop further execution if fields are empty
    }

    // Call the backend API to validate login credentials
    this.http.post<any>(this.apiUrl, this.loginData).subscribe(
      (response) => {
        console.log('Response from backend:', response);

        if (response.status === true) {
          // Ensure user object exists and extract user details safely
          if (response.user && response.user.id) {
            const { token, role, id } = response.user; // Extract token, role, and user id

            // Store the session data (token, role, and userId) in localStorage
            this.authService.setSession(response.token, role, id);

            // Redirect to the appropriate dashboard based on the user's role
            if (role === 'admin') {
              this.router.navigate(['/admindashboard']);
            } else if (role === 'user') {
              this.router.navigate(['/userprofile']);
            }
          } else {
            alert('User ID not found in response');
          }
        } else {
          this.loginError = true; // Set error flag if login failed
          this.errorMessage = 'Invalid email or password'; // Set invalid credentials message
        }
      },
      (error) => {
        console.log('Error during login:', error);
        this.loginError = true; // Set error flag if there is a request error
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }

  goToRegister(): void {
    // Use Angular's router to navigate to the Register component
    this.router.navigate(['/register']);
  }
}
