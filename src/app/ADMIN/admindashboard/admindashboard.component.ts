import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  patients: any[] = [];
  @ViewChild('medicalReportsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('appointmentsChart') appointmentsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportChartCanvas', { static: false }) reportChartCanvas!: ElementRef;

  chart: any; // Placeholder for the patient growth chart instance
  appointmentsChart: any;

  constructor(private http: HttpClient) { }
  isReportModalOpen = false;
  statistics = [
    { period: 'Daily', appointments: 5, registrations: 3 },
    { period: 'Weekly', appointments: 32, registrations: 21 },
    { period: 'Monthly', appointments: 120, registrations: 90 }
  ];
  
  openReportModal() {
    this.isReportModalOpen = true;
    console.log(this.isReportModalOpen); // Check if modal state is updated
    this.fetchAppointments();  // Fetch appointments when opening the modal
    setTimeout(() => this.renderChart(), 100);
  }
  
  closeReportModal() {
    this.isReportModalOpen = false;
  }

  printReport() {
    const printContent = document.querySelector('.report-modal-content')!.innerHTML;
    const originalContent = document.body.innerHTML;
  
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }
  
  selectedPatient = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    diagnosis: 'Hypertension',
    records: [
      { date: '2024-02-01', procedure: 'Blood Test', doctor: 'Dr. Smith', status: 'Completed' },
      { date: '2024-02-05', procedure: 'ECG', doctor: 'Dr. Johnson', status: 'Pending' }
    ]
  };
    

  renderChart() {
    const ctx = this.reportChartCanvas.nativeElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.statistics.map(s => s.period),
          datasets: [{
            label: 'Appointments',
            data: this.statistics.map(s => s.appointments),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }, {
            label: 'Registrations',
            data: this.statistics.map(s => s.registrations),
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }]
        },
        options: { responsive: true }
      });
    }
  }
  

  exportToExcel() {
    const patientSheet = XLSX.utils.json_to_sheet(this.patients);
    const appointmentSheet = XLSX.utils.json_to_sheet(this.appointmentPatients);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, patientSheet, "Patients List");
    XLSX.utils.book_append_sheet(workbook, appointmentSheet, "All Made Appointments");
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    saveAs(data, "Hospital_Report.xlsx");
  }
  

  ngAfterViewInit(): void {
    if (this.chartCanvas) {
      this.createCharts();
      this.renderChart(); // Create both charts after view initialization
    }
  }

  createCharts(): void {
    this.fetchUsers();
    this.fetchPatients();
    this.createAppointmentsChart();
  }

  createAppointmentsChart(): void {
    this.http.get<{ status: boolean; appointments: any[] }>(
      'http://localhost/API/carexusapi/Backend/carexus.php?action=getPatientAppointments'
    ).subscribe(response => {
      if (response.status && response.appointments) {
        const appointmentStats = this.processAppointmentData(response.appointments);

        if (this.appointmentsChartCanvas) {
          if (this.appointmentsChart) {
            this.appointmentsChart.destroy();
          }

          this.appointmentsChart = new Chart(this.appointmentsChartCanvas.nativeElement, {
            type: 'bar',
            data: {
              labels: ['Pending', 'Approved', 'Declined'],
              datasets: [{
                label: 'Appointments by Status',
                data: [
                  appointmentStats.pending,
                  appointmentStats.approved,
                  appointmentStats.declined
                ],
                backgroundColor: [
                  'rgba(255, 206, 86, 0.8)',  // yellow for pending
                  'rgba(40, 167, 69, 0.8)',  // green for approved
                  'rgba(220, 53, 69, 0.8)'   // red for declined
                ],
                borderColor: [
                  'rgba(255, 206, 86, 1)',
                  'rgba(40, 167, 69, 1)',
                  'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                maxBarThickness: 60
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  title: {
                    display: true,
                    text: 'Number of Appointments',
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    padding: 10
                  },
                  ticks: {
                    stepSize: 1,
                    precision: 0
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Appointment Distribution by Status',
                  font: {
                    size: 18,
                    weight: 'bold'
                  },
                  padding: {
                    top: 10,
                    bottom: 30
                  }
                },
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#000',
                  titleFont: {
                    size: 14,
                    weight: 'bold'
                  },
                  bodyColor: '#000',
                  bodyFont: {
                    size: 13
                  },
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: 1,
                  padding: 12,
                  displayColors: true,
                  callbacks: {
                    label: function(context: any) {
                      return `Total: ${context.raw} appointments`;
                    }
                  }
                }
              }
            }
          });
        }
      }
    }, error => {
      console.error('Error fetching appointment data:', error);
    });
  }

  processAppointmentData(appointments: any[]): any {
    const stats = {
      pending: 0,
      approved: 0,
      declined: 0
    };

    appointments.forEach(appointment => {
      switch (appointment.status.toLowerCase()) {
        case 'pending':
          stats.pending++;
          break;
        case 'approved':
          stats.approved++;
          break;
        case 'declined':
          stats.declined++;
          break;
      }
    });

    return stats;
  }

  fetchAppointments(): void {
    this.http.get<{ status: boolean; appointments: any[] }>(
      'http://localhost/API/carexusapi/Backend/carexus.php?action=getPatientAppointments'
    ).subscribe(response => {
      if (response.status) {
        this.appointmentPatients = response.appointments.map(appointment => ({
          appointment_id: appointment.appointment_id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          purpose: appointment.purpose,
          status: appointment.status,
          doctor: `${appointment.doctor_firstname} ${appointment.doctor_lastname}`
        }));
      } else {
        console.error('Failed to fetch appointments');
      }
    }, error => {
      console.error('Error fetching appointments:', error);
    });
  }
  

  fetchPatients(): void {
    this.http.get<{ status: boolean; patients: any[] }>('http://localhost/API/carexusapi/Backend/carexus.php?action=getPatients')
      .subscribe(response => {
        if (response.status) {
          this.patients = response.patients;
          const chartData = this.getDataForFilter(response.patients);
          this.updateChartsWithData(chartData);
        } else {
          console.error('Failed to fetch patients');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  fetchUsers(): void {
    this.http.get<{ status: boolean; patients: any[] }>('http://localhost/API/carexusapi/Backend/carexus.php?action=getPatients')
      .subscribe(response => {
        if (response.status) {
          this.patients = response.patients;
  
          // Separate patients who made appointments and those who registered in a specific period
          this.filterAppointmentPatients();
          this.filterRegisteredPatients();
        } else {
          console.error('Failed to fetch patients');
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }
  
  // Store patients with appointments
  appointmentPatients: any[] = [];
  
  // Store weekly/monthly registered patients
  weeklyRegisteredPatients: any[] = [];
  monthlyRegisteredPatients: any[] = [];
  
  filterAppointmentPatients() {
    this.appointmentPatients = this.patients.filter(patient => patient.appointment_date);
  }
  
  filterRegisteredPatients() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    this.weeklyRegisteredPatients = this.patients.filter(patient =>
      new Date(patient.created_at) >= oneWeekAgo
    );
  
    this.monthlyRegisteredPatients = this.patients.filter(patient =>
      new Date(patient.created_at) >= oneMonthAgo
    );
  }


  getDataForFilter(patients: any[]): any {
    const labels: string[] = [];
    const data: number[] = [];
    const groupedData: any = {};

    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];

    patients.forEach(patient => {
      const patientDate = new Date(patient.created_at); // Use created_at from patients table
      const periodKey = `${patientDate.getFullYear()}-${patientDate.getMonth() + 1}`;

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = 0;
      }
      groupedData[periodKey]++;
    });

    // Map the grouped data to labels and counts for patient growth
    for (const period in groupedData) {
      const [year, month] = period.split('-');
      labels.push(monthNames[parseInt(month) - 1] + ' ' + year);
      data.push(groupedData[period]);
    }

    return {
      patientGrowth: { labels, data }
    };
  }

  updateChartsWithData(data: any): void {
    // Destroy existing charts before recreating them
    if (this.chart) {
      this.chart.destroy();
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
            max: 50, // Fixed max value for the Y-axis
            ticks: {
              stepSize: 1,
              precision: 0 // This ensures whole numbers only
            }
          }
        }
      }
    });
  }
}

