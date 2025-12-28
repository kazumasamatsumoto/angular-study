import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>管理ダッシュボード</h3>

      <p>管理者向けのダッシュボードページです。</p>

      <div class="grid">
        <div class="stat-card">
          <h4>総ユーザー数</h4>
          <div class="stat-value">1,234</div>
        </div>

        <div class="stat-card">
          <h4>アクティブユーザー</h4>
          <div class="stat-value">856</div>
        </div>

        <div class="stat-card">
          <h4>今月の新規登録</h4>
          <div class="stat-value">127</div>
        </div>

        <div class="stat-card">
          <h4>システム状態</h4>
          <div class="stat-value">
            <span class="badge badge-success">正常</span>
          </div>
        </div>
      </div>

      <h4>最近のアクティビティ</h4>
      <ul>
        <li>ユーザー「田中太郎」が登録しました - 2分前</li>
        <li>システム設定が更新されました - 15分前</li>
        <li>バックアップが完了しました - 1時間前</li>
        <li>ユーザー「佐藤花子」がログインしました - 2時間前</li>
      </ul>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .stat-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-card h4 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: normal;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    ul {
      background: #f9f9f9;
      padding: 1rem 1rem 1rem 2.5rem;
      border-radius: 4px;
    }

    li {
      margin-bottom: 0.5rem;
      color: #666;
    }
  `]
})
export class AdminDashboardComponent {}
