import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface HistoryEntry {
  id?: number;
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

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/history';

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  async add(entry: HistoryEntry): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(this.baseUrl, {
          url: entry.url,
          method: entry.method,
          statusCode: entry.status,
          durationMs: entry.durationMs,
          timestamp: entry.ts
        }, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Failed to save history:', error);
      // Fallback to localStorage if backend fails
      this.addToLocalStorage(entry);
    }
  }

  async list(): Promise<HistoryEntry[]> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(this.baseUrl, { headers: this.getHeaders() })
      );
      
      if (response.success && Array.isArray(response.history)) {
        return response.history.map((item: any) => ({
          id: item.id,
          ts: item.ts,
          method: item.method,
          url: item.url,
          status: item.status,
          durationMs: item.durationMs
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch history:', error);
      // Fallback to localStorage if backend fails
      return this.listFromLocalStorage();
    }
  }

  async clear(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(this.baseUrl, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
    // Also clear localStorage
    localStorage.removeItem('apiTester:history');
  }

  async deleteEntry(id: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Failed to delete history entry:', error);
    }
  }

  // Fallback methods for localStorage (when not logged in or backend fails)
  private addToLocalStorage(entry: HistoryEntry): void {
    const KEY = 'apiTester:history';
    const MAX = 50;
    const list = this.listFromLocalStorage();
    list.unshift(entry);
    if (list.length > MAX) list.length = MAX;
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  private listFromLocalStorage(): HistoryEntry[] {
    const KEY = 'apiTester:history';
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try { 
      return JSON.parse(raw) as HistoryEntry[]; 
    } catch { 
      return []; 
    }
  }
}
