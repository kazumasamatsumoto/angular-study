import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  date: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>商品一覧</h2>

    <div class="filter-info">
      <h3>現在のフィルタ条件</h3>
      <p><strong>カテゴリ:</strong> {{ category }}</p>
      <p><strong>並び順:</strong> {{ getSortLabel(sortBy) }}</p>
      <p><strong>ページ:</strong> {{ currentPage }}</p>
    </div>

    <div class="filters">
      <h3>フィルタ</h3>
      <div class="filter-buttons">
        <button (click)="setCategory('all')">すべて</button>
        <button (click)="setCategory('electronics')">電化製品</button>
        <button (click)="setCategory('books')">書籍</button>
        <button (click)="setCategory('clothing')">衣料品</button>
      </div>

      <div class="sort-buttons">
        <button (click)="setSort('date')">日付順</button>
        <button (click)="setSort('price')">価格順</button>
        <button (click)="setSort('name')">名前順</button>
      </div>
    </div>

    <div class="product-grid">
      @for (product of filteredProducts; track product.id) {
        <div class="product-card">
          <h4>{{ product.name }}</h4>
          <p class="category">カテゴリ: {{ product.category }}</p>
          <p class="price">¥{{ product.price.toLocaleString() }}</p>
          <p class="date">{{ product.date }}</p>
        </div>
      }
    </div>

    <div class="code-example">
      <h3>クエリパラメータの設定と取得</h3>
      <pre><code>{{ codeExample }}</code></pre>
    </div>
  `,
  styles: [`
    .filter-info {
      padding: 1.5rem;
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      margin: 1.5rem 0;
    }

    .filter-info h3 {
      margin-top: 0;
    }

    .filters {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .filters h3 {
      margin-top: 0;
    }

    .filter-buttons, .sort-buttons {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    button:hover {
      background-color: #1976d2;
      color: white;
      border-color: #1976d2;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .product-card {
      border: 1px solid #ddd;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .product-card h4 {
      margin: 0 0 0.5rem 0;
    }

    .category {
      color: #666;
      font-size: 0.9rem;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0.5rem 0;
    }

    .date {
      font-size: 0.85rem;
      color: #999;
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
export class ProductListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  category = 'all';
  sortBy = 'date';
  currentPage = 1;

  allProducts: Product[] = [
    { id: 1, name: 'ノートPC', category: 'electronics', price: 120000, date: '2024-01-15' },
    { id: 2, name: 'マウス', category: 'electronics', price: 3000, date: '2024-01-20' },
    { id: 3, name: 'TypeScript本', category: 'books', price: 3500, date: '2024-01-10' },
    { id: 4, name: 'Angular本', category: 'books', price: 4200, date: '2024-01-25' },
    { id: 5, name: 'Tシャツ', category: 'clothing', price: 2500, date: '2024-01-18' },
    { id: 6, name: 'ジーンズ', category: 'clothing', price: 8000, date: '2024-01-12' }
  ];

  filteredProducts: Product[] = [];

  codeExample = `// クエリパラメータを設定
this.router.navigate(['/products'], {
  queryParams: { category: 'electronics', sort: 'price' }
});

// クエリパラメータを取得
this.route.queryParamMap.subscribe(params => {
  this.category = params.get('category') || 'all';
  this.sortBy = params.get('sort') || 'date';
});`;

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.category = params.get('category') || 'all';
        this.sortBy = params.get('sort') || 'date';
        this.currentPage = Number(params.get('page')) || 1;
        this.applyFilters();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCategory(category: string) {
    this.router.navigate(['/products'], {
      queryParams: { category, sort: this.sortBy, page: 1 }
    });
  }

  setSort(sort: string) {
    this.router.navigate(['/products'], {
      queryParams: { category: this.category, sort, page: this.currentPage }
    });
  }

  getSortLabel(sort: string): string {
    const labels: Record<string, string> = {
      'date': '日付順',
      'price': '価格順',
      'name': '名前順'
    };
    return labels[sort] || sort;
  }

  private applyFilters() {
    // カテゴリフィルタ
    let filtered = this.category === 'all'
      ? this.allProducts
      : this.allProducts.filter(p => p.category === this.category);

    // ソート
    filtered = [...filtered].sort((a, b) => {
      if (this.sortBy === 'price') {
        return a.price - b.price;
      } else if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    this.filteredProducts = filtered;
  }
}
