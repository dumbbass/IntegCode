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
  private patientsApiUrl = 'http://localhost/API/carexusapi/backend/carexus.php?action=getPatients';

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

            // Fetch the patient's first name based on the patient_id
            this.http.get<any>(this.patientsApiUrl).subscribe(
              (patientsResponse) => {
                const patients = patientsResponse.patients as { patient_id: number, id: number, firstname: string }[];
                const patient = patients.find(p => p.id === id);

                if (patient) {
                  const patientId = patient.patient_id;
                  const firstName = patient.firstname;

                  // Store the session data including the patient's first name
                  this.authService.setSession(token, role, id, patientId, firstName);
                  this.router.navigate(['/dashboard']); // Navigate to the dashboard
                } else {
                  this.authService.clearSession();
                  this.loginError = true;
                  this.errorMessage = 'Patient not found for this user.';
                }
              },
              (error) => {
                console.log('Error fetching patients:', error);
                this.loginError = true;
                this.errorMessage = 'An error occurred while fetching patient data.';
              }
            );
          } else {
            alert('User ID not found in response');
          }
        } else {
          this.loginError = true;
          this.errorMessage = 'Invalid email or password';
        }
      },
      (error) => {
        console.log('Error during login:', error);
        this.loginError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
