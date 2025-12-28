import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <div class="container">
        <h2>ネストされたルートへようこそ！</h2>
        <p>このアプリケーションでは、親子関係を持つルーティングの基本を学びます。</p>

        <section class="demo-section">
          <h3>このデモで学べること</h3>
          <ul>
            <li><strong>親子ルート</strong> - ルートの階層構造</li>
            <li><strong>ネストされたrouter-outlet</strong> - 複数のrouter-outletの使用</li>
            <li><strong>相対パス vs 絶対パス</strong> - routerLinkの使い分け</li>
            <li><strong>子ルートのデフォルト</strong> - 空のパスのリダイレクト</li>
          </ul>
        </section>

        <section class="demo-section">
          <h3>ルート構造</h3>
          <pre><code>/home                    (このページ)
/dashboard              (ダッシュボード - 親ルート)
  ├── /dashboard/profile   (プロフィール - 子ルート)
  ├── /dashboard/settings  (設定 - 子ルート)
  └── /dashboard/stats     (統計 - 子ルート)</code></pre>
        </section>

        <section class="demo-section">
          <h3>試してみよう</h3>
          <p>ダッシュボードには複数の子ルートがあります。各メニューをクリックして、ページ遷移を確認してください。</p>
          <a routerLink="/dashboard" class="btn">ダッシュボードへ</a>
        </section>

        <section class="demo-section">
          <h3>コード例</h3>
          <h4>app.routes.ts</h4>
          <pre><code>export const routes: Routes = [
  &#123;
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      &#123; path: '', redirectTo: 'profile', pathMatch: 'full' &#125;,
      &#123; path: 'profile', component: ProfileComponent &#125;,
      &#123; path: 'settings', component: SettingsComponent &#125;,
      &#123; path: 'stats', component: StatsComponent &#125;
    ]
  &#125;
];</code></pre>

          <h4>dashboard.component.ts (親コンポーネント)</h4>
          <pre><code>&#64;Component(&#123;
  template: \`
    &lt;div class="dashboard"&gt;
      &lt;aside&gt;
        &lt;a routerLink="profile"&gt;プロフィール&lt;/a&gt;
        &lt;a routerLink="settings"&gt;設定&lt;/a&gt;
      &lt;/aside&gt;
      &lt;main&gt;
        &lt;!-- 子ルートがここに表示される --&gt;
        &lt;router-outlet&gt;&lt;/router-outlet&gt;
      &lt;/main&gt;
    &lt;/div&gt;
  \`
&#125;)</code></pre>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .home {
      background-color: white;
      min-height: calc(100vh - 100px);
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .demo-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .demo-section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .demo-section h4 {
      color: #555;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 1rem;
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
      margin: 0.5rem 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .btn {
      margin-top: 1rem;
      display: inline-block;
    }
  `]
})
export class HomeComponent {}
