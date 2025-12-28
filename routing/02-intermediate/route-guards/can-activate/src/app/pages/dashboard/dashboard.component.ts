import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>ダッシュボード</h2>

      <div class="alert alert-success">
        <strong>認証成功!</strong><br>
        このページは<code>authGuard</code>によって保護されています。
        ログインしているユーザーのみがアクセスできます。
      </div>

      @if (authService.currentUser(); as user) {
        <div class="protected-content">
          <h3>ユーザー情報</h3>
          <ul>
            <li><strong>ID:</strong> {{ user.id }}</li>
            <li><strong>ユーザー名:</strong> {{ user.username }}</li>
            <li><strong>メールアドレス:</strong> {{ user.email }}</li>
            <li><strong>権限:</strong>
              <span class="badge" [ngClass]="user.role === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ user.role }}
              </span>
            </li>
          </ul>
        </div>
      }

      <h3>利用可能な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>プロフィール編集</h3>
          <p>ユーザープロフィール情報を更新できます</p>
          <button class="btn btn-primary">編集</button>
        </div>

        <div class="feature-card">
          <h3>設定</h3>
          <p>アカウント設定を変更できます</p>
          <button class="btn btn-primary">設定</button>
        </div>

        @if (authService.isAdmin()) {
          <div class="feature-card">
            <h3>管理画面</h3>
            <p>管理者専用の機能にアクセスできます</p>
            <a routerLink="/admin" class="btn btn-primary">管理画面へ</a>
          </div>
        } @else {
          <div class="feature-card">
            <h3>管理画面</h3>
            <p>管理者権限が必要です</p>
            <button class="btn btn-secondary" disabled>アクセス不可</button>
          </div>
        }
      </div>

      <h3>authGuardの実装</h3>
      <pre><code>export const authGuard: CanActivateFn = (route, state) =&gt; {{ '{' }}
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {{ '{' }}
    return true;  // 認証済み → アクセス許可
  {{ '}' }}

  // 未認証 → ログインページにリダイレクト
  router.navigate(['/login'], {{ '{' }}
    queryParams: {{ '{' }} returnUrl: state.url {{ '}' }}
  {{ '}' }});

  return false;
{{ '}' }};</code></pre>

      <h3>ルート設定</h3>
      <pre><code>{{ '{' }}
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]  // ガードを適用
{{ '}' }}</code></pre>
    </div>
  `
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
}
