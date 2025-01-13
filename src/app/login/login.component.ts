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

  errorMessage: string = '';

  private apiUrl = 'http://localhost/API/carexusapi/backend/carexus.php?action=login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onLogin(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    console.log('Login attempt with:', this.loginData);

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
              this.router.navigate(['/userdashboard']);
            }
          } else {
            alert('User ID not found in response');
          }
        } else {
          this.errorMessage = 'Invalid Email or Password';
        }
      },
      (error) => {
        console.log('Error during login:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }

  goToRegister(): void {
    // Use Angular's router to navigate to the Register component
    this.router.navigate(['/register']);
  }
}
