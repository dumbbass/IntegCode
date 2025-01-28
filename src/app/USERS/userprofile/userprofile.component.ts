import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '../../auth.service';  // Import the AuthService
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [SidenavComponent, CommonModule, HttpClientModule, FormsModule],  // Include HttpClientModule and FormsModule here
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  user: any = {};  
  userId: number | null = null;  // userId can be null initially
  errorMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

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
      this.http.get(`http://localhost/API/carexusapi/backend/carexus.php?action=getUserProfile&id=${this.userId}`)
        .subscribe(
          (data: any) => {
            if (!data) {
              this.errorMessage = 'No data returned from API';
              console.error(this.errorMessage);
              return;
            }

            if (data.status === true) {
              this.user = data.user;
              this.errorMessage = '';  // Clear error if data is fetched successfully
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

  updateUserProfile(): void {
    if (this.userId) {
      this.http.post(`http://localhost/API/carexusapi/backend/carexus.php?action=updateUserProfile`, {
        id: this.userId,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        gender: this.user.gender,
        home_address: this.user.home_address,
        contact_number: this.user.contact_number,
        height: this.user.height,
        weight: this.user.weight,
        medications: this.user.medications
      }).subscribe(
        (response: any) => {
          if (response.status === true) {
            alert('Profile updated successfully!');
          } else {
            this.errorMessage = 'Failed to update profile';
            console.error(this.errorMessage, response);
          }
        },
        (error: any) => {
          this.errorMessage = 'Error updating profile';
          console.error(this.errorMessage, error);
        }
      );
    }
  }
  

  openModal(): void {
    const modal = document.getElementById('updateProfileModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('updateProfileModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
