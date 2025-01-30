import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';

@Component({
  selector: 'app-schedule',
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent,
    FormsModule
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  // Use BehaviorSubject for efficient updates
  currentMonth$ = new BehaviorSubject<Date>(new Date());
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Cache for generated weeks
  private weeksCache: Date[][] | null = null;
  private cacheMonth: number | null = null;

  selectedDates: Date[] = [];
  isModalOpen = false;
  modalDate: Date | null = null;
  modalTimes: string[] = [];
  newTime = '';

  availability: { date: Date; times: string[] }[] = [];

  // Add these new properties to the component class
  availabilityStatus: { [key: string]: boolean } = {}; // Track which dates have availability
  isBulkMode = false;
  bulkTimes: string[] = [];
  conflictMessage = '';

  // Add these new properties
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Add this property for preset times
  presetTimes: string[] = [
    '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
  ];

  constructor() {
    console.log('ScheduleComponent initialized');
    // Subscribe to month changes
    this.currentMonth$.subscribe(() => {
      this.generateWeeks();
    });
  }

  // Optimized month navigation
  prevMonth() {
    const current = this.currentMonth$.value;
    this.currentMonth$.next(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentMonth$.value;
    this.currentMonth$.next(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  // Generate only visible weeks
  generateWeeks(): Date[][] {
    const current = this.currentMonth$.value;
    
    // Return cached weeks if available
    if (this.weeksCache && this.cacheMonth === current.getMonth()) {
      return this.weeksCache;
    }

    const weeks: Date[][] = [];
    let week: Date[] = [];
    
    // Get first day of month
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    // Get last day of month
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    
    // Start from the first day of the week that includes the first day of the month
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Generate only the visible days
    while (startDay <= lastDay) {
      week.push(new Date(startDay));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      startDay.setDate(startDay.getDate() + 1);
    }
    
    // Cache the result
    this.weeksCache = weeks;
    this.cacheMonth = current.getMonth();
    
    return weeks;
  }

  // Get weeks for the template
  getWeeks(): Date[][] {
    return this.generateWeeks();
  }

  // Optimized isToday check
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Date selection handling
  isSelected(date: Date): boolean {
    return this.selectedDates.some(d => d && isSameDay(d, date));
  }

  toggleDateSelection(date: Date) {
    if (this.isPastDate(date)) {
      this.errorMessage = 'Cannot select past dates';
      return;
    }

    const index = this.selectedDates.findIndex(d => isSameDay(d, date));
    if (index >= 0) {
      this.selectedDates.splice(index, 1);
    } else {
      this.selectedDates.push(new Date(date));
    }
  }

  // Modal handling
  openModal(date: Date) {
    this.modalDate = new Date(date);
    const existingEntry = this.availability.find(entry => isSameDay(entry.date, date));
    this.modalTimes = existingEntry ? [...existingEntry.times] : [];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalDate = null;
    this.modalTimes = [];
    this.newTime = '';
  }

  // Time management
  addTime() {
    if (this.newTime && !this.modalTimes.includes(this.newTime)) {
      this.modalTimes.push(this.newTime);
      this.sortTimes();
      this.newTime = '';
    }
  }

  removeTime(time: string) {
    this.modalTimes = this.modalTimes.filter(t => t !== time);
  }

  // Availability management
  async saveAvailability() {
    if (!this.modalDate) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      // Validate times
      if (this.modalTimes.length === 0) {
        throw new Error('Please add at least one time slot');
      }

      const existingEntry = this.availability.find(entry => 
        isSameDay(entry.date, this.modalDate!)
      );
      
      if (existingEntry) {
        existingEntry.times = [...this.modalTimes];
      } else {
        this.availability.push({ 
          date: new Date(this.modalDate), 
          times: [...this.modalTimes] 
        });
      }
      
      this.updateAvailabilityStatus(this.modalDate);
      this.successMessage = 'Availability saved successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to save availability';
    } finally {
      this.isLoading = false;
    }
  }

  // Time formatting
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
  }

  // Check if a date has availability
  hasAvailability(date: Date): boolean {
    const dateKey = date.toISOString().split('T')[0];
    return !!this.availabilityStatus[dateKey];
  }

  // Get availability for a specific date
  getAvailabilityForDate(date: Date): string[] {
    const entry = this.availability.find(d => isSameDay(d.date, date));
    return entry ? entry.times : [];
  }

  // Validate time slot
  validateTime(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  // Check for time conflicts
  checkTimeConflict(newTime: string): boolean {
    return this.modalTimes.some(time => {
      const timeDiff = Math.abs(
        new Date(`1970-01-01T${newTime}:00`).getTime() - 
        new Date(`1970-01-01T${time}:00`).getTime()
      );
      return timeDiff < 30 * 60 * 1000; // 30 minutes buffer
    });
  }

  // Toggle bulk mode
  toggleBulkMode() {
    this.isBulkMode = !this.isBulkMode;
    if (!this.isBulkMode) {
      this.bulkTimes = [];
    }
  }

  // Add bulk times
  addBulkTime() {
    if (this.newTime && !this.bulkTimes.includes(this.newTime)) {
      this.bulkTimes.push(this.newTime);
      this.sortTimes();
      this.newTime = '';
    }
  }

  // Apply bulk availability
  applyBulkAvailability() {
    if (this.bulkTimes.length > 0) {
      this.selectedDates.forEach(date => {
        const existingEntry = this.availability.find(entry => isSameDay(entry.date, date));
        if (existingEntry) {
          existingEntry.times = [...new Set([...existingEntry.times, ...this.bulkTimes])];
        } else {
          this.availability.push({
            date: new Date(date),
            times: [...this.bulkTimes]
          });
        }
        this.updateAvailabilityStatus(date);
      });
      this.isBulkMode = false;
      this.bulkTimes = [];
    }
  }

  // Update availability status
  updateAvailabilityStatus(date: Date) {
    const dateKey = date.toISOString().split('T')[0];
    const entry = this.availability.find(d => isSameDay(d.date, date));
    this.availabilityStatus[dateKey] = !!entry && entry.times.length > 0;
  }

  // Add this optimized method to the component class
  removeBulkTime(time: string): void {
    const index = this.bulkTimes.indexOf(time);
    if (index > -1) {
      this.bulkTimes.splice(index, 1);
    }
  }

  // Add this method for better date selection
  selectDate(date: Date) {
    if (this.isPastDate(date)) {
      this.errorMessage = 'Cannot select past dates';
      return;
    }

    if (this.isBulkMode) {
      const index = this.selectedDates.findIndex(d => isSameDay(d, date));
      if (index >= 0) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(new Date(date));
      }
    } else {
      this.openModal(date);
    }
  }

  // Add this method to check if a date is in the past
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return date < today;
  }

  // Add this method to add preset times
  addPresetTime(time: string) {
    if (!this.modalTimes.includes(time)) {
      this.modalTimes.push(time);
      this.sortTimes();
    }
  }

  // Add this method to sort times from AM to PM
  private sortTimes() {
    this.modalTimes.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a}:00`).getTime();
      const timeB = new Date(`1970-01-01T${b}:00`).getTime();
      return timeA - timeB;
    });
  }
}
