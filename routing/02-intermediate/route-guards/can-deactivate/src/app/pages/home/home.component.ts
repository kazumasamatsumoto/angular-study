import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>CanDeactivate ルートガード - 未保存データの保護</h2>

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        CanDeactivateガードを使用した、未保存の変更からユーザーを保護する実装例です。
        フォームの編集中にページを離れようとすると、確認ダイアログが表示されます。
      </div>

      <h3>主な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>&#64;1. 変更検知</h3>
          <p>フォームの変更をリアルタイムで検知</p>
          <a routerLink="/edit/1" class="btn btn-primary">記事編集を試す</a>
        </div>

        <div class="feature-card">
          <h3>&#64;2. 確認ダイアログ</h3>
          <p>未保存の変更がある場合に警告を表示</p>
          <a routerLink="/profile/edit" class="btn btn-primary">プロフィール編集を試す</a>
        </div>

        <div class="feature-card">
          <h3>&#64;3. データ保護</h3>
          <p>誤った操作によるデータ損失を防止</p>
          <button class="btn btn-primary">詳細</button>
        </div>
      </div>

      <h3>試してみよう</h3>
      <ol>
        <li><strong>記事編集</strong>または<strong>プロフィール編集</strong>ページに移動</li>
        <li>フォームのいずれかの項目を変更する</li>
        <li>保存せずに別のページに移動しようとする</li>
        <li>確認ダイアログが表示される</li>
        <li>「キャンセル」を選択すると、現在のページに留まる</li>
        <li>「離れる」を選択すると、変更を破棄してページ遷移する</li>
        <li>「保存」ボタンをクリックすると、変更が保存され、ガードが無効になる</li>
      </ol>

      <h3>実装のポイント</h3>
      <ul>
        <li><strong>インターフェース:</strong> コンポーネントがcanDeactivateメソッドを実装</li>
        <li><strong>状態管理:</strong> フォームの変更状態（pristine/dirty）を追跡</li>
        <li><strong>ユーザー体験:</strong> 変更が保存されたら自動的にガードを無効化</li>
        <li><strong>視覚的フィードバック:</strong> 未保存の変更があることを明示</li>
        <li><strong>柔軟性:</strong> コンポーネントごとに独自のロジックを実装可能</li>
      </ul>

      <h3>コード例</h3>
      <pre><code>// can-deactivate.guard.ts
export interface CanComponentDeactivate {{ '{' }}
  canDeactivate: () =&gt; boolean;
{{ '}' }}

export const canDeactivateGuard: CanDeactivateFn&lt;CanComponentDeactivate&gt; =
  (component) =&gt; {{ '{' }}
    if (component.canDeactivate) {{ '{' }}
      return component.canDeactivate();
    {{ '}' }}
    return true;
  {{ '}' }};

// article-edit.component.ts
export class ArticleEditComponent implements CanComponentDeactivate {{ '{' }}
  isDirty = signal(false);

  canDeactivate(): boolean {{ '{' }}
    if (this.isDirty()) {{ '{' }}
      return confirm('未保存の変更があります。本当に離れますか？');
    {{ '}' }}
    return true;
  {{ '}' }}
{{ '}' }}

// app.routes.ts
{{ '{' }}
  path: 'edit/:id',
  component: ArticleEditComponent,
  canDeactivate: [canDeactivateGuard]
{{ '}' }}
</code></pre>

      <h3>演習問題</h3>
      <ol>
        <li>カスタム確認ダイアログコンポーネントを作成してみよう</li>
        <li>変更内容のプレビュー機能を追加してみよう</li>
        <li>自動保存機能を実装してみよう（一定時間ごとに自動保存）</li>
        <li>複数のフォームフィールドの変更を個別に追跡してみよう</li>
        <li>変更のアンドゥ/リドゥ機能を追加してみよう</li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
