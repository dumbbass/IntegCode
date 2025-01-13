import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent
  ],
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent {
  // Add any necessary logic for the archive component here
} 