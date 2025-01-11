import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  private apiUrl = 'http://localhost/carexusapi/backend/carexus.php?action=login';

  constructor(private http: HttpClient, private router: Router) {}

  onAdminLogin() {
    this.router.navigate(['/adminlogin']);
  }

  onLogin(event: Event) {
    event.preventDefault();

    const body = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(this.apiUrl, body, { headers }).subscribe(
      (response: any) => {
        if (response.status) {
          localStorage.setItem('token', response.token);
          
          if (response.user.role === 'admin') {
            this.router.navigate(['/admindashboard']);
          } else {
            this.router.navigate(['/userdashboard']);
          }
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error('Error during login:', error);
        alert('Something went wrong. Please try again.');
      }
    );
  }
}
