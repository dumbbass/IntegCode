import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Form inputs
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  gender: string = '';
  homeAddress: string = '';
  contactNumber: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Validation errors
  errors: { [key: string]: string } = {};
  submitError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  checkPasswordStrength(password: string): { score: number, feedback: string } {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    if (score < 2) {
      feedback.push('Password is weak');
    } else if (score < 4) {
      feedback.push('Password is moderate');
    } else {
      feedback.push('Password is strong');
    }

    if (!password.match(/[A-Z]/)) feedback.push('Add uppercase letter');
    if (!password.match(/[a-z]/)) feedback.push('Add lowercase letter');
    if (!password.match(/[0-9]/)) feedback.push('Add number');
    if (!password.match(/[^A-Za-z0-9]/)) feedback.push('Add special character');

    return { score, feedback: feedback.join(', ') };
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    // First Name validation
    if (!this.firstName.trim()) {
      this.errors['firstName'] = 'First name is required';
      isValid = false;
    }

    // Last Name validation
    if (!this.lastName.trim()) {
      this.errors['lastName'] = 'Last name is required';
      isValid = false;
    }

    // Date of Birth validation
    if (!this.dob) {
      this.errors['dob'] = 'Date of birth is required';
      isValid = false;
    } else {
      const dobDate = new Date(this.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) {
        this.errors['dob'] = 'You must be at least 18 years old';
        isValid = false;
      }
    }

    // Gender validation
    if (!this.gender) {
      this.errors['gender'] = 'Please select a gender';
      isValid = false;
    }

    // Home Address validation
    if (!this.homeAddress.trim()) {
      this.errors['homeAddress'] = 'Home address is required';
      isValid = false;
    }

    // Contact Number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!this.contactNumber.trim()) {
      this.errors['contactNumber'] = 'Contact number is required';
      isValid = false;
    } else if (!phoneRegex.test(this.contactNumber)) {
      this.errors['contactNumber'] = 'Please enter a valid contact number';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email.trim()) {
      this.errors['email'] = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.email)) {
      this.errors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Enhanced Password validation
    if (!this.password) {
      this.errors['password'] = 'Password is required';
      isValid = false;
    } else {
      const passwordStrength = this.checkPasswordStrength(this.password);
      if (passwordStrength.score < 3) {
        this.errors['password'] = `Password is too weak. ${passwordStrength.feedback}`;
        isValid = false;
      }
    }

    // Confirm Password validation
    if (!this.confirmPassword) {
      this.errors['confirmPassword'] = 'Please confirm your password';
      isValid = false;
    } else if (this.confirmPassword !== this.password) {
      this.errors['confirmPassword'] = 'Passwords do not match';
      isValid = false;
    }

    // Terms & Conditions validation
    if (!this.termsAccepted) {
      this.errors['terms'] = 'You must accept the Terms and Conditions';
      isValid = false;
    }

    // Email domain validation
    if (this.email) {
      const domain = this.email.split('@')[1];
      const blockedDomains = ['tempmail.com', 'throwaway.com']; // Add more as needed
      if (blockedDomains.includes(domain)) {
        this.errors['email'] = 'This email domain is not allowed';
        isValid = false;
      }
    }

    return isValid;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        dob: this.dob,
        gender: this.gender,
        homeAddress: this.homeAddress,
        contactNumber: this.contactNumber,
        email: this.email,
        password: this.password,
      };

      this.http.post('http://localhost/API/carexusapi/backend/carexus.php?action=register', userData).subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Registration failed:', error);
          this.submitError = 'Registration failed. Please try again.';
        }
      );
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}

