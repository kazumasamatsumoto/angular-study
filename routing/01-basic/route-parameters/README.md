# ルートパラメータ（Route Parameters）

このセクションでは、動的なルートパラメータの定義と取得方法を学びます。

## 学習内容

1. **動的ルートパラメータの定義**
2. **ActivatedRoute によるパラメータ取得**
3. **snapshot vs Observable**
4. **複数のパラメータの扱い**

## ルートパラメータとは？

URLの一部を変数として扱う仕組みです。例えば:
- `/products/123` → 商品ID: 123
- `/users/john/posts/456` → ユーザー名: john, 投稿ID: 456

## 実装例

### 1. ルートパラメータの定義

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserPostComponent } from './components/user-post/user-post.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'users/:username', component: UserProfileComponent },
  { path: 'users/:username/posts/:postId', component: UserPostComponent }
];
```

### 2. snapshot を使ったパラメータ取得

**product-detail.component.ts**
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  product: Product | null = null;
  productId: string = '';

  // ダミーデータ
  private products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000, description: '高性能なノートパソコン' },
    { id: 2, name: 'マウス', price: 3000, description: 'ワイヤレスマウス' },
    { id: 3, name: 'キーボード', price: 8000, description: 'メカニカルキーボード' }
  ];

  ngOnInit() {
    // snapshot を使った取得（初回のみ）
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProduct(this.productId);
  }

  private loadProduct(id: string) {
    const product = this.products.find(p => p.id === Number(id));
    this.product = product || null;
  }
}
```

### 3. Observable を使ったパラメータ取得（推奨）

**user-profile.component.ts**
```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  user: User | null = null;
  username: string = '';

  // ダミーデータ
  private users: User[] = [
    { username: 'john', name: 'John Doe', email: 'john@example.com', bio: 'Web Developer' },
    { username: 'jane', name: 'Jane Smith', email: 'jane@example.com', bio: 'UI/UX Designer' },
    { username: 'bob', name: 'Bob Johnson', email: 'bob@example.com', bio: 'Backend Engineer' }
  ];

  ngOnInit() {
    // Observable を使った取得（パラメータ変更を監視）
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.username = params.get('username') || '';
        this.loadUser(this.username);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser(username: string) {
    const user = this.users.find(u => u.username === username);
    this.user = user || null;
  }
}
```

### 4. 複数のパラメータを扱う

**user-post.component.ts**
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-user-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (post) {
      <div class="post-detail">
        <div class="breadcrumb">
          <a routerLink="/users/{{ username }}">{{ username }}</a>
          <span> / </span>
          <span>投稿 #{{ postId }}</span>
        </div>

        <h2>{{ post.title }}</h2>
        <p class="author">投稿者: {{ post.username }}</p>
        <div class="content">{{ post.content }}</div>

        <div class="actions">
          <a routerLink="/users/{{ username }}" class="btn">ユーザーページに戻る</a>
        </div>
      </div>
    } @else {
      <div class="error">
        <h2>投稿が見つかりません</h2>
        <p>指定された投稿は存在しないか、削除されています。</p>
      </div>
    }
  `,
  styles: [`
    .post-detail {
      max-width: 800px;
      margin: 0 auto;
    }

    .breadcrumb {
      margin-bottom: 1rem;
      color: #666;
    }

    .breadcrumb a {
      color: #1976d2;
      text-decoration: none;
    }

    .author {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0 1.5rem 0;
    }

    .content {
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      line-height: 1.6;
    }

    .actions {
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: #d32f2f;
    }
  `]
})
export class UserPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  post: Post | null = null;
  username: string = '';
  postId: string = '';

  private posts: Post[] = [
    { id: 1, username: 'john', title: 'Angular入門', content: 'Angularの基本を学びましょう。' },
    { id: 2, username: 'john', title: 'TypeScript Tips', content: 'TypeScriptの便利な機能を紹介します。' },
    { id: 3, username: 'jane', title: 'UIデザインの基本', content: 'ユーザビリティを重視したデザイン。' }
  ];

  ngOnInit() {
    // 複数のパラメータを同時に取得
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.username = params.get('username') || '';
        this.postId = params.get('postId') || '';
        this.loadPost(this.username, this.postId);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(username: string, postId: string) {
    const post = this.posts.find(
      p => p.username === username && p.id === Number(postId)
    );
    this.post = post || null;
  }
}
```

