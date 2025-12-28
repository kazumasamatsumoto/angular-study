import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>設定</h2>

      <div class="alert alert-success">
        <strong>このページは保護されていません</strong><br>
        このページにはCanDeactivateガードが適用されていないため、
        自由にページ遷移できます。
      </div>

      <h3>ガードの有無による違い</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>保護されているページ</h3>
          <ul>
            <li>記事編集ページ</li>
            <li>プロフィール編集ページ</li>
          </ul>
          <p>
            これらのページは<code>canDeactivate: [canDeactivateGuard]</code>が
            設定されており、未保存の変更がある場合に警告が表示されます。
          </p>
        </div>

        <div class="feature-card">
          <h3>保護されていないページ</h3>
          <ul>
            <li>ホームページ</li>
            <li>設定ページ（このページ）</li>
          </ul>
          <p>
            これらのページはガードが設定されていないため、
            いつでも自由にページ遷移できます。
          </p>
        </div>
      </div>

      <h3>ガードを選択的に適用する理由</h3>
      <ol>
        <li><strong>パフォーマンス:</strong> すべてのページにガードを適用する必要はない</li>
        <li><strong>ユーザー体験:</strong> 不要な確認ダイアログは避ける</li>
        <li><strong>用途に応じた設計:</strong> データ編集ページにのみ適用するのが一般的</li>
      </ol>

      <h3>試してみよう</h3>
      <p>
        このページから<a routerLink="/">ホーム</a>や他のページに移動しても、
        確認ダイアログは表示されません。
      </p>
      <p>
        一方、<a routerLink="/edit/1">記事編集ページ</a>で変更を加えた後に
        別のページに移動しようとすると、確認ダイアログが表示されます。
      </p>
    </div>
  `
})
export class SettingsComponent {}
