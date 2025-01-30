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
      this.newTime = '';
    }
  }

  removeTime(time: string) {
    this.modalTimes = this.modalTimes.filter(t => t !== time);
  }

  // Availability management
  saveAvailability() {
    if (this.modalDate) {
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
      this.closeModal();
    }
  }

  // Time formatting
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
  }
}
