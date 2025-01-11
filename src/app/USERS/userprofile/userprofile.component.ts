import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'] // Fixed `styleUrl` to `styleUrls`
})
export class UserprofileComponent {
  // Define the data that will be used in the HTML
  user = {
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: 'January 1, 2000',
    email: 'johndoe@gmail.com',
    address: '101 Elicano St. E.B.B.',
    contactNumber: '09934562435'
  };
}
