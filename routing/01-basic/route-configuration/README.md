# ルート設定の詳細（Route Configuration Details）

このセクションでは、ルート設定の詳細オプションを学びます。

## 学習内容

1. **pathMatch オプション**
2. **リダイレクト**
3. **ワイルドカードルート**
4. **404ページの実装**

## 実装例

### 1. pathMatch の使い分け

**app.routes.ts**
```typescript
export const routes: Routes = [
  // full: パス全体が一致する場合のみマッチ
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // prefix（デフォルト）: パスの先頭が一致すればマッチ
  { path: 'products', component: ProductListComponent }
];
```

### 2. リダイレクト

```typescript
export const routes: Routes = [
  // 基本的なリダイレクト
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // 古いパスから新しいパスへ
  { path: 'old-path', redirectTo: '/new-path' },

  // ネストしたパスへのリダイレクト
  { path: 'products', redirectTo: '/shop/products' }
];
```

### 3. ワイルドカードルート（404ページ）

```typescript
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  // 最後に配置
  { path: '**', component: NotFoundComponent }
];
```

**not-found.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <a routerLink="/home" class="btn">ホームに戻る</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 4rem 1rem;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #d32f2f;
    }
  `]
})
export class NotFoundComponent {}
```

## 重要なポイント

### pathMatch の挙動

```typescript
// ❌ 間違い: pathMatch を指定しないと無限ループ
{ path: '', redirectTo: '/home' }

// ✅ 正しい: full を指定
{ path: '', redirectTo: '/home', pathMatch: 'full' }
```

### ルートの順序

```typescript
// ✅ 正しい順序
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'products/:id', component: ProductDetailComponent },  // 具体的なルートを先に
  { path: 'products', component: ProductListComponent },
  { path: '**', component: NotFoundComponent }  // ワイルドカードは最後
];

// ❌ 間違い: ワイルドカードが先
export const routes: Routes = [
  { path: '**', component: NotFoundComponent },  // これ以降のルートにマッチしない
  { path: 'home', component: HomeComponent }
];
```

## 演習問題

### 初級
1. `/` にアクセスした時に `/home` にリダイレクトする設定を追加してください

### 中級
2. `/blog` にアクセスした時に外部URLにリダイレクトする機能を実装してください

### 上級
3. カスタム404ページを実装し、存在しないルートでも美しいエラー画面を表示してください

## 実行方法

```bash
cd 01-basic/route-configuration
npm install
npm start
# または
ng serve --port 4204
```

ブラウザで `http://localhost:4204` を開いてください。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/route-configuration` に出力されます。

## 次のステップ

次は [nested-routes-basic](../nested-routes-basic/README.md) で、ネストされたルートの基礎を学びます。
