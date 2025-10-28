import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:3000/api/history';
  private cacheSubject = new BehaviorSubject<HistoryEntry[]>([]);
  public cache$ = this.cacheSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load initial data
    this.loadHistory();
  }

  // Add to history (send to backend)
  add(entry: HistoryEntry): Observable<any> {
    const payload = {
      url: entry.url,
      method: entry.method,
      status: entry.status,
      durationMs: entry.durationMs,
      timestamp: entry.ts
    };

    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => {
        // Update local cache
        const current = this.cacheSubject.value;
        current.unshift(entry);
        this.cacheSubject.next(current);
      }),
      catchError(error => {
        console.error('Failed to save history:', error);
        throw error;
      })
    );
  }

  // Get history from backend
  list(): Observable<HistoryEntry[]> {
    return this.http.get<HistoryEntry[]>(this.apiUrl).pipe(
      tap(history => this.cacheSubject.next(history)),
      catchError(error => {
        console.error('Failed to load history:', error);
        this.cacheSubject.next([]);
        throw error;
      })
    );
  }

  // Load history (called on init)
  private loadHistory(): void {
    this.list().subscribe();
  }

  // Get cached data synchronously (for immediate display)
  getCached(): HistoryEntry[] {
    return this.cacheSubject.value;
  }

  // Clear history
  clear(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.cacheSubject.next([])),
      catchError(error => {
        console.error('Failed to clear history:', error);
        throw error;
      })
    );
  }

  // Delete specific entry
  deleteEntry(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.cacheSubject.value.filter(item => item.id !== id);
        this.cacheSubject.next(current);
      }),
      catchError(error => {
        console.error('Failed to delete entry:', error);
        throw error;
      })
    );
  }

  // Get filtered history
  getFiltered(filters: {
    startDate?: number;
    endDate?: number;
    method?: string;
    minStatus?: number;
    maxStatus?: number;
  }): Observable<HistoryEntry[]> {
    return this.http.get<HistoryEntry[]>(`${this.apiUrl}/filter`, { params: filters as any });
  }

  // Get analytics
  getAnalytics(startDate?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (startDate) {
      params['startDate'] = startDate.toString();
    }
    return this.http.get(`${this.apiUrl}/analytics`, { params });
  }
}

