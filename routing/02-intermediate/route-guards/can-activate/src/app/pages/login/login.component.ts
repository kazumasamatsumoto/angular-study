import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>ログイン</h2>

      <div class="alert alert-info">
        <strong>デモ用アカウント:</strong><br>
        管理者: <code>admin</code> / <code>password</code><br>
        一般ユーザー: <code>user</code> / <code>password</code>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-danger">
          {{ errorMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="username"
            required
            placeholder="admin または user"
          >
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            required
            placeholder="password"
          >
        </div>

        <button type="submit" class="btn btn-primary">
          ログイン
        </button>
      </form>

      <h3 style="margin-top: 2rem;">ガードの動作を確認する方法</h3>
      <ol>
        <li>ログインせずに<strong>ダッシュボード</strong>にアクセスしてみてください → ログインページにリダイレクトされます</li>
        <li><code>user</code>でログインして<strong>管理画面</strong>にアクセスしてみてください → ダッシュボードにリダイレクトされます</li>
        <li><code>admin</code>でログインして<strong>管理画面</strong>にアクセスしてみてください → アクセスできます</li>
        <li>ログインせずにダッシュボードのURLにアクセスした後、ログインすると元のページに戻ります</li>
      </ol>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.authService.login(this.username, this.password)) {
      // ログイン成功
      // returnUrlがあればそのページに、なければダッシュボードに遷移
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      // ログイン失敗
      this.errorMessage.set('ユーザー名またはパスワードが正しくありません');
    }
  }
}
