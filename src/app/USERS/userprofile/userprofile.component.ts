import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';  // Correct import path

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [SidenavComponent],  // Corrected from 'sidenav' to 'SidenavComponent'
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']  // Correct usage of styleUrls
})
export class UserprofileComponent {
  user = {
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: 'January 1, 2000',
    email: 'johndoe@gmail.com',
    address: '101 Elicano St. E.B.B.',
    contactNumber: '09934562435'
  };
}
