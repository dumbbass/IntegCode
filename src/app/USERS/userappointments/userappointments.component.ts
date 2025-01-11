import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userappointments',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './userappointments.component.html',
  styleUrl: './userappointments.component.css'
})
export class UserappointmentsComponent {

}
