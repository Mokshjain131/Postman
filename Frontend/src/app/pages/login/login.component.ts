import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  async handleLogin(form: NgForm) {
    if (this.isLoading) return;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const response = await this.authService.login(this.email, this.password);
      
      if (response.success) {
        // Navigate to API tester
        this.router.navigate(['/tester']);
      } else {
        this.errorMessage = response.message || 'Login failed';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during login';
    } finally {
      this.isLoading = false;
    }
  }
}
