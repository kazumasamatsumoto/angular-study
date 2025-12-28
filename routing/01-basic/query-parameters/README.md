# クエリパラメータ（Query Parameters）

このセクションでは、クエリパラメータの設定と取得方法を学びます。

## クエリパラメータとは？

URLの `?` 以降に付与されるパラメータです。
```
/search?q=angular&page=1&sort=date
```

## ルートパラメータとの違い

| 特徴 | ルートパラメータ | クエリパラメータ |
|------|-----------------|-----------------|
| 形式 | `/products/123` | `/products?id=123` |
| 必須 | 必須（ルート定義に含まれる） | オプショナル |
| 用途 | リソースの識別 | フィルタリング、検索条件 |

## 実装例

### 1. ルート定義

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'products', component: ProductListComponent }
  // クエリパラメータはルート定義に含めない
];
```

### 2. クエリパラメータの設定

**search.component.ts**
```typescript
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- routerLink で設定 -->
    <a
      routerLink="/products"
      [queryParams]="{category: 'electronics', page: 1}">
      電化製品
    </a>

    <!-- プログラム的に設定 -->
    <button (click)="search('angular')">検索</button>
  `
})
export class SearchComponent {
  private router = inject(Router);

  search(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query, page: 1 }
    });
  }
}
```

### 3. クエリパラメータの取得

**product-list.component.ts**
```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <h2>商品一覧</h2>
    <p>カテゴリ: {{ category }}</p>
    <p>ページ: {{ page }}</p>
  `
})
export class ProductListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  category: string = '';
  page: number = 1;

  ngOnInit() {
    // Observable で取得（推奨）
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.category = params.get('category') || 'all';
        this.page = Number(params.get('page')) || 1;
      });

    // snapshot で取得
    // this.category = this.route.snapshot.queryParamMap.get('category') || 'all';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 4. クエリパラメータの保持

```typescript
// 既存のクエリパラメータを保持
this.router.navigate(['/other-page'], {
  queryParamsHandling: 'preserve'  // または 'merge'
});
```

## 演習問題

### 初級
1. 検索フォームを実装し、クエリパラメータで検索条件を渡してください

### 中級
2. ページネーションを実装してください（クエリパラメータで page を管理）

### 上級
3. 複数のフィルタ条件を組み合わせた検索機能を実装してください

## 実行方法

### 初回セットアップ
```bash
cd 01-basic/query-parameters
npm install
```

### 開発サーバーの起動
```bash
npm start
# または
ng serve --port 4203
```

**注意:** このサンプルはポート4203で起動します

ブラウザで `http://localhost:4203` を開いてください。

### ビルド（本番用）
```bash
npm run build
```

### 動作確認のポイント
1. **クエリパラメータの設定**
   - ホームページのリンクやボタンをクリック
   - URLに `?category=electronics` などが追加されることを確認

2. **クエリパラメータの取得**
   - 検索ページや商品一覧ページで、クエリパラメータが正しく取得・表示されることを確認

3. **フィルタリング機能**
   - 商品一覧ページでカテゴリやソート順を変更
   - URLが更新され、商品の表示が変わることを確認

4. **ページネーション**
   - 検索結果のページ番号をクリック
   - URLの `page` パラメータが変わることを確認

## 次のステップ

次は [route-configuration](../route-configuration/README.md) で、ルート設定の詳細を学びます。
