import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { ArchiveService } from '../archive/archive.service';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent,
    FormsModule  // Add FormsModule here
  ],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchQuery: string = '';
  showArchiveModal: boolean = false;
  userToArchive: any = null;
  archiveRemarks: string = '';

  constructor(private http: HttpClient, private archiveService: ArchiveService) {}

  ngOnInit() {
    this.fetchUsers();
    this.loadArchivedUsers();
  }

  fetchUsers() {
    this.http.get<{ status: boolean; users: any[] }>(
      'http://localhost/API/carexusapi/Backend/carexus.php?action=getUsers'
    ).subscribe(
      response => {
        console.log('API Response:', response);  // Log the full response to check for missing fields
        if (response.status) {
          this.users = response.users;
          this.filteredUsers = this.users; // Initialize filteredUsers to be all users initially
        } else {
          console.error('Failed to fetch users');
        }
      },
      error => console.error('Error fetching users', error)
    );
  }

  loadArchivedUsers() {
    const archivedUsers: any[] = JSON.parse(localStorage.getItem('archivedUsers') || '[]');
    this.users = this.users.filter(user => !archivedUsers.some((archived: any) => archived.email === user.email));
    this.filteredUsers = [...this.users];
  }

  searchUsers() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
        (user.firstname + ' ' + user.lastname).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      
    }
  }

  viewUser(user: any) {
    console.log('Selected User:', user); // Log the selected user data

    // Ensure that contact_number and home_address are included if they exist in the user object
    this.selectedUser = {
      firstname: user.firstname || 'N/A',
      lastname: user.lastname || 'N/A',
      gender: user.gender || 'N/A',
      email: user.email || 'N/A',
      contact_number: user.contact_number || 'N/A',  // Ensure correct field name
      home_address: user.home_address || 'N/A',  // Ensure correct field name
      medicalHistory: user.medicalHistory || []
    };
  }

  closeModal() {
    this.selectedUser = null;
  }

  openArchiveModal(user: any) {
    this.userToArchive = user;
    this.showArchiveModal = true;
  }

  closeArchiveModal() {
    this.showArchiveModal = false;
    this.userToArchive = null;
    this.archiveRemarks = '';
  }

  confirmArchive() {
    if (this.userToArchive) {
      // Archive the user using the service
      this.archiveService.addArchivedUser({
        ...this.userToArchive,
        dateArchived: new Date().toISOString().split('T')[0],
        remarks: this.archiveRemarks
      });
      // Persist archived users in local storage
      const archivedUsers = JSON.parse(localStorage.getItem('archivedUsers') || '[]');
      archivedUsers.push({
        ...this.userToArchive,
        dateArchived: new Date().toISOString().split('T')[0],
        remarks: this.archiveRemarks
      });
      localStorage.setItem('archivedUsers', JSON.stringify(archivedUsers));
      // Remove the user from the current list
      this.users = this.users.filter(user => user !== this.userToArchive);
      this.filteredUsers = this.filteredUsers.filter(user => user !== this.userToArchive);
      console.log('Archived user:', this.userToArchive, 'with remarks:', this.archiveRemarks);
      this.closeArchiveModal();
      this.archiveRemarks = ''; // Clear remarks after archiving
    }
  }
}
