import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>Resolve Guard - データのプリロード</h2>

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        Resolverを使用して、ルート遷移前にデータを事前にロードする実装例です。
        ページ表示時にすでにデータが準備されているため、ローディング表示が不要になります。
      </div>

      <h3>主な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>&#64;1. 単一データの解決</h3>
          <p>ユーザー詳細ページで特定のユーザーデータを事前取得</p>
          <a routerLink="/users/1" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;2. リストデータの解決</h3>
          <p>ユーザー一覧ページですべてのユーザーを事前取得</p>
          <a routerLink="/users" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;3. 複数データの並行取得</h3>
          <p>ダッシュボードで複数のAPIを並行実行</p>
          <a routerLink="/dashboard" class="btn btn-primary">試してみる</a>
        </div>
      </div>

      <h3>Resolverを使う理由</h3>
      <ol>
        <li><strong>UX向上:</strong> ページ表示時にデータが揃っている</li>
        <li><strong>シンプルなコンポーネント:</strong> データ取得ロジックを分離</li>
        <li><strong>エラーハンドリング:</strong> 遷移前にエラーを処理</li>
        <li><strong>再利用性:</strong> 同じResolverを複数のルートで使用可能</li>
      </ol>

      <h3>Resolver vs コンポーネント内取得</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>Resolver使用</h3>
          <ul>
            <li>データ取得完了後にページ表示</li>
            <li>ローディング表示が不要</li>
            <li>データが確実に存在</li>
            <li>ロジックが分離されてクリーン</li>
          </ul>
        </div>

        <div class="feature-card">
          <h3>コンポーネント内取得</h3>
          <ul>
            <li>ページ表示後にデータ取得</li>
            <li>ローディング表示が必要</li>
            <li>undefinedチェックが必要</li>
            <li>コンポーネントが複雑化</li>
          </ul>
        </div>
      </div>

      <h3>実装のポイント</h3>
      <pre><code>// user.resolver.ts
export const userResolver: ResolveFn&lt;User | null&gt; = (route) =&gt; {{ '{' }}
  const userService = inject(UserService);
  const id = Number(route.paramMap.get('id'));

  return userService.getUserById(id).pipe(
    catchError((error) =&gt; {{ '{' }}
      console.error('エラー:', error);
      return of(null);
    {{ '}' }})
  );
{{ '}' }};

// app.routes.ts
{{ '{' }}
  path: 'users/:id',
  component: UserDetailComponent,
  resolve: {{ '{' }}
    user: userResolver  // データをuserという名前で渡す
  {{ '}' }}
{{ '}' }}

// user-detail.component.ts
export class UserDetailComponent {{ '{' }}
  // ActivatedRouteのdataからユーザー情報を取得
  user = input.required&lt;User&gt;();
{{ '}' }}
</code></pre>

      <h3>動作確認</h3>
      <ol>
        <li>上記のリンクをクリックして各ページに移動してください</li>
        <li>ページ遷移中、データ取得中の状態が確認できます</li>
        <li>データ取得完了後、ページが表示されます</li>
        <li>ブラウザのコンソールでResolverの動作ログを確認できます</li>
      </ol>

      <h3>演習問題</h3>
      <ol>
        <li>キャッシュ機能を追加してみよう（同じデータは再取得しない）</li>
        <li>タイムアウト処理を実装してみよう</li>
        <li>ページネーション対応のResolverを作成してみよう</li>
        <li>条件付きでデータを取得するResolverを実装してみよう</li>
        <li>プログレスバーを表示するResolverを作成してみよう</li>
      </ol>
    </div>
  `
})
export class HomeComponent {}
