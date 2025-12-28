import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <h2>ダッシュボード</h2>
        <nav>
          <a routerLink="profile" routerLinkActive="active" class="nav-item">
            <span class="icon">👤</span>
            <span class="label">プロフィール</span>
          </a>
          <a routerLink="settings" routerLinkActive="active" class="nav-item">
            <span class="icon">⚙️</span>
            <span class="label">設定</span>
          </a>
          <a routerLink="stats" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span>
            <span class="label">統計</span>
          </a>
        </nav>

        <div class="info-box">
          <h4>ポイント</h4>
          <p>
            これらのリンクは<strong>相対パス</strong>を使用しています。
            現在のルート (<code>/dashboard</code>) からの相対パスとして解決されます。
          </p>
          <pre><code>&lt;a routerLink="profile"&gt;</code></pre>
          <p>
            絶対パスを使う場合:
          </p>
          <pre><code>&lt;a routerLink="/dashboard/profile"&gt;</code></pre>
        </div>
      </aside>

      <main class="content">
        <!-- 子ルートがここに表示される -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      min-height: calc(100vh - 100px);
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%);
      padding: 1.5rem;
      border-right: 1px solid #ddd;
    }

    .sidebar h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      text-decoration: none;
      color: #333;
      border-radius: 6px;
      transition: all 0.3s;
      background-color: white;
      border: 1px solid #e0e0e0;
    }

    .nav-item:hover {
      background-color: #f5f5f5;
      border-color: #1976d2;
      transform: translateX(4px);
    }

    .nav-item.active {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
      font-weight: 500;
    }

    .icon {
      font-size: 1.25rem;
    }

    .label {
      font-size: 0.95rem;
    }

    .info-box {
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
      padding: 1rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .info-box h4 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
      font-size: 0.9rem;
    }

    .info-box p {
      margin-bottom: 0.5rem;
      color: #333;
      line-height: 1.5;
    }

    .info-box pre {
      background-color: #263238;
      color: #aed581;
      padding: 0.5rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }

    .info-box code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.8rem;
    }

    .content {
      flex: 1;
      padding: 2rem;
      background-color: white;
    }

    @media (max-width: 768px) {
      .dashboard {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .info-box {
        display: none;
      }
    }
  `]
})
export class DashboardComponent {}
