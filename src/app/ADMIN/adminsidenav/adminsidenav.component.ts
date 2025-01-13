import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-adminsidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminsidenav.component.html',
  styleUrls: ['./adminsidenav.component.css'],
})
export class AdminsidenavComponent {
  isCollapsed = false; // Sidebar is initially expanded
  isLogoutModalVisible = false; // Controls the visibility of the logout modal

  constructor(private router: Router) {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed; // Toggle between expanded and collapsed states
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  showLogoutModal() {
    this.isLogoutModalVisible = true;
  }

  hideLogoutModal() {
    this.isLogoutModalVisible = false;
  }

  logout() {
    this.isLogoutModalVisible = false; // Hide the modal
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
