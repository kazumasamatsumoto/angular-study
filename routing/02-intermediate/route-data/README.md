# Route Data - ルートメタデータの活用

## 概要

このプロジェクトは、Angularのルート設定における`data`プロパティの活用方法を示すデモです。
パンくずリスト、ページタイトルの動的設定、カスタムメタデータの利用など、実務で役立つパターンを学べます。

## 主な機能

### 1. パンくずリスト
- ルートのdataからbreadcrumbを取得
- ルートツリーを辿って自動生成
- ネストされたルートにも対応

### 2. ページタイトルの動的設定
- ルート遷移時に自動的にブラウザタイトルを更新
- SEO対策に有効

### 3. カスタムメタデータ
- 独自のメタデータを定義
- 認証制御、SEO、UI制御など多様な用途に活用

## 実装のポイント

### 1. Route Dataの設定

```typescript
// app.routes.ts
{
  path: 'products',
  component: ProductListComponent,
  data: {
    title: '商品一覧',
    breadcrumb: '商品一覧',
    icon: '🛍️',
    description: 'すべての商品を表示',
    animation: 'ProductListPage'
  }
}
```

### 2. コンポーネントでのデータ取得

```typescript
export class ProductListComponent {
  private route = inject(ActivatedRoute);
  routeData = this.route.snapshot.data;

  ngOnInit() {
    console.log(this.routeData['title']);  // '商品一覧'
    console.log(this.routeData['icon']);   // '🛍️'
  }
}
```

### 3. パンくずリストの自動生成

```typescript
private buildBreadcrumbs(): void {
  const breadcrumbs: Breadcrumb[] = [];
  let currentRoute = this.activatedRoute.root;
  let url = '';

  while (currentRoute) {
    const breadcrumbLabel = currentRoute.snapshot.data['breadcrumb'];
    if (breadcrumbLabel) {
      breadcrumbs.push({
        label: breadcrumbLabel,
        url: url
      });
    }
    currentRoute = currentRoute.firstChild!;
  }

  this.breadcrumbs.set(breadcrumbs);
}
```

### 4. ページタイトルの自動更新

```typescript
this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
).subscribe(() => {
  let route = this.router.routerState.root;
  while (route.firstChild) {
    route = route.firstChild;
    const title = route.snapshot.data['title'];
    if (title) {
      this.titleService.setTitle(title + ' - My App');
    }
  }
});
```

## ディレクトリ構造

```
src/app/
├── components/
│   └── breadcrumb/
│       └── breadcrumb.component.ts  # パンくずリストコンポーネント
├── pages/
│   ├── home/                        # ホームページ
│   ├── product-list/                # 商品一覧
│   ├── product-detail/              # 商品詳細
│   ├── about/                       # 会社概要
│   └── contact/                     # お問い合わせ
├── app.component.ts
└── app.routes.ts
```

## 実行方法

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm start
# または
ng serve --port 5204
```

ブラウザで `http://localhost:5204` を開く

### ビルド

```bash
npm run build
```

## 動作確認手順

### 1. パンくずリストの確認

1. 「商品一覧」をクリック
2. → パンくずリストに「ホーム › 商品一覧」と表示
3. 商品の「詳細を見る」をクリック
4. → パンくずリストに「ホーム › 商品一覧 › 商品詳細」と表示

### 2. ページタイトルの確認

1. 各ページに移動
2. ブラウザのタブタイトルが変わることを確認
3. 例: 「商品一覧 - Route Data Demo」

### 3. Route Dataの確認

1. 各ページで「現在のRoute Data」セクションを確認
2. 設定されているメタデータが表示される

## 重要なコンセプト

### Route Data とは

- ルート設定に静的データを付加する機能
- コンポーネントやガードから簡単にアクセス可能
- SEO、UI制御、分析など多様な用途に活用

### Route Dataの利点

1. **一元管理**
   - ルート設定にメタデータを集約
   - 見通しの良いコード

