# カスタムルートマッチング（Custom Route Matching）

Angularのカスタムマッチャーを使用して、柔軟で複雑なURLパターンを処理する方法を学びます。

## 学習内容

1. **カスタムマッチャーの基礎**
   - `matcher`関数の仕組み
   - `UrlSegment`の理解
   - `UrlMatchResult`の作成

2. **実用的なカスタムマッチャー**
   - 言語プレフィックス（/en/products, /ja/products）
   - バージョン付きURL（/v1/api, /v2/api）
   - 複雑なパターンマッチング

3. **カスタムマッチャーの応用**
   - 動的なルート生成との組み合わせ
   - パラメータの抽出とバリデーション
   - フォールバック処理

## カスタムマッチャーとは？

通常のルート設定では`path`文字列でURLパターンを定義しますが、カスタムマッチャーを使うとプログラマティックにURLをマッチングできます。

### 通常のルート vs カスタムマッチャー

```typescript
// 通常のルート
{
  path: 'products/:id',
  component: ProductComponent
}

// カスタムマッチャー
{
  matcher: (url) => {
    // 複雑なマッチングロジック
    return url.length === 2 && url[0].path === 'products'
      ? { consumed: url, posParams: { id: url[1] } }
      : null;
  },
  component: ProductComponent
}
```

## 実装例

### 1. 基本的なカスタムマッチャー

**matchers/product.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function productMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // /products/:id のパターンにマッチ
  if (url.length === 2 && url[0].path === 'products') {
    return {
      consumed: url,
      posParams: {
        id: url[1]
      }
    };
  }

  return null;
}
```

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { productMatcher } from './matchers/product.matcher';

export const routes: Routes = [
  {
    matcher: productMatcher,
    component: ProductComponent
  }
];
```

### 2. 言語プレフィックスのマッチャー

多言語サイトで `/en/products`, `/ja/products` などのパターンを処理します。

**matchers/i18n.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

const supportedLanguages = ['en', 'ja', 'zh', 'ko'];

export function i18nMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // 最低2つのセグメントが必要（言語 + パス）
  if (url.length < 2) {
    return null;
  }

  const language = url[0].path;

  // サポートされている言語かチェック
  if (!supportedLanguages.includes(language)) {
    return null;
  }

  // 言語セグメントを消費し、残りを返す
  return {
    consumed: [url[0]],
    posParams: {
      lang: url[0]
    }
  };
}
```

**使用例**
```typescript
{
  matcher: i18nMatcher,
  children: [
    { path: 'products', component: ProductListComponent },
    { path: 'about', component: AboutComponent }
  ]
}
```

このマッチャーは以下のURLにマッチします：
- `/en/products` → 言語: en, ページ: products
- `/ja/about` → 言語: ja, ページ: about
- `/zh/products` → 言語: zh, ページ: products

### 3. APIバージョン管理のマッチャー

**matchers/api-version.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function apiVersionMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // /v{number}/api のパターンをマッチ
  if (url.length >= 2 && url[1].path === 'api') {
    const versionMatch = url[0].path.match(/^v(\d+)$/);

    if (versionMatch) {
      return {
        consumed: url.slice(0, 2),
        posParams: {
          version: new UrlSegment(versionMatch[1], {})
        }
      };
    }
  }

  return null;
}
```

**使用例**
```typescript
{
  matcher: apiVersionMatcher,
  children: [
    { path: 'users', component: ApiUsersComponent },
    { path: 'posts', component: ApiPostsComponent }
  ]
}
```

マッチするURL：
- `/v1/api/users` → version: 1
- `/v2/api/posts` → version: 2
- `/v3/api/users` → version: 3

### 4. 日付ベースのマッチャー

ブログやニュースサイトで `/2024/03/20/article-title` のようなURLを処理します。

**matchers/date.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function dateMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // /YYYY/MM/DD/slug のパターン
  if (url.length !== 4) {
    return null;
  }

  const year = url[0].path;
  const month = url[1].path;
  const day = url[2].path;
  const slug = url[3].path;

  // 年月日の形式をバリデーション
  if (!/^\d{4}$/.test(year) ||
      !/^\d{2}$/.test(month) ||
      !/^\d{2}$/.test(day)) {
    return null;
  }

  // 月と日の範囲チェック
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      year: url[0],
      month: url[1],
      day: url[2],
      slug: url[3]
    }
  };
}
```

**使用例**
```typescript
{
  matcher: dateMatcher,
  component: BlogPostComponent
}
```

### 5. ファイル拡張子のマッチャー

特定の拡張子を持つURLを処理します。

**matchers/file-extension.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function fileExtensionMatcher(
  extensions: string[]
): (url: UrlSegment[]) => UrlMatchResult | null {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    if (url.length === 0) {
      return null;
    }

    const lastSegment = url[url.length - 1].path;
    const parts = lastSegment.split('.');

    if (parts.length < 2) {
      return null;
    }

    const extension = parts[parts.length - 1];

    if (!extensions.includes(extension)) {
      return null;
    }

    const filename = parts.slice(0, -1).join('.');

    return {
      consumed: url,
      posParams: {
        filename: new UrlSegment(filename, {}),
        extension: new UrlSegment(extension, {})
      }
    };
  };
}
```

