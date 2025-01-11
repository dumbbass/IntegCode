import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css'
})
export class AdminloginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  // Define the API URL correctly
  private apiUrl = 'http://localhost/carexusapi/backend/carexus.php?action=login';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    // AdminService will handle initialization
  }

  onLogin(event: Event) {
    event.preventDefault();
    console.log('Login attempt with:', this.loginData);
    
    if (!this.adminService.isAdminEmail(this.loginData.email)) {
      alert('Access denied. This login is only for administrators.');
      return;
    }

    // Check credentials against stored admin accounts
    if (this.adminService.validateAdminCredentials(this.loginData.email, this.loginData.password)) {
      console.log('Login successful');
      // Store user info in localStorage
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', this.loginData.email);
      
      // Navigate to admin dashboard
      this.router.navigate(['/admindashboard']);
    } else {
      console.log('Login failed');
      alert('Invalid credentials. Please check your email and password.');
    }
  }

  onUserLogin() {
    this.router.navigate(['/login']);
  }
}
