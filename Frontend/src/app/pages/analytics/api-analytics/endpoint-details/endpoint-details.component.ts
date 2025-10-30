import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryEntry } from '../../../../features/history/history.service';

@Component({
  selector: 'app-endpoint-details',
  imports: [CommonModule],
  templateUrl: './endpoint-details.component.html',
  styleUrl: './endpoint-details.component.css'
})
export class EndpointDetailsComponent {
  @Input() selectedEndpoint: {
    endpoint: string;
    method: string;
    requests: HistoryEntry[];
    statusDistribution: { status: number; count: number; percentage: number }[];
    timeSeriesData: { timestamp: string; responseTime: number }[];
  } | null = null;
  
  @Output() close = new EventEmitter<void>();

  methodColor(method: string) {
    const map: Record<string,string> = { GET:'var(--method-get)', POST:'var(--method-post)', PUT:'var(--method-put)', PATCH:'var(--method-patch)', DELETE:'var(--method-delete)' };
    return map[method] || 'var(--muted)';
  }

  formatTime(ms: number){
    return ms >= 1000 ? `${(ms/1000).toFixed(1)}s` : `${ms}ms`;
  }

  getAvgResponseTime(): number {
    if (!this.selectedEndpoint) return 0;
    const times = this.selectedEndpoint.requests.map(r => r.durationMs);
    return times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  getSuccessRate(): number {
    if (!this.selectedEndpoint) return 0;
    const total = this.selectedEndpoint.requests.length;
    const successes = this.selectedEndpoint.requests.filter(r => r.status >= 200 && r.status < 300).length;
    return total ? (successes / total) * 100 : 0;
  }

  getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-redirect';
    if (status >= 400 && status < 500) return 'status-client-error';
    if (status >= 500) return 'status-server-error';
    return 'status-info';
  }

  getMaxResponseTime(): number {
    if (!this.selectedEndpoint) return 1;
    const times = this.selectedEndpoint.timeSeriesData.map(t => t.responseTime);
    return Math.max(...times, 1);
  }

  closeDetails() {
    this.close.emit();
  }
}
