import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>ユーザー設定</h3>

      <div class="settings-section">
        <h4>アカウント設定</h4>
        <div class="setting-item">
          <label>表示名</label>
          <input type="text" value="田中太郎" disabled>
        </div>
        <div class="setting-item">
          <label>メールアドレス</label>
          <input type="email" value="tanaka&#64;example.com" disabled>
        </div>
        <div class="setting-item">
          <label>電話番号</label>
          <input type="tel" value="090-1234-5678" disabled>
        </div>
      </div>

      <div class="settings-section">
        <h4>プライバシー設定</h4>
        <div class="setting-item">
          <label>プロフィールを公開</label>
          <input type="checkbox" checked disabled>
        </div>
        <div class="setting-item">
          <label>メールアドレスを公開</label>
          <input type="checkbox" disabled>
        </div>
        <div class="setting-item">
          <label>アクティビティを表示</label>
          <input type="checkbox" checked disabled>
        </div>
      </div>

      <div class="settings-section">
        <h4>通知設定</h4>
        <div class="setting-item">
          <label>メール通知</label>
          <input type="checkbox" checked disabled>
        </div>
        <div class="setting-item">
          <label>プッシュ通知</label>
          <input type="checkbox" checked disabled>
        </div>
        <div class="setting-item">
          <label>週次レポート</label>
          <input type="checkbox" disabled>
        </div>
      </div>

      <button class="btn" disabled>設定を保存</button>
    </div>
  `,
  styles: [`
    .settings-section {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .settings-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1976d2;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    label {
      font-weight: 500;
      color: #333;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"] {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 250px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }
  `]
})
export class SettingsComponent {}
