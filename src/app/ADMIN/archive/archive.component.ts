import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { FormsModule } from '@angular/forms';
import { ArchiveService } from './archive.service';

interface ArchiveItem {
  id: number;
  dateArchived: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  contact_number: string;
  home_address: string;
  remarks: string;
}

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminsidenavComponent,
    FormsModule
  ],
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  archiveItems: ArchiveItem[] = [];
  filteredItems: ArchiveItem[] = [];
  searchQuery: string = '';
  showDeleteModal: boolean = false;
  itemToDelete: ArchiveItem | null = null;

  constructor(private archiveService: ArchiveService) {
    this.archiveItems = this.archiveService.getArchivedUsers();
    this.filteredItems = [...this.archiveItems];
  }

  ngOnInit() {
    this.loadArchivedUsers();
  }

  loadArchivedUsers() {
    const archivedUsers: ArchiveItem[] = JSON.parse(localStorage.getItem('archivedUsers') || '[]');
    this.archiveItems = archivedUsers;
    this.filteredItems = [...this.archiveItems];
  }

  onSearch() {
    this.filteredItems = this.archiveItems.filter(item =>
      (item.firstname.toLowerCase() + ' ' + item.lastname.toLowerCase()).includes(this.searchQuery.toLowerCase())
    );
  }

  openDeleteModal(item: ArchiveItem) {
    console.log('Opening delete modal for:', item);
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      // Remove the item from the archiveItems list
      this.archiveItems = this.archiveItems.filter(item => item.id !== this.itemToDelete?.id);
      this.filteredItems = this.filteredItems.filter(item => item.id !== this.itemToDelete?.id);
      // Update local storage
      localStorage.setItem('archivedUsers', JSON.stringify(this.archiveItems));
      console.log('Deleted archived user:', this.itemToDelete);
      this.closeDeleteModal();
    }
  }
} 