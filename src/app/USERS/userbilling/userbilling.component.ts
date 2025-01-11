import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-userbilling',
  standalone: true,
  imports: [
    SidenavComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './userbilling.component.html',
  styleUrl: './userbilling.component.css'
})
export class UserbillingComponent {

}
