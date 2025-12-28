import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>システム設定</h3>

      <p>管理者向けのシステム設定ページです。</p>

      <div class="settings-section">
        <h4>一般設定</h4>
        <div class="setting-item">
          <label>サイト名</label>
          <input type="text" value="Angular Routing Demo" disabled>
        </div>
        <div class="setting-item">
          <label>メンテナンスモード</label>
          <input type="checkbox" disabled>
        </div>
      </div>

      <div class="settings-section">
        <h4>セキュリティ設定</h4>
        <div class="setting-item">
          <label>2段階認証を必須にする</label>
          <input type="checkbox" checked disabled>
        </div>
        <div class="setting-item">
          <label>セッションタイムアウト（分）</label>
          <input type="number" value="30" disabled>
        </div>
      </div>

      <div class="settings-section">
        <h4>通知設定</h4>
        <div class="setting-item">
          <label>新規ユーザー登録時に通知</label>
          <input type="checkbox" checked disabled>
        </div>
        <div class="setting-item">
          <label>エラー発生時に通知</label>
          <input type="checkbox" checked disabled>
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
    input[type="number"] {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 200px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }
  `]
})
export class SettingsComponent {}
