import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '../../auth.service';  // Import the AuthService
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [SidenavComponent, CommonModule, HttpClientModule],  // Include HttpClientModule here
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  user: any = {};  
  userId: number | null = null;  // userId can be null initially
  errorMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();  // Retrieve the userId from the AuthService
    if (this.userId) {
      this.fetchUserProfile();
    } else {
      this.errorMessage = 'User ID is not available or user is not authenticated!';
      console.error(this.errorMessage);
    }
  }

  fetchUserProfile(): void {
    if (this.userId) {
      // Use DataService to fetch the user profile instead of directly using HttpClient
      this.dataService.getPatientUserInfo(this.userId).subscribe(
        (data: any) => {
          if (!data) {
            this.errorMessage = 'No data returned from API';
            console.error(this.errorMessage);
            return;
          }
  
          // Updated check to verify if the status.remarks is 'success'
          if (data.status && data.status.remarks === 'success' && data.payload && data.payload.length > 0) {
            // Assuming data.payload is an array of patients, and we need to find the matching user
            const patient = data.payload.find((p: any) => p.id === this.userId);
            if (patient) {
              this.user = patient;  // Set the user data
              this.errorMessage = '';  // Clear error if data is fetched successfully
            } else {
              this.errorMessage = 'Patient not found for the provided user ID';
              console.error(this.errorMessage);
            }
          } else {
            this.errorMessage = 'Invalid status or missing user data';
            console.error(this.errorMessage, data);
          }
        },
        (error: any) => {
          this.errorMessage = 'Error fetching user data';
          console.error(this.errorMessage, error);
        }
      );
    }
  }  
}
