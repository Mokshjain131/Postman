import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryEntry } from '../../features/history/history.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  entries: HistoryEntry[] = [];
  isLoading = false;
  error = '';

  constructor(private history: HistoryService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this.error = '';
    
    this.history.list().subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load history';
        this.isLoading = false;
        console.error('Failed to load history:', err);
      }
    });
  }

  clear() {
    if (!confirm('Are you sure you want to clear all history?')) return;
    
    this.isLoading = true;
    this.history.clear().subscribe({
      next: () => {
        this.entries = [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to clear history';
        this.isLoading = false;
        console.error('Failed to clear history:', err);
      }
    });
  }

  deleteEntry(id: number) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    this.history.deleteEntry(id).subscribe({
      next: () => {
        this.entries = this.entries.filter(e => e.id !== id);
      },
      error: (err) => {
        this.error = 'Failed to delete entry';
        console.error('Failed to delete entry:', err);
      }
    });
  }
}
