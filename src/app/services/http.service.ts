import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000';

  private url(path: string): string {
    if (!path) return this.baseUrl;
    if (/^https?:\/\//i.test(path)) return path; // allow absolute URLs
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }

  get<T = any>(path: string, params?: any): Observable<T> {
    return this.http.get<T>(this.url(path), { params });
  }

  post<T = any>(path: string, body?: any): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  put<T = any>(path: string, body?: any): Observable<T> {
    return this.http.put<T>(this.url(path), body);
  }

  patch<T = any>(path: string, body?: any): Observable<T> {
    return this.http.patch<T>(this.url(path), body);
  }

  delete<T = any>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path));
  }
}
