import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  handleRegister(event: Event) {
    event.preventDefault();
    if (this.isLoading) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to dashboard if desired
    }, 1500);
  }
}
