import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="error-code">404</div>
      <h2>ページが見つかりません</h2>
      <p class="message">
        お探しのページは存在しないか、移動した可能性があります。
      </p>

      <div class="info-box">
        <h3>ワイルドカードルートについて</h3>
        <p>このページは、ルート設定の <code>**</code> パスによって表示されています。</p>
        <pre><code>&#123; path: '**', component: NotFoundComponent &#125;</code></pre>
        <p>
          ワイルドカード (<code>**</code>) は、定義されていないすべてのパスにマッチする特殊なパターンです。
          必ずルート設定の<strong>最後</strong>に配置する必要があります。
        </p>
      </div>

      <div class="suggestions">
        <h3>次の操作をお試しください</h3>
        <ul>
          <li>URLのスペルが正しいか確認してください</li>
          <li>ブラウザの戻るボタンで前のページに戻る</li>
          <li>ホームページから目的のページを探す</li>
        </ul>
      </div>

      <a routerLink="/home" class="btn">ホームに戻る</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 2rem 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .error-code {
      font-size: 8rem;
      font-weight: bold;
      color: #d32f2f;
      margin: 0;
      line-height: 1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin: 1rem 0;
      font-size: 2rem;
    }

    .message {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .info-box {
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: left;
      border-radius: 4px;
    }

    .info-box h3 {
      color: #1976d2;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .info-box p {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .info-box pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    .info-box code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
    }

    .suggestions {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: left;
      border-radius: 4px;
    }

    .suggestions h3 {
      color: #f57c00;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .suggestions ul {
      color: #333;
      text-align: left;
      margin: 0;
    }

    .suggestions li {
      margin-bottom: 0.5rem;
    }

    .btn {
      margin-top: 1.5rem;
      font-size: 1.1rem;
      padding: 0.75rem 2rem;
    }
  `]
})
export class NotFoundComponent {}
