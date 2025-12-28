import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>CanActivate ルートガード - 認証・認可</h2>

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        CanActivateガードを使用した認証と権限チェックの実装例です。
        ルートへのアクセス前にユーザーの認証状態や権限を確認できます。
      </div>

      <h3>主な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>&#64;1. 認証チェック</h3>
          <p>ログインしていないユーザーは保護されたページにアクセスできません</p>
          <a routerLink="/dashboard" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;2. 権限チェック</h3>
          <p>管理者のみが管理画面にアクセスできます</p>
          <a routerLink="/admin" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;3. リダイレクト</h3>
          <p>ログイン後、元のページに自動的に戻ります</p>
          <a routerLink="/login" class="btn btn-primary">ログインページ</a>
        </div>
      </div>

      <h3>デモ用アカウント</h3>
      <div class="alert alert-warning">
        <strong>テスト用ログイン情報:</strong><br>
        <ul>
          <li><strong>管理者:</strong> ユーザー名: <code>admin</code> / パスワード: <code>password</code></li>
          <li><strong>一般ユーザー:</strong> ユーザー名: <code>user</code> / パスワード: <code>password</code></li>
        </ul>
      </div>

      <h3>実装のポイント</h3>
      <ul>
        <li><strong>関数型ガード:</strong> CanActivateFnを使用した最新の実装方法</li>
        <li><strong>inject関数:</strong> 関数型ガードでのDI（依存性注入）</li>
        <li><strong>複数ガード:</strong> authGuardとadminGuardの組み合わせ</li>
        <li><strong>Signal:</strong> 認証状態の管理にSignalを活用</li>
        <li><strong>リダイレクト処理:</strong> ログイン後の元ページへの復帰</li>
      </ul>

      <h3>コード例</h3>
      <pre><code>// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) =&gt; {{ '{' }}
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {{ '{' }}
    return true;
  {{ '}' }}

  router.navigate(['/login'], {{ '{' }}
    queryParams: {{ '{' }} returnUrl: state.url {{ '}' }}
  {{ '}' }});

  return false;
{{ '}' }};

// app.routes.ts
{{ '{' }}
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
{{ '}' }}
</code></pre>

      <h3>演習問題</h3>
      <ol>
        <li>セッションタイムアウト機能を実装してみよう</li>
        <li>ロール（役割）ごとの権限チェック機能を追加してみよう</li>
        <li>複数の権限を持つユーザーの処理を実装してみよう</li>
        <li>トークンベースの認証（JWT）に変更してみよう</li>
        <li>パスワードのバリデーション機能を追加してみよう</li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
