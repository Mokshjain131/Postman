import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  isLoading = false;
  passwordMismatch = false;
  errorMessage = '';
  successMessage = '';

  async handleRegister(form: NgForm) {
    if (this.isLoading) return;
    
    this.passwordMismatch = this.formData.password !== this.formData.confirmPassword;
    if (form.invalid || this.passwordMismatch) {
      form.control.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.register(
        this.formData.email,
        this.formData.password,
        this.formData.name
      );
      
      this.successMessage = 'Registration successful! Redirecting to login...';
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
