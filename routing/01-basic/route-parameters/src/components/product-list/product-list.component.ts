import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>商品一覧</h2>
    <p>商品をクリックすると、ルートパラメータを使って詳細ページに遷移します。</p>

    <div class="product-grid">
      @for (product of products; track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price.toLocaleString() }}</p>
          <!-- ルートパラメータにIDを渡す -->
          <a [routerLink]="['/products', product.id]" class="detail-link">
            詳細を見る (ID: {{ product.id }})
          </a>
        </div>
      }
    </div>

    <div class="code-example">
      <h3>ルート定義</h3>
      <pre><code>{{ routeDefinition }}</code></pre>

      <h3>routerLink の使用例</h3>
      <pre><code>{{ routerLinkExample }}</code></pre>
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

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 1rem 0;
    }

    .detail-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .detail-link:hover {
      text-decoration: underline;
    }

    .code-example {
      margin-top: 3rem;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .code-example h3 {
      margin-top: 1.5rem;
    }

    .code-example h3:first-child {
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
    }
  `]
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000 },
    { id: 2, name: 'マウス', price: 3000 },
    { id: 3, name: 'キーボード', price: 8000 }
  ];

  routeDefinition = `{ path: 'products/:id', component: ProductDetailComponent }`;
  routerLinkExample = `<a [routerLink]="['/products', product.id]">詳細</a>`;
}
