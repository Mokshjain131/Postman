import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryEntry } from '../../features/history/history.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  private readonly history = inject(HistoryService);
  
  entries: HistoryEntry[] = [];
  isLoading = false;
  errorMessage = '';

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.entries = await this.history.list();
    } catch (error: any) {
      this.errorMessage = 'Failed to load history';
      console.error('Error loading history:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async clear() {
    if (!confirm('Are you sure you want to clear all history?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.history.clear();
      await this.refresh();
    } catch (error: any) {
      this.errorMessage = 'Failed to clear history';
      console.error('Error clearing history:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteEntry(id: number | undefined) {
    if (!id) return;
    
    try {
      await this.history.deleteEntry(id);
      await this.refresh();
    } catch (error: any) {
      this.errorMessage = 'Failed to delete entry';
      console.error('Error deleting entry:', error);
    }
  }

  statusClass(status: number): string {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-redirect';
    if (status >= 400 && status < 500) return 'status-client-error';
    if (status >= 500) return 'status-server-error';
    return '';
  }
}