**使用例**
```typescript
{
  matcher: fileExtensionMatcher(['pdf', 'doc', 'xlsx']),
  component: FileViewerComponent
}
```

マッチするURL：
- `/documents/report.pdf` → filename: report, extension: pdf
- `/files/data.xlsx` → filename: data, extension: xlsx

## 複数条件のマッチャー

### 条件を組み合わせたマッチャー

**matchers/complex.matcher.ts**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function complexMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // /category/{category}/products/{id}/reviews のパターン
  if (url.length !== 5 ||
      url[0].path !== 'category' ||
      url[2].path !== 'products' ||
      url[4].path !== 'reviews') {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      category: url[1],
      productId: url[3]
    }
  };
}
```

## カスタムマッチャーのデバッグ

**デバッグ用のマッチャーラッパー**
```typescript
import { UrlSegment, UrlMatchResult } from '@angular/router';

export function debugMatcher(
  name: string,
  matcher: (url: UrlSegment[]) => UrlMatchResult | null
) {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    const urlPath = url.map(s => s.path).join('/');
    console.log(`[${name}] Matching: /${urlPath}`);

    const result = matcher(url);

    if (result) {
      console.log(`[${name}] ✓ Matched`, result);
    } else {
      console.log(`[${name}] ✗ No match`);
    }

    return result;
  };
}
```

**使用例**
```typescript
{
  matcher: debugMatcher('ProductMatcher', productMatcher),
  component: ProductComponent
}
```

## ベストプラクティス

### 1. パフォーマンス

✅ **Good**: 早期リターン
```typescript
export function fastMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // 最初にシンプルなチェック
  if (url.length === 0) return null;
  if (url[0].path !== 'expected') return null;

  // 複雑な処理は必要な時だけ
  return complexMatching(url);
}
```

❌ **Bad**: 不要な処理
```typescript
export function slowMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // 毎回複雑な処理を実行
  const result = expensiveOperation(url);
  if (!result) return null;
  // ...
}
```

### 2. バリデーション

```typescript
export function validatingMatcher(url: UrlSegment[]): UrlMatchResult | null {
  if (url.length !== 2) return null;

  const id = url[1].path;

  // IDの形式をバリデーション
  if (!/^\d+$/.test(id)) {
    console.warn(`Invalid ID format: ${id}`);
    return null;
  }

  return {
    consumed: url,
    posParams: { id: url[1] }
  };
}
```

### 3. 再利用可能なマッチャー

```typescript
export function createPathMatcher(
  prefix: string,
  paramName: string
): (url: UrlSegment[]) => UrlMatchResult | null {
  return (url: UrlSegment[]): UrlMatchResult | null => {
    if (url.length !== 2 || url[0].path !== prefix) {
      return null;
    }

    return {
      consumed: url,
      posParams: {
        [paramName]: url[1]
      }
    };
  };
}

// 使用例
const userMatcher = createPathMatcher('users', 'userId');
const postMatcher = createPathMatcher('posts', 'postId');
```

## よくあるユースケース

### 1. サブドメインルーティング

```typescript
// URLから情報を抽出してルートパラメータに
export function subdomainMatcher(url: UrlSegment[]): UrlMatchResult | null {
  const subdomain = window.location.hostname.split('.')[0];

  if (subdomain === 'www' || subdomain === 'localhost') {
    return null;
  }

  return {
    consumed: url,
    posParams: {
      tenant: new UrlSegment(subdomain, {})
    }
  };
}
```

### 2. レガシーURL対応

```typescript
// 古いURL形式をサポート
export function legacyMatcher(url: UrlSegment[]): UrlMatchResult | null {
  // /old-products/123 → /products/123
  if (url.length === 2 && url[0].path === 'old-products') {
    return {
      consumed: url,
      posParams: {
        id: url[1]
      }
    };
  }

  return null;
}
```

## 演習問題

### 初級
1. `/users/:id/profile` パターンにマッチするカスタムマッチャーを作成してください
2. デバッグ出力を追加して、マッチング過程を確認してください

### 中級
3. `/blog/:year/:month` パターンで、年月のバリデーションを含むマッチャーを実装してください
4. クエリパラメータに基づいてマッチングを変更するマッチャーを作成してください

### 上級
5. 複数の条件（言語、バージョン、カテゴリ）を組み合わせたマッチャーを実装してください
6. カスタムマッチャーとルートガードを組み合わせた認証フローを実装してください

## 次のステップ

次は [preloading-strategies](../preloading-strategies/README.md) で、プリロード戦略を学びます。
