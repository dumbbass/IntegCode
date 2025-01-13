import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';


@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {
}
