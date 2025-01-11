import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, SidenavComponent],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent {
  selectedDescription: string | null = null;
  selectedDoctor: string | null = null;
  selectedDate: string | null = null;

  openDescription(description: string, doctor: string = '', date: string = '') {
    this.selectedDescription = description;
    this.selectedDoctor = doctor;
    this.selectedDate = date;
  }

  closeDescription() {
    this.selectedDescription = null;
    this.selectedDoctor = null;
    this.selectedDate = null;
  }
}
