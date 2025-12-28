import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Setting {
  id: string;
  label: string;
  description: string;
  value: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings">
      <h2>設定</h2>

      <div class="settings-section">
        <h3>通知設定</h3>
        <div class="setting-list">
          @for (setting of settings; track setting.id) {
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">{{ setting.label }}</div>
                <div class="setting-description">{{ setting.description }}</div>
              </div>
              <label class="toggle">
                <input
                  type="checkbox"
                  [checked]="setting.value"
                  (change)="toggleSetting(setting.id)"
                >
                <span class="slider"></span>
              </label>
            </div>
          }
        </div>
      </div>

      <div class="info-section">
        <h3>Angular 18の新機能</h3>
        <p>
          このページでは Angular 18 の新しいテンプレート構文 <code>&#64;for</code> を使用しています。
        </p>
        <div class="code-example">
          <h4>従来の *ngFor</h4>
          <pre><code>&lt;div *ngFor="let item of items"&gt;
  [item content]
&lt;/div&gt;</code></pre>

          <h4>新しい &#64;for</h4>
          <pre><code>&#64;for (item of items; track item.id) &#123;
  &lt;div&gt;[item content]&lt;/div&gt;
&#125;</code></pre>
        </div>

        <p>
          <strong>利点:</strong>
        </p>
        <ul>
          <li>より読みやすい構文</li>
          <li><code>track</code> が必須になり、パフォーマンス最適化が強制される</li>
          <li>テンプレートとロジックの分離が明確に</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .settings {
      max-width: 800px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
    }

    .settings-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .settings-section h3 {
      color: #333;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    .setting-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: white;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }

    .setting-info {
      flex: 1;
    }

    .setting-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .setting-description {
      font-size: 0.875rem;
      color: #666;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
      margin-left: 1rem;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #1976d2;
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }

    .info-section {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 1.5rem;
      border-radius: 4px;
    }

    .info-section h3 {
      color: #f57c00;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .info-section p {
      color: #333;
      margin-bottom: 0.75rem;
    }

    .code-example {
      margin: 1.5rem 0;
    }

    .code-example h4 {
      color: #f57c00;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5rem 0 1rem 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    ul li {
      color: #333;
      margin-bottom: 0.5rem;
    }
  `]
})
export class SettingsComponent {
  settings: Setting[] = [
    {
      id: 'email',
      label: 'メール通知',
      description: '新しいメッセージをメールで受け取る',
      value: true
    },
    {
      id: 'push',
      label: 'プッシュ通知',
      description: 'ブラウザのプッシュ通知を受け取る',
      value: false
    },
    {
      id: 'newsletter',
      label: 'ニュースレター',
      description: '週刊ニュースレターを受け取る',
      value: true
    },
    {
      id: 'updates',
      label: 'アップデート通知',
      description: '新機能のお知らせを受け取る',
      value: true
    }
  ];

  toggleSetting(id: string): void {
    const setting = this.settings.find(s => s.id === id);
    if (setting) {
      setting.value = !setting.value;
      console.log(`Setting ${id} toggled to ${setting.value}`);
    }
  }
}
