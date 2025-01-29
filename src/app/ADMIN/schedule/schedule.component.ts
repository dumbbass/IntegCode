import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';

@Component({
    selector: 'app-schedule',
    imports: [
        CommonModule,
        RouterModule,
        AdminsidenavComponent
    ],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  currentMonth: Date = new Date();
  selectedDates: Date[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth: Date[] = [];

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

  toggleDate(date: Date) {
    const index = this.selectedDates.findIndex((d) => isSameDay(d, date));
    if (index > -1) {
      this.selectedDates.splice(index, 1);
    } else {
      this.selectedDates.push(date);
    }
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.some((d) => isSameDay(d, date));
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
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
}
