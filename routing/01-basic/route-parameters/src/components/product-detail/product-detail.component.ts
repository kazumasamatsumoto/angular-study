import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (product) {
      <div class="product-detail">
        <h2>{{ product.name }}</h2>
        <p class="category">カテゴリ: {{ product.category }}</p>
        <p class="price">¥{{ product.price.toLocaleString() }}</p>
        <p class="description">{{ product.description }}</p>

        <div class="info-box">
          <h3>取得したパラメータ</h3>
          <p><strong>Product ID:</strong> {{ productId }}</p>
        </div>

        <div class="navigation">
          @if (getPreviousId()) {
            <a [routerLink]="['/products', getPreviousId()]" class="btn">
              ← 前の商品
            </a>
          }
          @if (getNextId()) {
            <a [routerLink]="['/products', getNextId()]" class="btn">
              次の商品 →
            </a>
          }
        </div>

        <a routerLink="/products" class="btn-back">商品一覧に戻る</a>
      </div>
    } @else {
      <div class="error">
        <h2>商品が見つかりません</h2>
        <p>ID: {{ productId }} の商品は存在しません。</p>
        <a routerLink="/products" class="btn">商品一覧に戻る</a>
      </div>
    }

    <div class="code-example">
      <h3>パラメータ取得方法 (snapshot)</h3>
      <pre><code>{{ snapshotExample }}</code></pre>

      <h3>パラメータ取得方法 (Observable - 推奨)</h3>
      <pre><code>{{ observableExample }}</code></pre>
    </div>
  `,
  styles: [`
    .product-detail {
      max-width: 800px;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .category {
      color: #666;
      margin: 0.5rem 0;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
      margin: 1rem 0;
    }

    .description {
      line-height: 1.6;
      color: #555;
      margin: 1.5rem 0;
    }

    .info-box {
      margin: 2rem 0;
      padding: 1rem;
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
    }

    .info-box h3 {
      margin-top: 0;
    }

    .navigation {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }

    .btn, .btn-back {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      transition: background-color 0.3s;
    }

    .btn:hover, .btn-back:hover {
      background-color: #1565c0;
    }

    .btn-back {
      margin-top: 1rem;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #d32f2f;
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
      line-height: 1.5;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  product: Product | null = null;
  productId: string = '';

  private products: Product[] = [
    {
      id: 1,
      name: 'ノートPC',
      price: 120000,
      description: '高性能なノートパソコン。開発作業に最適です。',
      category: 'コンピュータ'
    },
    {
      id: 2,
      name: 'マウス',
      price: 3000,
      description: 'ワイヤレスマウス。快適な操作性を実現します。',
      category: '周辺機器'
    },
    {
      id: 3,
      name: 'キーボード',
      price: 8000,
      description: 'メカニカルキーボード。打鍵感が心地よいです。',
      category: '周辺機器'
    }
  ];

  snapshotExample = `// snapshot を使った取得（初回のみ）
const id = this.route.snapshot.paramMap.get('id');`;

  observableExample = `// Observable を使った取得（パラメータ変更を監視）
this.route.paramMap
  .pipe(takeUntil(this.destroy$))
  .subscribe(params => {
    const id = params.get('id');
    this.loadProduct(id);
  });`;

  ngOnInit() {
    // snapshot を使った取得
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProduct(this.productId);

    // Observable を使った取得（同じコンポーネント内で別のIDに遷移する場合に必要）
    // this.route.paramMap.subscribe(params => {
    //   this.productId = params.get('id') || '';
    //   this.loadProduct(this.productId);
    // });
  }

  private loadProduct(id: string) {
    const product = this.products.find(p => p.id === Number(id));
    this.product = product || null;
  }

  getPreviousId(): number | null {
    const currentId = Number(this.productId);
    return currentId > 1 ? currentId - 1 : null;
  }

  getNextId(): number | null {
    const currentId = Number(this.productId);
    return currentId < this.products.length ? currentId + 1 : null;
  }
}
