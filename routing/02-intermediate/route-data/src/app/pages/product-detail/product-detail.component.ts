import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      @if (routeData) {
        <div class="page-header">
          <span class="page-icon">{{ routeData['icon'] }}</span>
          <div class="page-title-group">
            <h2>{{ routeData['title'] }} #{{ productId }}</h2>
            <p class="page-subtitle">{{ routeData['description'] }}</p>
          </div>
        </div>
      }

      <div class="alert alert-success">
        パンくずリストに「商品一覧 › 商品詳細」と表示されています。
        親ルートと子ルートの両方からbreadcrumbが取得されています。
      </div>

      <div class="metadata-box">
        <h4>商品情報 #{{ productId }}</h4>
        <div class="metadata-item">
          <span class="metadata-label">商品名:</span>
          <span class="metadata-value">サンプル商品 {{ productId }}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">価格:</span>
          <span class="metadata-value">¥12,000</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">カテゴリ:</span>
          <span class="metadata-value">電子機器</span>
        </div>
      </div>

      <h3>親ルートと子ルートのRoute Data</h3>
      <p>
        ネストされたルートの場合、親ルートと子ルートの両方にRoute Dataを設定できます。
        パンくずリストコンポーネントは、ルートツリーを辿って全てのbreadcrumbを収集しています。
      </p>

      <pre><code>// app.routes.ts
{{ '{' }}
  path: 'products',
  data: {{ '{' }}
    breadcrumb: '商品一覧'  // 親ルートのdata
  {{ '}' }},
  children: [
    {{ '{' }}
      path: ':id',
      component: ProductDetailComponent,
      data: {{ '{' }}
        breadcrumb: '商品詳細'  // 子ルートのdata
      {{ '}' }}
    {{ '}' }}
  ]
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

      <div style="margin-top: 2rem;">
        <a routerLink="/products" class="btn btn-primary">商品一覧に戻る</a>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeData: any;
  productId = '';

  ngOnInit(): void {
    this.routeData = this.route.snapshot.data;
    this.productId = this.route.snapshot.params['id'];
  }

  getRouteDataEntries(): { key: string; value: any }[] {
    return Object.entries(this.routeData).map(([key, value]) => ({
      key,
      value: JSON.stringify(value)
    }));
  }
}
