import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { FormsModule } from '@angular/forms';

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
  currentMonth: Date = new Date();
  selectedDates: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth: Date[] = [];
  availability: { date: Date; times: string[] }[] = []; // Store availability

  // Modal state
  isModalOpen: boolean = false;
  modalDate: Date | null = null;
  modalTimes: string[] = [];
  newTime: string = '';

  constructor() {
    this.generateCalendar();
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
    this.generateCalendar();
  }

  generateCalendar() {
    const start = startOfWeek(startOfMonth(this.currentMonth));
    const end = endOfWeek(endOfMonth(this.currentMonth));

    const days = [];
    let day = start;
    while (day <= end) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    this.daysInMonth = days;
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.some((d) => isSameDay(d, date));
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getWeeks(): Date[][] {
    const weeks: Date[][] = [];
    let week: Date[] = [];

    this.daysInMonth.forEach((day, index) => {
      week.push(day);
      if ((index + 1) % 7 === 0) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }

  openModal(date: Date) {
    this.modalDate = date;
    const existingEntry = this.availability.find((entry) => isSameDay(entry.date, date));
    this.modalTimes = existingEntry ? [...existingEntry.times] : [];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalDate = null;
    this.modalTimes = [];
    this.newTime = '';
  }

  addTime() {
    if (this.newTime && !this.modalTimes.includes(this.newTime)) {
      this.modalTimes.push(this.newTime);
      this.newTime = '';
    }
  }

  removeTime(time: string) {
    this.modalTimes = this.modalTimes.filter((t) => t !== time);
  }

  saveAvailability() {
    if (this.modalDate) {
      const existingEntry = this.availability.find((entry) =>
        isSameDay(new Date(entry.date), this.modalDate!)
      );
      if (existingEntry) {
        existingEntry.times = [...this.modalTimes];
      } else {
        this.availability.push({ date: this.modalDate, times: [...this.modalTimes] });
      }
      this.closeModal();
    }
  }

  // Helper function to format time to AM/PM
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number); // Split time into hours and minutes
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${amPm}`;
  }

  // Update an availability entry by opening the modal with its data
  updateAvailability(index: number) {
    const entry = this.availability[index];
    this.modalDate = entry.date;
    this.modalTimes = [...entry.times]; // Load the times for that date into the modal
    this.isModalOpen = true; // Open the modal to allow updates
  }

  // Delete an availability entry
  deleteAvailability(index: number) {
    this.availability.splice(index, 1); // Remove the entry from the availability list
  }
}
