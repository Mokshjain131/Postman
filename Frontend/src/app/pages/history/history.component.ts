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
  loading = false;

  constructor(private history: HistoryService) {}

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    try {
      this.entries = await this.history.list();
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      this.loading = false;
    }
  }

  async clear() {
    if (confirm('Are you sure you want to clear all history?')) {
      await this.history.clear();
      await this.refresh();
    }
  }

  async deleteEntry(id: number | undefined) {
    if (id && confirm('Delete this entry?')) {
      await this.history.deleteEntry(id);
      await this.refresh();
    }
  }
}
