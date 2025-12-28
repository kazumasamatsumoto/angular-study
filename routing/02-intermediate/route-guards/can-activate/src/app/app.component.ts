import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <header class="header">
        <h1>CanActivate Guard - 認証・認可のデモ</h1>
        <p>ルートガードを使った認証と権限チェックの実装例</p>

        @if (authService.currentUser()) {
          <div class="user-info">
            <div class="user-avatar">
              {{ authService.currentUser()!.username.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <strong>{{ authService.currentUser()!.username }}</strong>
              <small>
                <span class="badge" [ngClass]="authService.isAdmin() ? 'badge-admin' : 'badge-user'">
                  {{ authService.currentUser()!.role }}
                </span>
              </small>
            </div>
            <button class="btn btn-danger" (click)="authService.logout()">
              ログアウト
            </button>
          </div>
        }

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            ホーム
          </a>
          <a routerLink="/login" routerLinkActive="active">
            ログイン
          </a>
          <a routerLink="/dashboard" routerLinkActive="active">
            ダッシュボード
          </a>
          <a routerLink="/admin" routerLinkActive="active">
            管理画面
          </a>
        </nav>
      </header>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
