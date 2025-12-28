import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about">
      <h2>このサイトについて</h2>
      <p>Angular のルーティング設定を学ぶためのデモアプリケーションです。</p>

      <section class="info-section">
        <h3>pathMatch オプション</h3>
        <p><code>pathMatch</code> は、ルートがURLとマッチする方法を指定します。</p>

        <div class="example">
          <h4>full (完全一致)</h4>
          <pre><code>&#123; path: '', redirectTo: '/home', pathMatch: 'full' &#125;</code></pre>
          <p>URL全体が空の場合のみマッチします。これがないと無限ループになります。</p>
        </div>

        <div class="example">
          <h4>prefix (前方一致・デフォルト)</h4>
          <pre><code>&#123; path: 'products', component: ProductsComponent &#125;</code></pre>
          <p>URLの先頭が一致すればマッチします。<code>/products/123</code> でもマッチします。</p>
        </div>
      </section>

      <section class="info-section">
        <h3>リダイレクト</h3>
        <p>特定のパスから別のパスへ自動的に遷移させることができます。</p>
        <pre><code>&#123; path: 'old-path', redirectTo: '/new-path' &#125;</code></pre>
        <p>サイトのリニューアル時など、古いURLから新しいURLへユーザーを誘導する際に便利です。</p>
      </section>

      <section class="info-section">
        <h3>ワイルドカードルート</h3>
        <p><code>**</code> はすべてのパスにマッチする特殊なパスです。</p>
        <pre><code>&#123; path: '**', component: NotFoundComponent &#125;</code></pre>
        <p><strong>重要:</strong> ワイルドカードルートは必ず最後に配置してください。</p>
      </section>

      <div class="navigation">
        <a routerLink="/home" class="btn">ホームに戻る</a>
      </div>
    </div>
  `,
  styles: [`
    .about {
      max-width: 800px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .info-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
    }

    .info-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .example {
      margin-top: 1rem;
      padding: 1rem;
      background-color: white;
      border-left: 4px solid #1976d2;
      border-radius: 4px;
    }

    .example h4 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
      font-size: 1rem;
    }

    .example p {
      margin-bottom: 0;
      color: #666;
      font-size: 0.9rem;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
    }

    .navigation {
      margin-top: 2rem;
    }
  `]
})
export class AboutComponent {}
