import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';

@Component({
  selector: 'app-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.css'],
})
export class SymptomsComponent implements OnInit {
  patientId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id'); // Example for capturing a route parameter
    console.log('Patient ID:', this.patientId);
  }
}
