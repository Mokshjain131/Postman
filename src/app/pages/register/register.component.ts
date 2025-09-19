import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  passwordMismatch = false;

  handleRegister(form: NgForm) {
    if (this.isLoading) return;
    this.passwordMismatch = this.formData.password !== this.formData.confirmPassword;
    if (form.invalid || this.passwordMismatch) {
      form.control.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
