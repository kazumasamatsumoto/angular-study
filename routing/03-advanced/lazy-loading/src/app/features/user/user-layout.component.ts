import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="card">
      <div class="loading-indicator">
        ✅ ユーザーモジュールが遅延ロードされました！
      </div>

      <h2>ユーザーページ (遅延ロードされたモジュール)</h2>

      <div class="alert alert-success">
        <strong>遅延ローディング成功!</strong><br>
        このモジュールは、ユーザーページにアクセスした時に初めてロードされました。
      </div>

      <div class="user-layout">
        <aside class="sidebar">
          <h3>ユーザーメニュー</h3>
          <nav>
            <a routerLink="profile" routerLinkActive="active">プロフィール</a>
            <a routerLink="settings" routerLinkActive="active">設定</a>
          </nav>
        </aside>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <div class="alert alert-info">
        <strong>遅延ローディングの利点:</strong>
        <ul>
          <li>初期ロード時間の短縮</li>
          <li>必要な機能だけをロード</li>
          <li>帯域幅の節約</li>
          <li>ユーザー体験の向上</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .user-layout {
      display: flex;
      gap: 2rem;
      margin: 2rem 0;
    }

    .sidebar {
      width: 200px;
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .sidebar h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1976d2;
      font-size: 1.1rem;
    }

    .sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sidebar a {
      text-decoration: none;
      color: #333;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .sidebar a:hover {
      background-color: #e0e0e0;
    }

    .sidebar a.active {
      background-color: #1976d2;
      color: white;
    }

    .content {
      flex: 1;
    }

    ul {
      margin-left: 1.5rem;
      margin-bottom: 0;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class UserLayoutComponent {}
