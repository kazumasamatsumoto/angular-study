import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>ルートパラメータの学習</h2>
    <p>このセクションでは、URLの一部を変数として扱う「ルートパラメータ」を学びます。</p>

    <div class="demo-section">
      <h3>サンプルリンク</h3>
      <div class="link-group">
        <h4>商品詳細（単一パラメータ）</h4>
        <ul>
          <li><a routerLink="/products/1">商品 #1</a> → <code>/products/1</code></li>
          <li><a routerLink="/products/2">商品 #2</a> → <code>/products/2</code></li>
          <li><a routerLink="/products/3">商品 #3</a> → <code>/products/3</code></li>
        </ul>

        <h4>ユーザープロフィール</h4>
        <ul>
          <li><a routerLink="/users/john">John</a> → <code>/users/john</code></li>
          <li><a routerLink="/users/jane">Jane</a> → <code>/users/jane</code></li>
          <li><a routerLink="/users/bob">Bob</a> → <code>/users/bob</code></li>
        </ul>

        <h4>ユーザーの投稿（複数パラメータ）</h4>
        <ul>
          <li><a routerLink="/users/john/posts/1">John の投稿 #1</a> → <code>/users/john/posts/1</code></li>
          <li><a routerLink="/users/john/posts/2">John の投稿 #2</a> → <code>/users/john/posts/2</code></li>
          <li><a routerLink="/users/jane/posts/3">Jane の投稿 #3</a> → <code>/users/jane/posts/3</code></li>
        </ul>
      </div>
    </div>

    <div class="info">
      <h3>学習ポイント</h3>
      <ul>
        <li>動的ルートパラメータの定義 (<code>:id</code>)</li>
        <li>ActivatedRoute によるパラメータ取得</li>
        <li>snapshot vs Observable の使い分け</li>
        <li>複数パラメータの扱い方</li>
      </ul>
    </div>
  `,
  styles: [`
    .demo-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .link-group h4 {
      margin: 1.5rem 0 0.5rem 0;
      color: #333;
    }

    .link-group h4:first-child {
      margin-top: 0;
    }

    .link-group ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    .link-group li {
      margin: 0.5rem 0;
    }

    .link-group a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .link-group a:hover {
      text-decoration: underline;
    }

    code {
      background-color: #e0e0e0;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9rem;
    }

    .info {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
    }

    .info h3 {
      margin-top: 0;
    }
  `]
})
export class HomeComponent {}
