import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DataService } from '../USERS/services/data.service';

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

  constructor(
    private dataService: DataService,  // Use the data service for HTTP requests
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
  
    // Call the DataService to validate login credentials
    this.dataService.login(this.loginData).subscribe(
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
              this.dataService.getPatientInfo(id).subscribe(
                (patientsResponse) => {
                  console.log('Fetched patients:', patientsResponse); // Log the response from patients API
  
                  // Access patient data inside 'payload' (instead of 'patients')
                  const patients = patientsResponse.payload as { patient_id: number, id: number, email: string }[];
  
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
            } else if (role === 'admin') {
              // If the user is an admin, fetch doctor_id from the doctors table
              this.dataService.getDoctorInfo(id).subscribe(
                (doctorResponse) => {
                  console.log('Fetched doctor info:', doctorResponse); // Log doctor info
              
                  if (doctorResponse && doctorResponse.payload && doctorResponse.payload.length > 0) {
                    const doctor_id = doctorResponse.payload[0].doctor_id; // Access doctor_id from the first element in the payload array
              
                    // Store doctor_id in the session for the admin user
                    this.authService.setSession(token, role, id, doctor_id);
                    console.log('Doctor ID stored in session:', doctor_id); // Log doctor ID for debugging
              
                    // Redirect admin to admin dashboard
                    this.router.navigate(['/admindashboard']);
                  } else {
                    this.loginError = true;
                    this.errorMessage = 'Doctor information not found for this admin.';
                    console.log('Doctor information not found for admin id:', id); // Log the error case
                  }
                },
                (error) => {
                  console.log('Error fetching doctor info:', error);
                  this.loginError = true;
                  this.errorMessage = 'An error occurred while fetching doctor information.';
                }
              );              
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