import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // ✅ User input data
  loginData = {
    email: '',
    password: ''
  };

  private apiUrl = 'http://localhost/carexusapi/backend/carexus.php?action=login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // ✅ Updated service
  ) {}

  ngOnInit(): void {}

  // ✅ Login function handling both Admin and User roles
  onLogin(event: Event): void {
    event.preventDefault();
    console.log('Login attempt with:', this.loginData);

    // ✅ Validate credentials and get the role
    const role = this.authService.validateCredentials(this.loginData.email, this.loginData.password);

    if (role === 'admin') {
      console.log('Admin login successful');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', this.loginData.email);
      this.router.navigate(['/admindashboard']); // ✅ Redirect to Admin Dashboard
    } else if (role === 'user') {
      console.log('User login successful');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userEmail', this.loginData.email);
      this.router.navigate(['/userdashboard']); // ✅ Redirect to User Dashboard
    } else {
      console.log('Login failed');
      alert('Invalid credentials. Please check your email and password.');
    }
  }

  // ✅ Optional: Redirect to login (can be customized)
  onUserLogin(): void {
    this.router.navigate(['/login']);
  }
}
