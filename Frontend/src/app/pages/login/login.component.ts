import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  handleLogin(form: NgForm) {
    if (this.isLoading) return;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to dashboard if desired
    }, 1500);
  }
}
