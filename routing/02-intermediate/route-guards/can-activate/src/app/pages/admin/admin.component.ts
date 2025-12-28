import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>管理画面</h2>

      <div class="alert alert-success">
        <strong>権限チェック成功!</strong><br>
        このページは<code>authGuard</code>と<code>adminGuard</code>の両方によって保護されています。
        管理者権限を持つユーザーのみがアクセスできます。
      </div>

      @if (authService.currentUser(); as user) {
        <div class="protected-content">
          <h3>管理者情報</h3>
          <ul>
            <li><strong>管理者名:</strong> {{ user.username }}</li>
            <li><strong>権限レベル:</strong> <span class="badge badge-admin">{{ user.role }}</span></li>
            <li><strong>管理者メール:</strong> {{ user.email }}</li>
          </ul>
        </div>
      }

      <h3>管理機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>ユーザー管理</h3>
          <p>全ユーザーの管理と権限設定</p>
          <button class="btn btn-primary">管理</button>
        </div>

        <div class="feature-card">
          <h3>システム設定</h3>
          <p>システム全体の設定変更</p>
          <button class="btn btn-primary">設定</button>
        </div>

        <div class="feature-card">
          <h3>ログ閲覧</h3>
          <p>システムログとアクセスログの確認</p>
          <button class="btn btn-primary">閲覧</button>
        </div>

        <div class="feature-card">
          <h3>統計情報</h3>
          <p>アクセス統計とレポート生成</p>
          <button class="btn btn-primary">表示</button>
        </div>
      </div>

      <h3>複数ガードの適用</h3>
      <div class="alert alert-info">
        このページには2つのガードが適用されています：
        <ol>
          <li><strong>authGuard:</strong> ユーザーがログインしているかチェック</li>
          <li><strong>adminGuard:</strong> ユーザーが管理者権限を持っているかチェック</li>
        </ol>
        ガードは配列の順番に実行され、すべてのガードを通過した場合のみページにアクセスできます。
      </div>

      <h3>adminGuardの実装</h3>
      <pre><code>export const adminGuard: CanActivateFn = (route, state) =&gt; {{ '{' }}
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {{ '{' }}
    return true;  // 管理者権限あり → アクセス許可
  {{ '}' }}

  // 管理者権限なし → ダッシュボードにリダイレクト
  alert('管理者権限が必要です');
  router.navigate(['/dashboard']);

  return false;
{{ '}' }};</code></pre>

      <h3>ルート設定</h3>
      <pre><code>{{ '{' }}
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, adminGuard]  // 複数ガードを適用
{{ '}' }}</code></pre>

      <h3>試してみよう</h3>
      <ol>
        <li>一度ログアウトして、<code>user</code>（一般ユーザー）でログインしてください</li>
        <li>管理画面にアクセスしようとすると、ダッシュボードにリダイレクトされます</li>
        <li><code>admin</code>でログインし直すと、管理画面にアクセスできます</li>
      </ol>
    </div>
  `
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
}
