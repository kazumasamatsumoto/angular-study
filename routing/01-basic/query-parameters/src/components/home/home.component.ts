import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <h2>クエリパラメータの学習</h2>
    <p>クエリパラメータを使って、URLに検索条件やフィルタ情報を含める方法を学びます。</p>

    <div class="demo-section">
      <h3>クエリパラメータ付きナビゲーション</h3>

      <div class="example">
        <h4>1. routerLink でクエリパラメータを設定</h4>
        <div class="button-group">
          <a routerLink="/products" [queryParams]="{category: 'electronics'}">
            電化製品
          </a>
          <a routerLink="/products" [queryParams]="{category: 'books'}">
            書籍
          </a>
          <a routerLink="/products" [queryParams]="{category: 'clothing', sort: 'price'}">
            衣料品（価格順）
          </a>
        </div>
      </div>

      <div class="example">
        <h4>2. router.navigate() でクエリパラメータを設定</h4>
        <div class="search-form">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="検索キーワードを入力"
            (keyup.enter)="search()">
          <button (click)="search()">検索</button>
        </div>
      </div>

      <div class="example">
        <h4>3. 複数のクエリパラメータ</h4>
        <div class="button-group">
          <a routerLink="/products" [queryParams]="{category: 'electronics', page: 1, sort: 'date'}">
            電化製品 (1ページ目, 日付順)
          </a>
        </div>
      </div>
    </div>

    <div class="info">
      <h3>学習ポイント</h3>
      <ul>
        <li>クエリパラメータは <code>?key=value&key2=value2</code> の形式</li>
        <li>ルート定義に含める必要がない（オプショナル）</li>
        <li>検索条件、フィルタ、ページネーションなどに使用</li>
        <li>ルートパラメータとの使い分けが重要</li>
      </ul>
    </div>
  `,
  styles: [`
    .demo-section {
      margin: 2rem 0;
    }

    .example {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .example h4 {
      margin-top: 0;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .button-group a {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .button-group a:hover {
      background-color: #1565c0;
    }

    .search-form {
      display: flex;
      gap: 0.5rem;
    }

    .search-form input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .search-form button {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-form button:hover {
      background-color: #1565c0;
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

    code {
      background-color: #fff;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);
  searchQuery = '';

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery, page: 1 }
      });
    }
  }
}
