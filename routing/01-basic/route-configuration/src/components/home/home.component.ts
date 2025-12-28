import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <h2>ホームページ</h2>
      <p>ルート設定のデモアプリケーションへようこそ！</p>

      <section class="demo-section">
        <h3>このデモで学べること</h3>
        <ul>
          <li><strong>pathMatch: 'full'</strong> - 完全一致でのリダイレクト</li>
          <li><strong>リダイレクト</strong> - 旧パスから新パスへの自動遷移</li>
          <li><strong>ワイルドカードルート</strong> - 未定義ルートの処理 (404ページ)</li>
        </ul>
      </section>

      <section class="demo-section">
        <h3>試してみよう</h3>
        <div class="demo-buttons">
          <a routerLink="/home" class="btn">ホームへ (通常のルート)</a>
          <a routerLink="/old-path" class="btn">旧パスへ (リダイレクトされます)</a>
          <a routerLink="/invalid-route" class="btn">無効なルート (404になります)</a>
        </div>
      </section>

      <section class="demo-section">
        <h3>コード例</h3>
        <pre><code>export const routes: Routes = [
  // pathMatch: 'full' で完全一致のみリダイレクト
  &#123; path: '', redirectTo: '/home', pathMatch: 'full' &#125;,

  // 通常のルート
  &#123; path: 'home', component: HomeComponent &#125;,

  // リダイレクト
  &#123; path: 'old-path', redirectTo: '/home' &#125;,

  // ワイルドカードルート (最後に配置)
  &#123; path: '**', component: NotFoundComponent &#125;
];</code></pre>
      </section>
    </div>
  `,
  styles: [`
    .home {
      max-width: 800px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .demo-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
    }

    .demo-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .demo-buttons .btn {
      text-align: center;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    ul li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #4caf50;
      font-weight: bold;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1rem 0 0 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  `]
})
export class HomeComponent {}
