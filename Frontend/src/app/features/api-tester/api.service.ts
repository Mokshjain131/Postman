import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { HistoryService } from '../history/history.service';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequestDto {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiResponseDto {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly historyService = inject(HistoryService);

  async send(request: ApiRequestDto): Promise<ApiResponseDto> {
    const start = performance.now();
    const headers = new HttpHeaders(request.headers || {});
    try {
      const resp = await firstValueFrom(
        this.http.request(request.method, request.url, {
          body: request.body,
          headers,
          observe: 'response',
          responseType: 'text',
        })
      );

      const durationMs = Math.round(performance.now() - start);
      const h: Record<string, string> = {};
      resp.headers.keys().forEach((k) => (h[k] = resp.headers.get(k) || ''));

      let parsed: any = resp.body;
      try {
        parsed = resp.body ? JSON.parse(resp.body as string) : null;
      } catch {
        // keep as text
      }

      const response: ApiResponseDto = {
        ok: resp.ok,
        status: resp.status,
        statusText: resp.statusText,
        headers: h,
        body: parsed,
        durationMs,
      };

      // Save to history (async, don't wait)
      this.historyService.add({
        ts: Date.now(),
        method: request.method,
        url: request.url,
        status: resp.status,
        durationMs
      }).catch(err => console.error('Failed to save to history:', err));

      return response;
    } catch (error: any) {
      const durationMs = Math.round(performance.now() - start);
      const status = error.status ?? 0;
      const statusText = error.statusText ?? 'Network error';
      const headersObj: Record<string, string> = {};
      if (error.headers && typeof error.headers.keys === 'function') {
        error.headers.keys().forEach((k: string) => (headersObj[k] = error.headers.get(k) || ''));
      }
      let body = error.error;
      try {
        body = typeof body === 'string' ? JSON.parse(body) : body;
      } catch {}

      const response: ApiResponseDto = { 
        ok: false, 
        status, 
        statusText, 
        headers: headersObj, 
        body, 
        durationMs 
      };

      // Save error to history too (async, don't wait)
      this.historyService.add({
        ts: Date.now(),
        method: request.method,
        url: request.url,
        status,
        durationMs
      }).catch(err => console.error('Failed to save to history:', err));

      return response;
    }
  }
}
