import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardData } from '../../resolvers/dashboard-data.resolver';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>ダッシュボード</h2>

      <div class="alert alert-success">
        <strong>複数データの並行取得完了!</strong><br>
        このページは<code>dashboardDataResolver</code>によって、
        複数のAPIリクエストが並行実行され、すべてのデータが揃ってから表示されています。
      </div>

      @if (data().error) {
        <div class="alert alert-danger">
          {{ data().error }}
        </div>
      }

      <h3>統計情報</h3>
      <div class="stats-container">
        <div class="stat-box">
          <div class="stat-value">{{ data().stats.total }}</div>
          <div class="stat-label">総ユーザー数</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ data().stats.active }}</div>
          <div class="stat-label">アクティブユーザー</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">{{ data().stats.premium }}</div>
          <div class="stat-label">プレミアムユーザー</div>
        </div>
      </div>

      <h3>最新ユーザー</h3>
      <ul class="user-list">
        @for (user of data().users; track user.id) {
          <li class="user-list-item">
            <div class="user-list-avatar">
              {{ user.name.charAt(0) }}
            </div>
            <div class="user-list-info">
              <div class="user-list-name">{{ user.name }}</div>
              <div class="user-list-email">{{ user.email }}</div>
            </div>
            <a [routerLink]="['/users', user.id]" class="btn btn-primary">
              詳細
            </a>
          </li>
        } @empty {
          <li class="alert alert-warning">
            ユーザーが見つかりませんでした
          </li>
        }
      </ul>

      <h3>複数データの並行取得</h3>
      <pre><code>// dashboard-data.resolver.ts
export const dashboardDataResolver: ResolveFn&lt;DashboardData&gt; = () =&gt; {{ '{' }}
  const userService = inject(UserService);

  // forkJoinで複数のリクエストを並行実行
  return forkJoin({{ '{' }}
    users: userService.getUsers(),
    stats: userService.getUserStats()
  {{ '}' }}).pipe(
    map(result =&gt; ({{ '{' }}
      users: result.users,
      stats: result.stats,
      loading: false
    {{ '}' }})),
    catchError((error) =&gt; {{ '{' }}
      return of({{ '{' }}
        users: [],
        stats: {{ '{' }} total: 0, active: 0, premium: 0 {{ '}' }},
        loading: false,
        error: 'データの取得に失敗しました'
      {{ '}' }});
    {{ '}' }})
  );
{{ '}' }};
</code></pre>

      <h3>forkJoinの利点</h3>
      <ul>
        <li><strong>並行実行:</strong> 複数のAPIを同時に呼び出す</li>
        <li><strong>待機:</strong> すべてのリクエストが完了するまで待つ</li>
        <li><strong>結合:</strong> 結果を1つのオブジェクトにまとめる</li>
        <li><strong>効率的:</strong> 直列実行よりも高速</li>
      </ul>

      <h3>実行時間の比較</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>直列実行（Resolverなし）</h3>
          <p>1.0秒（ユーザー取得）+ 0.8秒（統計取得）= <strong>1.8秒</strong></p>
        </div>
        <div class="feature-card">
          <h3>並行実行（forkJoin）</h3>
          <p>max(1.0秒, 0.8秒) = <strong>1.0秒</strong></p>
        </div>
      </div>

      <h3>エラーハンドリング</h3>
      <p>
        forkJoinは、どれか1つでも失敗すると全体が失敗します。<br>
        エラー時はデフォルト値を返すことで、ページ表示を継続できます。
      </p>
    </div>
  `
})
export class DashboardComponent {
  // Resolverで取得したダッシュボードデータを受け取る
  data = input.required<DashboardData>();
}
