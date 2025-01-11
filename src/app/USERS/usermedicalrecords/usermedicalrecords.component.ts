import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-usermedicalrecords',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './usermedicalrecords.component.html',
  styleUrl: './usermedicalrecords.component.css'
})
export class UsermedicalrecordsComponent {

}
