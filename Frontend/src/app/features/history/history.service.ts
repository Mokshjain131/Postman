import { Injectable } from '@angular/core';

export interface HistoryEntry {
  ts: number; // timestamp
  method: string;
  url: string;
  status: number;
  durationMs: number;
  request?: {
    headers?: Record<string, string>;
    body?: any;
  };
}

const KEY = 'apiTester:history';
const MAX = 50;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  add(entry: HistoryEntry) {
    const list = this.list();
    list.unshift(entry);
    if (list.length > MAX) list.length = MAX;
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  list(): HistoryEntry[] {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as HistoryEntry[]; } catch { return []; }
  }

  clear() {
    localStorage.removeItem(KEY);
  }
}
