import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  get currentUser$() {
    return this.authService.currentUser$;
  }
}
