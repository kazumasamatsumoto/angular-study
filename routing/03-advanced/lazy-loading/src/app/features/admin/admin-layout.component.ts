import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="card">
      <div class="loading-indicator">
        ✅ 管理画面モジュールが遅延ロードされました！
      </div>

      <h2>管理画面 (遅延ロードされたモジュール)</h2>

      <div class="alert alert-success">
        <strong>遅延ローディング成功!</strong><br>
        このモジュールは、ユーザーが管理画面にアクセスした時に初めてロードされました。
        ブラウザの開発者ツール（Networkタブ）で新しいJavaScriptファイルがロードされたことを確認できます。
      </div>

      <div class="admin-layout">
        <aside class="sidebar">
          <h3>管理メニュー</h3>
          <nav>
            <a routerLink="dashboard" routerLinkActive="active">ダッシュボード</a>
            <a routerLink="users" routerLinkActive="active">ユーザー管理</a>
            <a routerLink="settings" routerLinkActive="active">設定</a>
          </nav>
        </aside>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <div class="alert alert-info">
        <strong>このモジュールの特徴:</strong>
        <ul>
          <li>独立したルート設定ファイル（admin.routes.ts）</li>
          <li>専用のレイアウトコンポーネント</li>
          <li>子ルートによるページ構成</li>
          <li>初回アクセス時のみロード（2回目以降はキャッシュ）</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
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
export class AdminLayoutComponent {}
