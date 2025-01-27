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
<<<<<<< HEAD
<<<<<<< HEAD
  
=======

>>>>>>> parent of fa86ed8 (update)
    // Call the DataService to validate login credentials
    this.dataService.login(this.loginData).subscribe(
=======

    // Call the backend API to validate login credentials
    this.http.post<any>(this.apiUrl, this.loginData).subscribe(
>>>>>>> parent of facac91 (Update)
      (response) => {
        console.log('Response from backend:', response);

        if (response.status === true) {
          // Ensure user object exists and extract user details safely
          if (response.user && response.user.id) {
            const { token, role, id } = response.user; // Extract token, role, and user id

            // Store the session data (token, role, and userId) in localStorage
            this.authService.setSession(token, role, id);

            // If user is a regular user, fetch their patient id
            if (role === 'user') {
              this.http.get<any>(this.patientsApiUrl).subscribe(
                (patientsResponse) => {
                  console.log('Fetched patients:', patientsResponse); // Log the response from patients API
<<<<<<< HEAD
<<<<<<< HEAD
  
                  // Access patient data inside 'payload' (instead of 'patients')
                  const patients = patientsResponse.payload as { patient_id: number, id: number, email: string }[];
  
=======
                  const patients = patientsResponse.patients as { patient_id: number, id: number, email: string }[];

>>>>>>> parent of facac91 (Update)
=======

                  // Access patient data inside 'payload' (instead of 'patients')
                  const patients = patientsResponse.payload as { patient_id: number, id: number, email: string }[];

>>>>>>> parent of fa86ed8 (update)
                  console.log('Logged user id:', id);
                  console.log('Patient list:', patients);

                  // Find the patient based on id
                  const patient = patients.find(p => p.id === id);
                  console.log('Found patient:', patient);

                  // If patient found, store patient_id
                  if (patient) {
                    console.log('Patient found:', patient); // Log the patient found
                    const patientId = patient.patient_id;
                    // Update session with patientId
                    this.authService.setSession(token, role, id, patientId);
                    this.router.navigate(['/userprofile']); // Navigate to user profile page
                  } else {
                    // Clear session if patient not found
                    this.authService.clearSession();
                    this.loginError = true;
                    this.errorMessage = 'Patient not found for this user.';
                    console.log('Patient not found for user id:', id); // Log the error case
                  }
                },
                (error) => {
                  console.log('Error fetching patients:', error);
                  this.loginError = true;
                  this.errorMessage = 'An error occurred while fetching patient data.';
                }
              );
            } else {
              // Redirect admin to admin dashboard
              this.router.navigate(['/admindashboard']);
            }
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
