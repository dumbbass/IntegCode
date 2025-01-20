import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent,
    HttpClientModule
  ],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<{ status: boolean, users: any[] }>('http://localhost/API/carexusapi/Backend/carexus.php?action=getUsers')
      .subscribe(
        response => {
          if (response.status) {
            this.users = response.users;
          } else {
            console.error('Failed to fetch users');
          }
        },
        error => console.error('Error fetching users', error)
      );
  }
}