2. **型安全性**
   - TypeScriptの型定義が可能
   - コンパイル時のチェック

3. **再利用性**
   - 同じデータを複数の場所で利用
   - DRY原則の実践

4. **保守性**
   - メタデータの変更が容易
   - 一箇所の修正で全体に反映

### ネストされたルート

親ルートと子ルートの両方にRoute Dataを設定可能：

```typescript
{
  path: 'products',
  data: { breadcrumb: '商品一覧' },  // 親
  children: [
    {
      path: ':id',
      data: { breadcrumb: '商品詳細' }  // 子
    }
  ]
}
```

## 演習問題

### 初級

1. **サイトマップコンポーネントの作成**
   - すべてのルートを一覧表示
   - ヒント: Router.configを参照

2. **ページ説明文の表示**
   - descriptionメタデータを活用
   - ヒント: route.snapshot.data['description']

### 中級

3. **メタタグの動的設定**
   - Meta serviceを使用
   ```typescript
   constructor(private meta: Meta) {}

   ngOnInit() {
     const description = this.route.snapshot.data['description'];
     this.meta.updateTag({ name: 'description', content: description });
   }
   ```

4. **階層的なページアイコン**
   - パンくずリストに各ページのアイコンを表示
   - ヒント: breadcrumbと一緒にiconも収集

### 上級

5. **動的なRoute Data**
   - Resolverと組み合わせて動的データを設定
   ```typescript
   resolve: {
     product: productResolver,
     metadata: metadataResolver
   }
   ```

6. **アニメーション設定**
   - Route Dataのanimationプロパティを使用
   - ページ遷移時のアニメーションを制御
   ```typescript
   @HostBinding('@routeAnimation')
   get routeAnimation() {
     return this.route.snapshot.data['animation'];
   }
   ```

## 実務での応用例

### 1. SEO最適化

```typescript
{
  path: 'blog/:slug',
  component: BlogPostComponent,
  data: {
    title: 'ブログ記事',
    metaTags: {
      description: '最新のブログ記事',
      keywords: 'Angular, TypeScript, Web開発',
      ogImage: '/assets/blog-og.jpg'
    }
  }
}
```

### 2. 権限ベースのアクセス制御

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard],
  data: {
    requiredRoles: ['admin', 'superuser'],
    requiredPermissions: ['users.manage']
  }
}
```

### 3. レイアウト切り替え

```typescript
{
  path: 'checkout',
  component: CheckoutComponent,
  data: {
    layout: 'minimal',  // ヘッダー・フッターなし
    hideNavigation: true
  }
}
```

### 4. アナリティクス

```typescript
{
  path: 'products/:id',
  component: ProductDetailComponent,
  data: {
    pageCategory: 'ecommerce',
    pageType: 'product-detail',
    trackingEnabled: true
  }
}
```

## トラブルシューティング

### Route Dataが取得できない

- `route.snapshot.data`を使用しているか確認
- ルート設定で`data`プロパティが正しく設定されているか確認

### パンくずリストが表示されない

- 各ルートに`breadcrumb`が設定されているか確認
- BreadcrumbComponentが正しく実装されているか確認

### ページタイトルが更新されない

- NavigationEndイベントを監視しているか確認
- Title serviceが正しく注入されているか確認

## 参考リンク

- [Angular Router Data](https://angular.dev/api/router/Route#data)
- [ActivatedRoute](https://angular.dev/api/router/ActivatedRoute)
- [Title Service](https://angular.dev/api/platform-browser/Title)
- [Meta Service](https://angular.dev/api/platform-browser/Meta)

## まとめ

このデモで学べること：

- ✅ Route Dataの基本的な使い方
- ✅ パンくずリストの自動生成
- ✅ ページタイトルの動的設定
- ✅ カスタムメタデータの活用
- ✅ ネストされたルートの扱い
- ✅ 実務で使える実装パターン

Route Dataを適切に活用することで、保守性が高く、SEOにも強い
Webアプリケーションを構築できます。