### 5. 商品一覧コンポーネント

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
    }
  `]
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'ノートPC', price: 120000 },
    { id: 2, name: 'マウス', price: 3000 },
    { id: 3, name: 'キーボード', price: 8000 }
  ];
}
```

## 重要なポイント

### 1. snapshot vs Observable

**snapshot (スナップショット)**
```typescript
const id = this.route.snapshot.paramMap.get('id');
```
- ✅ シンプルで読みやすい
- ❌ パラメータの変更を検知できない
- 使用例: コンポーネントが破棄・再生成される場合

**Observable (推奨)**
```typescript
this.route.paramMap.subscribe(params => {
  const id = params.get('id');
});
```
- ✅ パラメータの変更を検知できる
- ✅ 同じコンポーネント内での遷移に対応
- ⚠️ メモリリークに注意（unsubscribe が必要）

### 2. いつ Observable を使うべきか？

同じコンポーネントで異なるパラメータに遷移する場合:
```
/products/1 → /products/2 (同じコンポーネント)
```

この場合、Angularはコンポーネントを再生成せず、パラメータだけ変更します。
snapshot では変更を検知できません。

### 3. メモリリーク対策

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.route.paramMap
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => { /* ... */ });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## よくある間違い

❌ **間違い**: params を直接使用
```typescript
this.route.snapshot.params['id']  // 非推奨
```

✅ **正しい**: paramMap を使用
```typescript
this.route.snapshot.paramMap.get('id')  // 推奨
```

❌ **間違い**: Observable の購読解除を忘れる
```typescript
this.route.paramMap.subscribe(params => { /* ... */ });  // メモリリーク
```

✅ **正しい**: takeUntil でクリーンアップ
```typescript
this.route.paramMap
  .pipe(takeUntil(this.destroy$))
  .subscribe(params => { /* ... */ });
```

## 演習問題

### 初級
1. カテゴリページを作成してください
   - パス: `/categories/:categoryName`
   - パラメータからカテゴリ名を取得して表示

2. 商品詳細ページに「前へ」「次へ」ボタンを追加してください
   - 同じコンポーネント内で別の商品に遷移
   - Observable を使ってパラメータ変更を検知

### 中級
3. パラメータのバリデーションを実装してください
   - 数値以外のIDは404ページにリダイレクト
   - 存在しない商品IDも404にリダイレクト

4. ブログシステムを作成してください
   - `/blog/:year/:month/:slug` 形式
   - 複数のパラメータを扱う

### 上級
5. パラメータからAPIデータを取得してください
   - HTTPクライアントを使用
   - ローディング状態とエラーハンドリング

## 実行方法

### 初回セットアップ
```bash
cd 01-basic/route-parameters
npm install
```

### 開発サーバーの起動
```bash
npm start
# または
ng serve --port 4202
```

**注意:** このサンプルはポート4202で起動します

ブラウザで `http://localhost:4202` を開いてください。

### ビルド（本番用）
```bash
npm run build
```

### 動作確認のポイント
1. **ルートパラメータの取得**
   - 商品一覧から商品詳細に遷移し、URLの `:id` 部分が正しく取得されることを確認
   - 商品詳細ページで取得したIDが表示されることを確認

2. **複数パラメータ**
   - ユーザープロフィールから投稿詳細に遷移
   - URL `/users/:username/posts/:postId` の両方のパラメータが取得されることを確認

3. **Observable によるパラメータ変更検知**
   - ユーザープロフィールページで「他のユーザー」ボタンをクリック
   - 同じコンポーネント内でパラメータが変更され、表示が更新されることを確認

4. **「前へ」「次へ」ボタン**
   - 商品詳細ページで「前の商品」「次の商品」ボタンをクリック
   - 同じコンポーネント内で別の商品に遷移すること確認

## 次のステップ

次は [query-parameters](../query-parameters/README.md) で、クエリパラメータの使い方を学びます。
