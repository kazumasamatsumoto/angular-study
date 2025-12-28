# ナビゲーション（Navigation）

このセクションでは、Angular Routerを使った様々なナビゲーション方法を学びます。

## 学習内容

1. **routerLink ディレクティブ**
2. **router.navigate() メソッド**
3. **routerLinkActive ディレクティブ**
4. **絶対パスと相対パス**

## 実装例

### 1. routerLink を使った宣言的なナビゲーション

**app.component.html**
```html
<!-- 基本的な使い方 -->
<a routerLink="/home">ホーム</a>
<a routerLink="/products">商品一覧</a>

<!-- 配列形式での使用 -->
<a [routerLink]="['/products', 123]">商品詳細</a>

<!-- 相対パス -->
<a routerLink="./details">詳細</a>
<a routerLink="../list">一覧に戻る</a>

<!-- クエリパラメータとフラグメント -->
<a
  routerLink="/search"
  [queryParams]="{q: 'angular', page: 1}"
  fragment="results">
  検索
</a>
```

### 2. Router サービスを使ったプログラム的なナビゲーション

**navigation.component.ts**
```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  private router = inject(Router);

  // 基本的なナビゲーション
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  // パラメータ付きナビゲーション
  navigateToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  // クエリパラメータ付きナビゲーション
  navigateToSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query, page: 1 }
    });
  }

  // 相対パスでのナビゲーション
  navigateRelative() {
    this.router.navigate(['../list'], {
      relativeTo: this.route
    });
  }

  // フラグメント付きナビゲーション
  navigateWithFragment() {
    this.router.navigate(['/page'], {
      fragment: 'section-2'
    });
  }

  // 複数のオプション
  navigateWithOptions() {
    this.router.navigate(['/products'], {
      queryParams: { category: 'electronics' },
      fragment: 'top',
      queryParamsHandling: 'merge' // 既存のクエリパラメータを保持
    });
  }
}
```

### 3. routerLinkActive を使ったアクティブリンクのスタイリング

**navigation.component.html**
```html
<nav>
  <a
    routerLink="/home"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{exact: true}">
    ホーム
  </a>

  <a
    routerLink="/products"
    routerLinkActive="active">
    商品
  </a>

  <a
    routerLink="/about"
    routerLinkActive="active">
    About
  </a>
</nav>
```

**navigation.component.css**
```css
nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

nav a:hover {
  background-color: #f0f0f0;
}

nav a.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: bold;
}
```

### 4. 完全な実装例

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'search', component: SearchComponent }
];
```

**app.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Navigation Example';
}
```

**product-list.component.ts**
```typescript
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
    <div class="product-grid">
      @for (product of products; track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>¥{{ product.price.toLocaleString() }}</p>
          <a [routerLink]="['/products', product.id]">詳細を見る</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .product-card {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 4px;
    }

    .product-card a {
      display: inline-block;
      margin-top: 0.5rem;
      color: #1976d2;
      text-decoration: none;
    }
  `]
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000 },
    { id: 2, name: 'マウス', price: 3000 },
    { id: 3, name: 'キーボード', price: 8000 },
    { id: 4, name: 'モニター', price: 35000 }
  ];
}
```

## 重要なポイント

### 1. routerLink vs href
- ❌ `href`: ページ全体をリロード（SPAの利点を失う）
- ✅ `routerLink`: クライアントサイドルーティング（高速、状態保持）

### 2. 絶対パスと相対パス
```html
<!-- 絶対パス: ルートから -->
<a routerLink="/products">商品</a>

<!-- 相対パス: 現在のルートから -->
<a routerLink="./details">詳細</a>
<a routerLink="../list">一覧</a>
```

### 3. routerLinkActiveOptions
```html
<!-- exact: true → 完全一致のみアクティブ化 -->
<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
  ホーム
</a>
```

### 4. NavigationExtras オプション
```typescript
this.router.navigate(['/path'], {
  queryParams: { key: 'value' },        // クエリパラメータ
  fragment: 'section',                  // URLフラグメント
  queryParamsHandling: 'merge',         // 既存のクエリパラメータを保持
  preserveFragment: true,               // 既存のフラグメントを保持
  skipLocationChange: true,             // URLを変更しない
  replaceUrl: true                      // 履歴を置き換え
});
```

## よくある間違い

❌ **間違い**: href を使用
```html
<a href="/products">商品</a>  <!-- ページリロードが発生 -->
```

✅ **正しい**: routerLink を使用
```html
<a routerLink="/products">商品</a>
```

❌ **間違い**: ルートパスで exact オプションを忘れる
```html
<!-- "/" は全てのパスにマッチするため常にアクティブになる -->
<a routerLink="/" routerLinkActive="active">ホーム</a>
```

✅ **正しい**: exact オプションを指定
```html
<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">ホーム</a>
```

## 演習問題

### 初級
1. ナビゲーションバーに「マイページ」リンクを追加してください
   - パス: `/my-page`
   - アクティブ時に背景色を変更

2. 商品一覧ページに「カテゴリ」フィルタを追加してください
   - クエリパラメータを使用: `?category=electronics`

### 中級
3. 「戻る」「進む」ボタンを実装してください
   - Hint: `Location` サービスを使用

4. ナビゲーション前に確認ダイアログを表示してください
   - Hint: `CanDeactivate` ガードを使用（発展編で詳しく学習）

### 上級
5. パンくずリスト（Breadcrumb）を実装してください
   - 現在のルート階層を表示
   - 各階層へナビゲート可能

## 実行方法

### 初回セットアップ
```bash
cd 01-basic/navigation
npm install
```

### 開発サーバーの起動
```bash
npm start
# または
ng serve --port 4201
```

**注意:** このサンプルはポート4201で起動します（basic-routingと同時起動可能）

ブラウザで `http://localhost:4201` を開いてください。

### ビルド（本番用）
```bash
npm run build
```

### 動作確認のポイント
1. **routerLink によるナビゲーション**
   - ヘッダーのリンクをクリックして各ページに遷移
   - URLが変化することを確認

2. **routerLinkActive の動作**
   - アクティブなリンクがハイライトされることを確認
   - ルートパス（"/"）で exact オプションが正しく動作することを確認

3. **プログラム的なナビゲーション**
   - ホームページのボタンをクリックして router.navigate() の動作を確認
   - クエリパラメータ付きナビゲーションのURLを確認

4. **相対パスと絶対パス**
   - 商品一覧から商品詳細へのリンクが正しく動作することを確認

## 次のステップ

次は [route-parameters](../route-parameters/README.md) で、動的なルートパラメータの使い方を学びます。
