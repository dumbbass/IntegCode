import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  patients: any[] = [];
  patientData: any[] = [];
  isModalOpen = false;

  chart: any; // Patient Growth Chart
  appointmentsChart: any; // Appointments Chart

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    if (this.chartCanvas && this.appointmentsChartCanvas) {
      this.createCharts();
    }
  }

  createCharts(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.http.get<{ status: boolean; patients: any[] }>('http://localhost/API/carexusapi/Backend/carexus.php?action=getPatients')
      .subscribe(response => {
        if (response.status) {
          this.patients = response.patients;
          this.patientData = response.patients; // Assigning to be used in PDF
          const chartData = this.getDataForFilter(response.patients);
          this.updateChartsWithData(chartData);
        } else {
          console.error('Failed to fetch patients');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Patient Report', 14, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 20);

    const tableData = this.patientData.map(patient => [
      patient.name, patient.age, patient.gender, patient.diagnosis, patient.status, patient.appointment_date
    ]);

    (doc as any).autoTable({
      head: [['Name', 'Age', 'Gender', 'Diagnosis', 'Status', 'Appointment Date']],
      body: tableData,
      startY: 30
    });

    doc.save('Patient_Report.pdf');
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getDataForFilter(patients: any[]): any {
    const labels: string[] = [];
    const data: number[] = [];
    const appointmentLabels: string[] = [];
    const appointmentData: number[] = [];
    const groupedData: any = {};
    const appointmentGroupedData: any = {};

    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    patients.forEach(patient => {
      const patientDate = new Date(patient.created_at);
      const periodKey = `${patientDate.getFullYear()}-${patientDate.getMonth() + 1}`;

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = 0;
      }
      groupedData[periodKey]++;

      if (patient.appointment_date) {
        const appointmentDate = new Date(patient.appointment_date);
        const appointmentKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth() + 1}-${appointmentDate.getDate()}`;

        if (!appointmentGroupedData[appointmentKey]) {
          appointmentGroupedData[appointmentKey] = 0;
        }
        appointmentGroupedData[appointmentKey]++;
      }
    });

    for (const period in groupedData) {
      const [year, month] = period.split('-');
      labels.push(`${monthNames[parseInt(month) - 1]} ${year}`);
      data.push(groupedData[period]);
    }

    for (const appointmentDate in appointmentGroupedData) {
      const [year, month, day] = appointmentDate.split('-');
      appointmentLabels.push(`${monthNames[parseInt(month) - 1]} ${day}, ${year}`);
      appointmentData.push(appointmentGroupedData[appointmentDate]);
    }

    return {
      patientGrowth: { labels, data },
      appointmentsPerDay: { labels: appointmentLabels, data: appointmentData }
    };
  }

  updateChartsWithData(data: any): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.appointmentsChart) {
      this.appointmentsChart.destroy();
    }

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
            max: 50
          }
        }
      }
    });

    this.appointmentsChart = new Chart(this.appointmentsChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.appointmentsPerDay.labels,
        datasets: [{
          label: 'Appointments per Day',
          data: data.appointmentsPerDay.data,
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
            max: 50
          }
        }
      }
    });
  }
}
