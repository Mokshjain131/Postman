import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:3000/api';
  
  // Reactive signal for current user
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Load user from localStorage on init
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  async register(email: string, password: string, name: string): Promise<RegisterResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, {
          email,
          password,
          name
        })
      );
      return response;
    } catch (error: any) {
      throw new Error(error.error?.error || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
          email,
          password
        })
      );

      // Store token and user info
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      this.currentUser.set(response.user);
      this.isAuthenticated.set(true);

      return response;
    } catch (error: any) {
      throw new Error(error.error?.error || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/auth/logout`, {}, {
            headers: this.getAuthHeaders()
          })
        );
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    this.router.navigate(['/login']);
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ user: User }>(`${this.apiUrl}/auth/me`, {
          headers: this.getAuthHeaders()
        })
      );
      
      this.currentUser.set(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      return response.user;
    } catch (error: any) {
      this.logout();
      throw new Error(error.error?.error || 'Failed to get user');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/change-password`, {
          oldPassword,
          newPassword
        }, {
          headers: this.getAuthHeaders()
        })
      );
      
      // Logout after password change
      await this.logout();
    } catch (error: any) {
      throw new Error(error.error?.error || 'Failed to change password');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
