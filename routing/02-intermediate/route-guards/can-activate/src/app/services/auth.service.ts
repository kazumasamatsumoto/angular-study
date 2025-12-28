import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // デモ用のユーザーデータ
  private users: User[] = [
    { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com' },
    { id: 2, username: 'user', role: 'user', email: 'user@example.com' }
  ];

  constructor(private router: Router) {
    // ローカルストレージから復元
    this.loadUserFromStorage();
  }

  login(username: string, password: string): boolean {
    // デモ用の簡易認証（実際はバックエンドAPIを呼び出す）
    const user = this.users.find(u => u.username === username);

    if (user && password === 'password') {
      this.currentUser.set(user);
      this.saveUserToStorage(user);
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
      } catch (e) {
        console.error('Failed to parse user from storage', e);
      }
    }
  }
}
