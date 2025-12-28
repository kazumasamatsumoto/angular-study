import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>商品一覧</h2>
    <p>各商品をクリックすると詳細ページに遷移します。</p>

    <div class="product-grid">
      @for (product of products; track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p class="category">カテゴリ: {{ product.category }}</p>
          <p class="price">¥{{ product.price.toLocaleString() }}</p>
          <a [routerLink]="['/products', product.id]" class="detail-link">
            詳細を見る →
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .product-card {
      border: 1px solid #ddd;
      padding: 1.5rem;
      border-radius: 8px;
      transition: box-shadow 0.3s;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .category {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 1rem 0;
    }

    .detail-link {
      display: inline-block;
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .detail-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }
  `]
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000, category: 'コンピュータ' },
    { id: 2, name: 'マウス', price: 3000, category: '周辺機器' },
    { id: 3, name: 'キーボード', price: 8000, category: '周辺機器' },
    { id: 4, name: 'モニター', price: 35000, category: 'ディスプレイ' },
    { id: 5, name: 'Webカメラ', price: 7000, category: '周辺機器' },
    { id: 6, name: 'ヘッドセット', price: 12000, category: 'オーディオ' }
  ];
}
