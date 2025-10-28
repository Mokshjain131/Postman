import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleLogin(form: NgForm) {
    if (this.isLoading) return;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }
}
