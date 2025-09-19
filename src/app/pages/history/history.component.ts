import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryEntry } from '../../features/history/history.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  entries: HistoryEntry[] = [];

  constructor(private history: HistoryService) {
    this.refresh();
  }

  refresh() {
    this.entries = this.history.list();
  }

  clear() {
    this.history.clear();
    this.refresh();
  }
}
