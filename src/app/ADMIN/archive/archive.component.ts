import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminsidenavComponent } from '../adminsidenav/adminsidenav.component';
import { FormsModule } from '@angular/forms';

interface ArchiveItem {
  id: number;
  name: string;
  dateArchived: string;
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
export class ArchiveComponent {
  archiveItems: ArchiveItem[] = [
    { id: 1, name: 'Sample Item 1', dateArchived: '2023-10-01' },
    { id: 2, name: 'Sample Item 2', dateArchived: '2023-10-02' },
    // Add more items as needed
  ];

  filteredItems: ArchiveItem[] = [...this.archiveItems];
  searchQuery: string = '';

  onSearch() {
    this.filteredItems = this.archiveItems.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
} 