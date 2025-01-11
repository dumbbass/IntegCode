import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent {
  selectedDescription: string | null = null;

  openDescription(description: string) {
    this.selectedDescription = description;
  }

  closeDescription() {
    this.selectedDescription = null;
  }
}
