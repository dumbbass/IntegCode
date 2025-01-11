import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';

@Component({
  selector: 'app-medicalreports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent
  ],
  templateUrl: './medicalreports.component.html',
  styleUrl: './medicalreports.component.css'
})
export class MedicalreportsComponent {
}
