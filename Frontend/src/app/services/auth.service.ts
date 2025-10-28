import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  register(email: string, password: string, name: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password, name });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }));
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        next: () => {
          this.clearSession();
        },
        error: () => {
          this.clearSession();
        }
      });
    } else {
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
  }

  private loadUser(): void {
    if (this.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        next: (response) => this.currentUserSubject.next(response.user),
        error: () => this.clearSession()
      });
    }
  }

  getUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
