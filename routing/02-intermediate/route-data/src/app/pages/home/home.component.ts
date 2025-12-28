import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
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

      <div class="alert alert-info">
        <strong>このデモについて:</strong><br>
        Route Dataを使用して、ルートに静的なメタデータを設定し、
        コンポーネントやサービスから利用する方法を学びます。
      </div>

      <h3>主な機能</h3>
      <div class="grid">
        <div class="feature-card">
          <h3>&#64;1. パンくずリスト</h3>
          <p>ルートのdataからbreadcrumbを取得して自動生成</p>
          <a routerLink="/products" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;2. ページタイトル</h3>
          <p>ルート遷移時にブラウザタイトルを自動更新</p>
          <a routerLink="/about" class="btn btn-primary">試してみる</a>
        </div>

        <div class="feature-card">
          <h3>&#64;3. カスタムメタデータ</h3>
          <p>独自のメタデータを定義して活用</p>
          <a routerLink="/contact" class="btn btn-primary">試してみる</a>
        </div>
      </div>

      <h3>Route Dataとは</h3>
      <p>
        ルート設定の<code>data</code>プロパティに、任意の静的データを設定できます。
        これにより、コンポーネントやサービスから統一的にメタデータにアクセスできます。
      </p>

      <h3>実装例</h3>
      <pre><code>// app.routes.ts
{{ '{' }}
  path: 'products',
  component: ProductListComponent,
  data: {{ '{' }}
    title: '商品一覧',
    breadcrumb: '商品一覧',
    icon: '🛍️',
    description: 'すべての商品を表示'
  {{ '}' }}
{{ '}' }}

// component.ts
export class ProductListComponent {{ '{' }}
  route = inject(ActivatedRoute);
  routeData = this.route.snapshot.data;

  ngOnInit() {{ '{' }}
    console.log(this.routeData['title']);  // '商品一覧'
    console.log(this.routeData['icon']);   // '🛍️'
  {{ '}' }}
{{ '}' }}
</code></pre>

      <h3>現在のルートデータ</h3>
      <div class="metadata-box">
        <h4>Route Data の内容</h4>
        @if (routeData) {
          @for (item of getRouteDataEntries(); track item.key) {
            <div class="metadata-item">
              <span class="metadata-label">{{ item.key }}:</span>
              <span class="metadata-value">{{ item.value }}</span>
            </div>
          }
        } @else {
          <p>Route Dataが設定されていません</p>
        }
      </div>

      <h3>活用シーン</h3>
      <ul>
        <li><strong>SEO対策:</strong> ページタイトル、メタディスクリプション</li>
        <li><strong>ナビゲーション:</strong> パンくずリスト、サイトマップ</li>
        <li><strong>アクセス制御:</strong> 権限情報、認証要否</li>
        <li><strong>UI制御:</strong> アニメーション、レイアウト設定</li>
        <li><strong>分析:</strong> ページカテゴリ、トラッキング情報</li>
      </ul>

      <h3>演習問題</h3>
      <ol>
        <li>サイトマップコンポーネントを作成してみよう</li>
        <li>メタタグ（description、keywords）を動的に設定してみよう</li>
        <li>ページごとのアニメーション設定を実装してみよう</li>
        <li>アクセス解析用のページカテゴリを設定してみよう</li>
      </ol>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeData: any;

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
