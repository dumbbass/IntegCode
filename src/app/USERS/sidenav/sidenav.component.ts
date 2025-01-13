import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  showModal = false;

  constructor(private router: Router) {}

  confirmLogout() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  logout() {
    this.showModal = false;
    this.router.navigate(['/logout']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
