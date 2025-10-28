import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export interface HistoryEntry {
  id?: number;
  ts: number; // timestamp
  method: string;
  url: string;
  status: number;
  durationMs: number;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3000/api/history';
  private cache: HistoryEntry[] = [];
  private cacheTime = 0;
  private readonly CACHE_DURATION = 5000; // 5 seconds

  async add(entry: HistoryEntry): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, history not saved');
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(this.apiUrl, {
          url: entry.url,
          method: entry.method,
          status: entry.status,
          durationMs: entry.durationMs,
          timestamp: entry.ts
        }, {
          headers: this.authService.getAuthHeaders()
        })
      );
      
      // Invalidate cache
      this.cacheTime = 0;
    } catch (error) {
      console.error('Failed to save history to backend:', error);
    }
  }

  async list(): Promise<HistoryEntry[]> {
    if (!this.authService.isLoggedIn()) {
      return [];
    }

    // Return cached data if fresh
    const now = Date.now();
    if (this.cache.length > 0 && (now - this.cacheTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<HistoryEntry[]>(this.apiUrl, {
          headers: this.authService.getAuthHeaders()
        })
      );
      
      this.cache = response;
      this.cacheTime = now;
      return response;
    } catch (error) {
      console.error('Failed to fetch history from backend:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.delete(this.apiUrl, {
          headers: this.authService.getAuthHeaders()
        })
      );
      
      this.cache = [];
      this.cacheTime = 0;
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  }

  async deleteEntry(id: number): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`, {
          headers: this.authService.getAuthHeaders()
        })
      );
      
      // Invalidate cache
      this.cacheTime = 0;
    } catch (error) {
      console.error('Failed to delete history entry:', error);
      throw error;
    }
  }

  async getAnalytics(startDate: number = 0): Promise<any> {
    if (!this.authService.isLoggedIn()) {
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.get(`${this.apiUrl}/analytics`, {
          params: { startDate: startDate.toString() },
          headers: this.authService.getAuthHeaders()
        })
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }
}
