import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>ユーザー詳細</h2>

      <div class="alert alert-success">
        <strong>Resolverでデータ取得完了!</strong><br>
        このページは<code>userResolver</code>によって、
        ページ表示前にユーザーデータが取得されています。
      </div>

      @if (user()) {
        <div class="user-card">
          <div class="user-header">
            <div class="user-avatar">
              {{ user()!.name.charAt(0) }}
            </div>
            <div class="user-info">
              <h2>{{ user()!.name }}</h2>
              <p class="user-email">{{ user()!.email }}</p>
            </div>
          </div>

          <div class="user-details">
            <div class="detail-item">
              <div class="detail-label">ユーザー名</div>
              <div class="detail-value">{{ user()!.username }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">電話番号</div>
              <div class="detail-value">{{ user()!.phone }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">ウェブサイト</div>
              <div class="detail-value">
                <a [href]="user()!.website" target="_blank">{{ user()!.website }}</a>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">会社名</div>
              <div class="detail-value">{{ user()!.company.name }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">キャッチフレーズ</div>
              <div class="detail-value">{{ user()!.company.catchPhrase }}</div>
            </div>

            <div class="detail-item">
              <div class="detail-label">住所</div>
              <div class="detail-value">
                {{ user()!.address.city }} {{ user()!.address.street }}
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem;">
          <a routerLink="/users" class="btn btn-primary">ユーザー一覧に戻る</a>
        </div>
      } @else {
        <div class="error-container">
          <div class="error-icon">❌</div>
          <h3>ユーザーが見つかりませんでした</h3>
          <p>指定されたユーザーIDは存在しません。</p>
          <a routerLink="/" class="btn btn-primary">ホームに戻る</a>
        </div>
      }

      <h3 style="margin-top: 2rem;">Resolverの実装</h3>
      <pre><code>// user.resolver.ts
export const userResolver: ResolveFn&lt;User | null&gt; = (route) =&gt; {{ '{' }}
  const userService = inject(UserService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return userService.getUserById(id).pipe(
    catchError((error) =&gt; {{ '{' }}
      console.error('エラー:', error);
      alert(\`ユーザーID \${{ '{' }}id{{ '}' }} が見つかりませんでした\`);
      router.navigate(['/']);  // エラー時はホームへ
      return of(null);
    {{ '}' }})
  );
{{ '}' }};
</code></pre>

      <h3>ルートパラメータの活用</h3>
      <p>
        ResolverはActivatedRouteSnapshotを受け取るため、
        ルートパラメータ（:id）を使って動的にデータを取得できます。
      </p>
      <pre><code>const id = Number(route.paramMap.get('id'));
return userService.getUserById(id);
</code></pre>

      <h3>エラーハンドリング</h3>
      <ul>
        <li>存在しないIDの場合、エラーをキャッチ</li>
        <li>ユーザーにアラートで通知</li>
        <li>ホームページにリダイレクト</li>
        <li>または、nullを返してエラーページを表示</li>
      </ul>

      <h3>試してみよう</h3>
      <ol>
        <li>URLを直接変更: <code>/users/999</code> にアクセス</li>
        <li>存在しないIDの場合、エラーハンドリングが動作</li>
        <li>コンソールでResolverのログを確認</li>
      </ol>
    </div>
  `
})
export class UserDetailComponent {
  // Resolverで取得したユーザー情報を受け取る
  user = input.required<User | null>();
}
