import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>検索ページ</h2>
    <p>クエリパラメータについては、次のセクションで詳しく学習します。</p>

    <div class="info">
      <h3>学習ポイント</h3>
      <ul>
        <li>URLに検索クエリを含める方法</li>
        <li>クエリパラメータの取得方法</li>
        <li>フィルタリングとページネーション</li>
      </ul>

      <a routerLink="/home" class="btn">ホームに戻る</a>
    </div>
  `,
  styles: [`
    .info {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
    }

    h3 {
      margin-top: 0;
    }

    .btn {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: #1565c0;
    }
  `]
})
export class SearchComponent {}
