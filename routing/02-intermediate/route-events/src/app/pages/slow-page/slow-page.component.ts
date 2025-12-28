import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slow-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>遅いページ</h2>

      <div class="alert alert-warning">
        このページはResolverで3秒の遅延をシミュレートしています。
        ローディングインジケーターとプログレスバーの動作を確認できます。
      </div>

      <p>
        Resolverで取得したデータ: <strong>{{ data() }}</strong>
      </p>

      <h3>Resolverによる遅延</h3>
      <pre><code>// slow-page.resolver.ts
export const slowPageResolver: ResolveFn&lt;string&gt; = () =&gt; {{ '{' }}
  return of('データ取得完了').pipe(
    delay(3000)  // 3秒の遅延
  );
{{ '}' }};

// app.routes.ts
{{ '{' }}
  path: 'slow-page',
  component: SlowPageComponent,
  resolve: {{ '{' }}
    data: slowPageResolver  // Resolverを設定
  {{ '}' }}
{{ '}' }}
</code></pre>

      <h3>ローディング中の動作</h3>
      <ol>
        <li><strong>NavigationStart:</strong> ナビゲーション開始</li>
        <li><strong>Resolver実行:</strong> 3秒間データ取得中
          <ul>
            <li>ローディングオーバーレイが表示</li>
            <li>プログレスバーが10%で表示</li>
          </ul>
        </li>
        <li><strong>NavigationEnd:</strong> データ取得完了後にページ表示
          <ul>
            <li>ローディングオーバーレイが非表示</li>
            <li>プログレスバーが100%になり消える</li>
          </ul>
        </li>
      </ol>

      <h3>実務での活用</h3>
      <p>
        このパターンは、APIからデータを取得する際に非常に有用です。
        ユーザーに「処理中」であることを明確に伝えられます。
      </p>

      <ul>
        <li>大量データの取得</li>
        <li>複数APIの並行呼び出し</li>
        <li>遅いネットワーク環境での体験向上</li>
      </ul>
    </div>
  `
})
export class SlowPageComponent {
  data = input.required<string>();
}
