import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>遅延ローディング（Lazy Loading）</h2>

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        Angularの遅延ローディング機能を使用して、アプリケーションの初期ロード時間を短縮する方法を学びます。
        必要な機能だけを最初にロードし、他の機能は実際にアクセスした時にロードされます。
      </div>

      <h3>遅延ローディングとは？</h3>
      <p>
        遅延ローディング（Lazy Loading）は、アプリケーションの一部を必要になるまでロードしない手法です。
        これにより初期バンドルサイズを削減し、アプリケーションの起動時間を短縮できます。
      </p>

      <div class="bundle-info">
        <h4>バンドルサイズの比較</h4>
        <p><strong>遅延ローディングなし:</strong> 全機能を含む大きな1つのバンドル（例: 500 kB）</p>
        <p><strong>遅延ローディングあり:</strong> 小さな初期バンドル（例: 150 kB）+ 各機能モジュール（50-100 kB）</p>
      </div>

      <h3>デモ機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>管理画面モジュール</h3>
          <p>管理者向けの機能を含むモジュール。このリンクをクリックすると遅延ロードされます。</p>
          <div class="badge badge-warning">遅延ロード</div>
          <br><br>
          <a routerLink="/admin" class="btn">管理画面へ</a>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            💡 ブラウザの開発者ツール（Networkタブ）を開いてクリックすると、
            新しいJavaScriptファイルがロードされるのを確認できます。
          </p>
        </div>

        <div class="feature-card">
          <h3>ユーザーモジュール</h3>
          <p>ユーザー管理機能を含むモジュール。必要な時だけロードされます。</p>
          <div class="badge badge-warning">遅延ロード</div>
          <br><br>
          <a routerLink="/user" class="btn">ユーザーページへ</a>
        </div>

        <div class="feature-card">
          <h3>ダッシュボードモジュール</h3>
          <p>ダッシュボード機能を含むモジュール。統計情報などを表示します。</p>
          <div class="badge badge-warning">遅延ロード</div>
          <br><br>
          <a routerLink="/dashboard" class="btn">ダッシュボードへ</a>
        </div>
      </div>

      <h3>実装のポイント</h3>
      <ul>
        <li><strong>loadChildren:</strong> 動的インポートによるモジュールの遅延ロード</li>
        <li><strong>コード分割:</strong> ビルド時に自動的にチャンクに分割される</li>
        <li><strong>初期バンドルの最適化:</strong> 必要最小限のコードのみを最初にロード</li>
        <li><strong>オンデマンドロード:</strong> ユーザーがアクセスした時にのみロード</li>
      </ul>

      <h3>遅延ローディングのルート設定</h3>
      <pre><code>export const routes: Routes = [
  {{ '{' }} path: 'home', component: HomeComponent {{ '}' }},  // 即座にロード

  // 遅延ローディング
  {{ '{' }}
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  {{ '}' }},

  {{ '{' }}
    path: 'user',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  {{ '}' }}
];</code></pre>

      <h3>確認方法</h3>
      <ol>
        <li>ブラウザの開発者ツールを開く（F12キー）</li>
        <li>「Network」タブを選択</li>
        <li>ページをリロード → 初期ロードされるファイルを確認</li>
        <li>管理画面などのリンクをクリック → 新しいチャンクファイルがロードされるのを確認</li>
      </ol>

      <div class="alert alert-success">
        <strong>パフォーマンスのヒント:</strong><br>
        遅延ローディングは大規模アプリケーションで特に効果的です。
        ユーザーが頻繁にアクセスしないページや、管理者専用の機能などは
        遅延ローディングの対象として最適です。
      </div>

      <h3>遅延ロードされたモジュールのルート例</h3>
      <pre><code>// features/admin/admin.routes.ts
import {{ '{' }} Routes {{ '}' }} from '&#64;angular/router';
import {{ '{' }} AdminLayoutComponent {{ '}' }} from './admin-layout.component';
import {{ '{' }} DashboardComponent {{ '}' }} from './pages/dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {{ '{' }}
    path: '',
    component: AdminLayoutComponent,
    children: [
      {{ '{' }} path: 'dashboard', component: DashboardComponent {{ '}' }},
      {{ '{' }} path: 'users', component: UserListComponent {{ '}' }}
    ]
  {{ '}' }}
];</code></pre>

      <h3>演習問題</h3>
      <ol>
        <li>新しい機能モジュール「Products」を遅延ローディングで追加してください</li>
        <li>ブラウザの開発者ツールで各モジュールのファイルサイズを確認してください</li>
        <li>ビルドコマンドを実行して、生成されるチャンクファイルを確認してください</li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
