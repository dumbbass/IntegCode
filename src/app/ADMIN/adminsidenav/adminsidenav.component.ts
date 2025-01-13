import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-adminsidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adminsidenav.component.html',
  styleUrls: ['./adminsidenav.component.css']
})
export class AdminsidenavComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
} 