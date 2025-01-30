import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admindashboard',
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent
  ],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements AfterViewInit {
  @ViewChild('medicalReportsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('appointmentsChart') appointmentsChartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: any; // Placeholder for the patient growth chart instance
  appointmentsChart: any; // Placeholder for the appointments chart instance

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    if (this.chartCanvas && this.appointmentsChartCanvas) {
      this.createCharts(); // Create both charts after view initialization
    }
  }

  createCharts(): void {
    this.fetchUsers(); // Fetch data for both charts
  }

  fetchUsers(): void {
    this.http.get<{ status: boolean; users: any[] }>('http://localhost/API/carexusapi/Backend/carexus.php?action=getUsers')
      .subscribe(response => {
        if (response.status) {
          const userData = this.getDataForFilter(response.users);
          this.updateChartsWithData(userData); // Update both charts with fetched data
        } else {
          console.error('Failed to fetch users');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  getDataForFilter(users: any[]): any {
    const labels: string[] = [];
    const data: number[] = [];
    const appointmentLabels: string[] = [];
    const appointmentData: number[] = [];
    const groupedData: any = {};
    const appointmentGroupedData: any = {};

    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July", "August", 
      "September", "October", "November", "December"
    ];

    users.forEach(user => {
      const userDate = new Date(user.date);
      const periodKey = `${userDate.getFullYear()}-${userDate.getMonth() + 1}`;

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = 0;
      }

      groupedData[periodKey]++; // Increment the count of users for that period

      // For appointments per day
      const appointmentDate = new Date(user.appointmentDate); // Assuming users have an appointmentDate field
      const appointmentKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth() + 1}-${appointmentDate.getDate()}`;
      
      if (!appointmentGroupedData[appointmentKey]) {
        appointmentGroupedData[appointmentKey] = 0;
      }
      
      appointmentGroupedData[appointmentKey]++; // Increment the count of appointments for that day
    });

    // Map the grouped data to labels and counts for patient growth
    for (const period in groupedData) {
      const [year, month] = period.split('-');
      labels.push(monthNames[parseInt(month) - 1] + ' ' + year); // Convert month number to month name
      data.push(groupedData[period]);
    }

    // Map the grouped data to labels and counts for appointments per day
    for (const appointmentDate in appointmentGroupedData) {
      const [year, month, day] = appointmentDate.split('-');
      appointmentLabels.push(`${monthNames[parseInt(month) - 1]} ${day}, ${year}`);
      appointmentData.push(appointmentGroupedData[appointmentDate]);
    }

    return {
      patientGrowth: { labels, data },
      appointmentsPerDay: { appointmentLabels, appointmentData }
    };
  }

  updateChartsWithData(data: any): void {
    // Destroy existing charts before recreating them
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.appointmentsChart) {
      this.appointmentsChart.destroy();
    }

    // Create Patient Growth Chart
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar', 
      data: {
        labels: data.patientGrowth.labels,
        datasets: [{
          label: 'Patient Growth',
          data: data.patientGrowth.data,
          backgroundColor: '#007BFF',
          borderColor: '#0056b3',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Total Patients'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Patients'
            },
            beginAtZero: true,
            max: 50 // Fixed max value for the Y-axis
          }
        }
      }
    });

    // Create Appointments per Day Chart
    this.appointmentsChart = new Chart(this.appointmentsChartCanvas.nativeElement, {
      type: 'line', // You can change the chart type here (line, bar, etc.)
      data: {
        labels: data.appointmentsPerDay.appointmentLabels,
        datasets: [{
          label: 'Appointments per Day',
          data: data.appointmentsPerDay.appointmentData,
          backgroundColor: '#28a745',
          borderColor: '#218838',
          borderWidth: 2,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Appointments per Day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Appointments'
            },
            beginAtZero: true,
            max: 50 // Fixed max value for the Y-axis
          }
        }
      }
    });
  }
}
