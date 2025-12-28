import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>プロフィール</h3>

      <div class="profile-section">
        <h4>ユーザー情報</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">ユーザー名</span>
            <span class="value">田中太郎</span>
          </div>
          <div class="info-item">
            <span class="label">メールアドレス</span>
            <span class="value">tanaka&#64;example.com</span>
          </div>
          <div class="info-item">
            <span class="label">登録日</span>
            <span class="value">2024年1月15日</span>
          </div>
          <div class="info-item">
            <span class="label">最終ログイン</span>
            <span class="value">2024年3月20日 14:30</span>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h4>アカウント統計</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">127</div>
            <div class="stat-label">投稿数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1,234</div>
            <div class="stat-label">フォロワー</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">567</div>
            <div class="stat-label">フォロー中</div>
          </div>
        </div>
      </div>

      <button class="btn">プロフィールを編集</button>
    </div>
  `,
  styles: [`
    .profile-section {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .profile-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1976d2;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: white;
      border-radius: 4px;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    .value {
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1.5rem;
      background: white;
      border-radius: 4px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class ProfileComponent {}
