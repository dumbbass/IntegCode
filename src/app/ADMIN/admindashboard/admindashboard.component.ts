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
  // @ViewChild('appointmentsChart') appointmentsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportChartCanvas', { static: false }) reportChartCanvas!: ElementRef;

  chart: any; // Placeholder for the patient growth chart instance
  // appointmentsChart: any; // Placeholder for the appointments chart instance

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
    // const appointmentLabels: string[] = []; // Commented out this variable
    // const appointmentData: number[] = []; // Commented out this variable
    const groupedData: any = {};
    // const appointmentGroupedData: any = {}; // Commented out this variable

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

      // For appointments per day (if available in patients table)
      // if (patient.appointment_date) { // Assuming there's an appointment_date field
      //   const appointmentDate = new Date(patient.appointment_date);
      //   const appointmentKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth() + 1}-${appointmentDate.getDate()}`;
        
      //   if (!appointmentGroupedData[appointmentKey]) {
      //     appointmentGroupedData[appointmentKey] = 0;
      //   }
      //   appointmentGroupedData[appointmentKey]++;
      // }
    });

    // Map the grouped data to labels and counts for patient growth
    for (const period in groupedData) {
      const [year, month] = period.split('-');
      labels.push(monthNames[parseInt(month) - 1] + ' ' + year);
      data.push(groupedData[period]);
    }

    // Map the grouped data to labels and counts for appointments per day
    // for (const appointmentDate in appointmentGroupedData) {
    //   const [year, month, day] = appointmentDate.split('-');
    //   appointmentLabels.push(`${monthNames[parseInt(month) - 1]} ${day}, ${year}`);
    //   appointmentData.push(appointmentGroupedData[appointmentDate]);
    // }

    return {
      patientGrowth: { labels, data }
      // appointmentsPerDay: { appointmentLabels, appointmentData } // Commented out this return property
    };
  }

  updateChartsWithData(data: any): void {
    // Destroy existing charts before recreating them
    if (this.chart) {
      this.chart.destroy();
    }
    // if (this.appointmentsChart) { // Commented out this check
    //   this.appointmentsChart.destroy();
    // }

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
    // this.appointmentsChart = new Chart(this.appointmentsChartCanvas.nativeElement, { // Commented out this chart creation
    //   type: 'line',
    //   data: {
    //     labels: data.appointmentsPerDay.appointmentLabels,
    //     datasets: [{
    //       label: 'Appointments',
    //       data: data.appointmentsPerDay.appointmentData,
    //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //       borderColor: 'rgba(255, 99, 132, 1)',
    //       borderWidth: 1,
    //       fill: true
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     scales: {
    //       x: {
    //         title: {
    //           display: true,
    //           text: 'Appointments per Day'
    //         }
    //       },
    //       y: {
    //         title: {
    //           display: true,
    //           text: 'Number of Appointments'
    //         },
    //         beginAtZero: true
    //       }
    //     }
    //   }
    // });
  }
}
