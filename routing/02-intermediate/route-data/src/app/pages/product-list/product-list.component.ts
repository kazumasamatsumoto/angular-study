import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      @if (routeData) {
        <div class="page-header">
          <span class="page-icon">{{ routeData['icon'] }}</span>
          <div class="page-title-group">
            <h2>{{ routeData['title'] }}</h2>
            <p class="page-subtitle">{{ routeData['description'] }}</p>
          </div>
        </div>
      }

      <div class="alert alert-success">
        このページのRoute Dataには、title、icon、descriptionが設定されています。
      </div>

      <div class="grid">
        @for (product of products; track product.id) {
          <div class="feature-card">
            <h3>{{ product.name }}</h3>
            <p>カテゴリ: <span class="badge badge-primary">{{ product.category }}</span></p>
            <p>価格: <strong>¥{{ product.price.toLocaleString() }}</strong></p>
            <a [routerLink]="['/products', product.id]" class="btn btn-primary">
              詳細を見る
            </a>
          </div>
        }
      </div>

      <h3 style="margin-top: 2rem;">Route Data の取得方法</h3>
      <pre><code>export class ProductListComponent {{ '{' }}
  private route = inject(ActivatedRoute);
  routeData = this.route.snapshot.data;

  ngOnInit() {{ '{' }}
    console.log(this.routeData['title']);
    console.log(this.routeData['icon']);
  {{ '}' }}
{{ '}' }}
</code></pre>

      <div class="metadata-box">
        <h4>現在のRoute Data</h4>
        @for (item of getRouteDataEntries(); track item.key) {
          <div class="metadata-item">
            <span class="metadata-label">{{ item.key }}:</span>
            <span class="metadata-value">{{ item.value }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeData: any;

  products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000, category: '電子機器' },
    { id: 2, name: 'ワイヤレスマウス', price: 3000, category: '周辺機器' },
    { id: 3, name: 'キーボード', price: 8000, category: '周辺機器' }
  ];

  ngOnInit(): void {
    this.routeData = this.route.snapshot.data;
  }

  getRouteDataEntries(): { key: string; value: any }[] {
    return Object.entries(this.routeData).map(([key, value]) => ({
      key,
      value: JSON.stringify(value)
    }));
  }
}
