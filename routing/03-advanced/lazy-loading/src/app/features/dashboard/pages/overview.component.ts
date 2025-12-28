import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>概要</h3>

      <p>ダッシュボードの概要ページです。</p>

      <div class="grid">
        <div class="metric-card">
          <h4>今日の訪問者</h4>
          <div class="metric-value">2,847</div>
          <div class="metric-change positive">+12.5%</div>
        </div>

        <div class="metric-card">
          <h4>ページビュー</h4>
          <div class="metric-value">12,459</div>
          <div class="metric-change positive">+8.3%</div>
        </div>

        <div class="metric-card">
          <h4>直帰率</h4>
          <div class="metric-value">42.3%</div>
          <div class="metric-change negative">+2.1%</div>
        </div>

        <div class="metric-card">
          <h4>平均セッション時間</h4>
          <div class="metric-value">3:24</div>
          <div class="metric-change positive">+15.2%</div>
        </div>
      </div>

      <h4>最近のアクティビティ</h4>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon">👤</div>
          <div class="activity-content">
            <div class="activity-title">新規ユーザー登録</div>
            <div class="activity-time">5分前</div>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon">📊</div>
          <div class="activity-content">
            <div class="activity-title">レポートが生成されました</div>
            <div class="activity-time">15分前</div>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon">⚙️</div>
          <div class="activity-content">
            <div class="activity-title">システム設定が更新されました</div>
            <div class="activity-time">1時間前</div>
          </div>
        </div>

        <div class="activity-item">
          <div class="activity-icon">🔔</div>
          <div class="activity-content">
            <div class="activity-title">新しい通知があります</div>
            <div class="activity-time">2時間前</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .metric-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .metric-card h4 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: normal;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0.5rem 0;
    }

    .metric-change {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .metric-change.positive {
      color: #2e7d32;
    }

    .metric-change.negative {
      color: #d32f2f;
    }

    .activity-list {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .activity-item:last-child {
      margin-bottom: 0;
    }

    .activity-icon {
      font-size: 1.5rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 500;
      color: #333;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #999;
      margin-top: 0.25rem;
    }
  `]
})
export class OverviewComponent {}
