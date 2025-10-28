import { Component } from '@angular/core';
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
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleRegister(form: NgForm) {
    if (this.isLoading) return;
    this.passwordMismatch = this.formData.password !== this.formData.confirmPassword;
    if (form.invalid || this.passwordMismatch) {
      form.control.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.authService.register(
      this.formData.email,
      this.formData.password,
      this.formData.name
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.success = 'Registration successful! Redirecting to login...';
        console.log('Registration successful:', response);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}
