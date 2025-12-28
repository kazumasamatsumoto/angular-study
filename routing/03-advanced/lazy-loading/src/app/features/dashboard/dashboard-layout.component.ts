import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="card">
      <div class="loading-indicator">
        ✅ ダッシュボードモジュールが遅延ロードされました！
      </div>

      <h2>ダッシュボード (遅延ロードされたモジュール)</h2>

      <div class="alert alert-success">
        <strong>遅延ローディング成功!</strong><br>
        このモジュールは、ダッシュボードにアクセスした時に初めてロードされました。
      </div>

      <div class="dashboard-layout">
        <aside class="sidebar">
          <h3>ダッシュボードメニュー</h3>
          <nav>
            <a routerLink="overview" routerLinkActive="active">概要</a>
            <a routerLink="stats" routerLinkActive="active">統計</a>
            <a routerLink="reports" routerLinkActive="active">レポート</a>
          </nav>
        </aside>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <div class="alert alert-info">
        <strong>遅延ローディングのベストプラクティス:</strong>
        <ul>
          <li>初期表示に必要ないページは遅延ロード</li>
          <li>管理者専用ページは遅延ロード</li>
          <li>頻繁にアクセスされないページは遅延ロード</li>
          <li>大きなライブラリを含むページは遅延ロード</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
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
export class DashboardLayoutComponent {}
