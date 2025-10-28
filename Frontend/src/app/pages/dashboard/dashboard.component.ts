import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiRequestComponent } from '../../features/api-tester/api-request/api-request.component';
import { ApiResponseComponent } from '../../features/api-tester/api-response/api-response.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ApiRequestComponent, ApiResponseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
