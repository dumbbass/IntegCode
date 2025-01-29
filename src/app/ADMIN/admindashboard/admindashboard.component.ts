import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { Chart } from 'chart.js';

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

  // Placeholder for the chart instance
  chart: any;

  constructor() { }

  ngAfterViewInit(): void {
    // Ensure the chartCanvas is available before trying to create the chart
    if (this.chartCanvas) {
      this.createChart('monthly'); // Default chart type on load
    }
  }

  onFilterChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.updateChart(filter);
  }

  // Method to create chart with data for the given filter
  createChart(filter: string): void {
    const data = this.getDataForFilter(filter);

    // Destroy previous chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create a new chart with updated data
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line', // Type of chart, can be changed to bar, pie, etc.
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Appointments',
          data: data.data,
          borderColor: '#007BFF',
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
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Appointments'
            }
          }
        }
      }
    });
  }

  // Method to get data based on the selected filter (this is dummy data for now)
  getDataForFilter(filter: string) {
    const labels = [];
    const data = [];
    const now = new Date();
    let startDate;

    switch (filter) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 1)); // yesterday
        labels.push('Yesterday');
        data.push(10); // Example value for the number of appointments
        break;

      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7)); // 1 week ago
        for (let i = 0; i < 7; i++) {
          labels.push(`Day ${i + 1}`);
          data.push(Math.floor(Math.random() * 10)); // Random number of appointments
        }
        break;

      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1)); // 1 month ago
        for (let i = 0; i < 30; i++) {
          labels.push(`Day ${i + 1}`);
          data.push(Math.floor(Math.random() * 10)); // Random number of appointments
        }
        break;

      case 'yearly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // 1 year ago
        for (let i = 0; i < 12; i++) {
          labels.push(`Month ${i + 1}`);
          data.push(Math.floor(Math.random() * 100)); // Random number of appointments
        }
        break;

      default:
        break;
    }

    return { labels, data };
  }

  // Update chart based on filter
  updateChart(filter: string): void {
    this.createChart(filter);
  }
}
