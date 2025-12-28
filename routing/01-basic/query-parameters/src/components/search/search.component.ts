import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>検索結果</h2>

    <div class="search-info">
      <h3>取得したクエリパラメータ</h3>
      <p><strong>検索キーワード (q):</strong> {{ searchQuery || '(未指定)' }}</p>
      <p><strong>ページ番号 (page):</strong> {{ currentPage }}</p>
    </div>

    @if (searchQuery) {
      <div class="results">
        <h3>「{{ searchQuery }}」の検索結果</h3>
        <p>{{ results.length }} 件の結果が見つかりました</p>

        <ul class="result-list">
          @for (result of results; track result.id) {
            <li>
              <h4>{{ result.title }}</h4>
              <p>{{ result.description }}</p>
            </li>
          }
        </ul>

        <div class="pagination">
          @for (page of [1, 2, 3]; track page) {
            <a
              routerLink="/search"
              [queryParams]="{q: searchQuery, page: page}"
              [class.active]="page === currentPage">
              {{ page }}
            </a>
          }
        </div>
      </div>
    } @else {
      <div class="no-query">
        <p>検索キーワードを入力してください</p>
        <a routerLink="/home" class="btn">ホームに戻る</a>
      </div>
    }

    <div class="code-example">
      <h3>クエリパラメータの取得方法</h3>
      <pre><code>{{ codeExample }}</code></pre>
    </div>
  `,
  styles: [`
    .search-info {
      padding: 1.5rem;
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
      margin: 1.5rem 0;
    }

    .search-info h3 {
      margin-top: 0;
    }

    .results {
      margin: 2rem 0;
    }

    .result-list {
      list-style: none;
      padding: 0;
    }

    .result-list li {
      padding: 1rem;
      margin: 1rem 0;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .result-list h4 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
    }

    .result-list p {
      margin: 0;
      color: #666;
    }

    .pagination {
      display: flex;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .pagination a {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s;
    }

    .pagination a:hover {
      background-color: #f5f5f5;
    }

    .pagination a.active {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .no-query {
      text-align: center;
      padding: 3rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .btn {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }

    .code-example {
      margin-top: 3rem;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .code-example h3 {
      margin-top: 0;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  searchQuery = '';
  currentPage = 1;
  results: any[] = [];

  codeExample = `this.route.queryParamMap
  .pipe(takeUntil(this.destroy$))
  .subscribe(params => {
    this.searchQuery = params.get('q') || '';
    this.currentPage = Number(params.get('page')) || 1;
  });`;

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchQuery = params.get('q') || '';
        this.currentPage = Number(params.get('page')) || 1;
        this.loadResults();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadResults() {
    if (this.searchQuery) {
      // ダミーデータ
      this.results = [
        { id: 1, title: `${this.searchQuery} の結果 1`, description: 'これはサンプルの検索結果です' },
        { id: 2, title: `${this.searchQuery} の結果 2`, description: 'クエリパラメータを使用しています' },
        { id: 3, title: `${this.searchQuery} の結果 3`, description: 'ページ番号: ' + this.currentPage }
      ];
    } else {
      this.results = [];
    }
  }
}
