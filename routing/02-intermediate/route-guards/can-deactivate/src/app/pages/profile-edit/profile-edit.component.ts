import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';

interface Profile {
  name: string;
  email: string;
  bio: string;
  website: string;
  location: string;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>プロフィール編集</h2>

      @if (isDirty()) {
        <div class="unsaved-indicator">
          未保存の変更があります
        </div>
      }

      <div class="status-badge" [ngClass]="isDirty() ? 'status-dirty' : 'status-pristine'">
        状態: {{ isDirty() ? '変更あり' : '変更なし' }}
      </div>

      <div class="alert alert-warning">
        <strong>注意:</strong> このフォームもCanDeactivateガードで保護されています。
        変更を保存せずにページを離れようとすると、確認を求められます。
      </div>

      <form>
        <div class="form-group">
          <label for="name">名前 *</label>
          <input
            type="text"
            id="name"
            [(ngModel)]="profile.name"
            name="name"
            (input)="markAsDirty()"
            placeholder="山田 太郎"
          >
        </div>

        <div class="form-group">
          <label for="email">メールアドレス *</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="profile.email"
            name="email"
            (input)="markAsDirty()"
            placeholder="example@example.com"
          >
        </div>

        <div class="form-group">
          <label for="bio">自己紹介</label>
          <textarea
            id="bio"
            [(ngModel)]="profile.bio"
            name="bio"
            (input)="markAsDirty()"
            placeholder="自己紹介を入力してください"
            rows="5"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="website">ウェブサイト</label>
          <input
            type="url"
            id="website"
            [(ngModel)]="profile.website"
            name="website"
            (input)="markAsDirty()"
            placeholder="https://example.com"
          >
        </div>

        <div class="form-group">
          <label for="location">場所</label>
          <input
            type="text"
            id="location"
            [(ngModel)]="profile.location"
            name="location"
            (input)="markAsDirty()"
            placeholder="東京, 日本"
          >
        </div>

        <div>
          <button
            type="button"
            class="btn btn-success"
            (click)="save()"
            [disabled]="!isDirty()"
          >
            プロフィールを保存
          </button>
          <button
            type="button"
            class="btn btn-danger"
            (click)="reset()"
            [disabled]="!isDirty()"
          >
            変更を破棄
          </button>
        </div>
      </form>

      <h3 style="margin-top: 2rem;">カスタム確認ダイアログの実装例</h3>
      <pre><code>canDeactivate(): boolean {{ '{' }}
  if (this.isDirty()) {{ '{' }}
    // より詳細な確認メッセージ
    const message =
      'プロフィールに未保存の変更があります。\\n\\n' +
      '変更内容:\\n' +
      this.getChangeSummary() + '\\n\\n' +
      '本当にページを離れますか？';

    return confirm(message);
  {{ '}' }}
  return true;
{{ '}' }}

// 変更内容のサマリーを生成
private getChangeSummary(): string {{ '{' }}
  const changes = [];
  if (this.profile.name !== this.originalProfile.name) {{ '{' }}
    changes.push('- 名前');
  {{ '}' }}
  if (this.profile.email !== this.originalProfile.email) {{ '{' }}
    changes.push('- メールアドレス');
  {{ '}' }}
  // ... 他のフィールド
  return changes.join('\\n');
{{ '}' }}</code></pre>

      <h3>より高度な実装</h3>
      <div class="alert alert-info">
        <strong>実務では以下のような実装も検討できます:</strong>
        <ul>
          <li>カスタムモーダルダイアログの使用（browser confirmの代わり）</li>
          <li>変更内容のプレビュー表示</li>
          <li>一時保存（ドラフト）機能</li>
          <li>自動保存タイマー</li>
          <li>変更履歴の記録</li>
        </ul>
      </div>
    </div>
  `
})
export class ProfileEditComponent implements OnInit, CanComponentDeactivate {
  isDirty = signal(false);

  originalProfile: Profile = {
    name: '',
    email: '',
    bio: '',
    website: '',
    location: ''
  };

  profile: Profile = {
    name: '',
    email: '',
    bio: '',
    website: '',
    location: ''
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // デモ用の初期データ
    this.originalProfile = {
      name: '山田 太郎',
      email: 'yamada@example.com',
      bio: 'Web開発者です。Angularが大好きです。',
      website: 'https://example.com',
      location: '東京, 日本'
    };

    this.profile = { ...this.originalProfile };
  }

  markAsDirty(): void {
    this.isDirty.set(true);
  }

  save(): void {
    console.log('プロフィールを保存しました:', this.profile);
    this.originalProfile = { ...this.profile };
    this.isDirty.set(false);
    alert('プロフィールを保存しました！');
  }

  reset(): void {
    if (confirm('変更を破棄して元に戻しますか？')) {
      this.profile = { ...this.originalProfile };
      this.isDirty.set(false);
    }
  }

  canDeactivate(): boolean {
    if (this.isDirty()) {
      return confirm(
        'プロフィールに未保存の変更があります。\n' +
        '本当にページを離れますか？\n\n' +
        '保存せずに離れると、変更内容は失われます。'
      );
    }
    return true;
  }
}
