import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>ユーザー一覧</h2>

      <div class="alert alert-success">
        <strong>Resolverでデータ取得完了!</strong><br>
        このページは<code>usersResolver</code>によって、
        ページ表示前にすべてのユーザーデータが取得されています。
      </div>

      <p>
        取得されたユーザー数: <strong>{{ users().length }}</strong>件
      </p>

      <ul class="user-list">
        @for (user of users(); track user.id) {
          <li class="user-list-item">
            <div class="user-list-avatar">
              {{ user.name.charAt(0) }}
            </div>
            <div class="user-list-info">
              <div class="user-list-name">{{ user.name }}</div>
              <div class="user-list-email">{{ user.email }}</div>
            </div>
            <a [routerLink]="['/users', user.id]" class="btn btn-primary">
              詳細を見る
            </a>
          </li>
        } @empty {
          <li class="alert alert-warning">
            ユーザーが見つかりませんでした
          </li>
        }
      </ul>

      <h3>Resolverの実装</h3>
      <pre><code>// users.resolver.ts
export const usersResolver: ResolveFn&lt;User[]&gt; = () =&gt; {{ '{' }}
  const userService = inject(UserService);

  return userService.getUsers().pipe(
    catchError((error) =&gt; {{ '{' }}
      console.error('エラー:', error);
      return of([]);  // エラー時は空配列
    {{ '}' }})
  );
{{ '}' }};
</code></pre>

      <h3>コンポーネントでのデータ受け取り</h3>
      <pre><code>// user-list.component.ts
export class UserListComponent {{ '{' }}
  // Resolverで取得したデータをinputで受け取る
  users = input.required&lt;User[]&gt;();
{{ '}' }}
</code></pre>

      <h3>ポイント</h3>
      <ul>
        <li>ページ表示時にデータが確実に存在する</li>
        <li>ローディング表示が不要（Resolverが完了するまでページを表示しない）</li>
        <li>エラー時は空配列を返すことで、ページ表示は継続</li>
        <li>コンポーネントはデータ表示に専念できる</li>
      </ul>
    </div>
  `
})
export class UserListComponent {
  // Resolverで取得したユーザー一覧を受け取る
  users = input.required<User[]>();
}
