# 遅延ローディング（Lazy Loading）

Angularの遅延ローディングを使用して、アプリケーションの初期ロード時間を短縮する方法を学びます。

## 学習内容

1. **遅延ローディングの基礎**
   - `loadChildren`による動的インポート
   - 機能モジュールの分割
   - 初期バンドルサイズの最適化

2. **遅延ローディングの実装パターン**
   - ルート設定での`loadChildren`
   - 独立したルート設定ファイル
   - Standalone Componentでの遅延ローディング

3. **プリロード戦略との組み合わせ**
   - デフォルトの挙動（遅延ロード）
   - プリロード戦略の選択

4. **ルートガードとの組み合わせ**
   - 遅延ロードされたルートでのガード適用
   - 認証チェックとの統合

## 実装例

### 1. 遅延ローディングのルート設定

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // 遅延ローディング: 管理画面モジュール
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

  // 遅延ローディング: ユーザーモジュール
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  },

  // 遅延ローディング: ダッシュボードモジュール
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
```

### 2. 遅延ロードされたモジュールのルート

**features/admin/admin.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard.component';
import { UserListComponent } from './pages/user-list.component';
import { SettingsComponent } from './pages/settings.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
```

### 3. Standalone Componentでの遅延ローディング

```typescript
// 単一コンポーネントの遅延ローディング
{
  path: 'profile',
  loadComponent: () => import('./pages/profile.component')
    .then(m => m.ProfileComponent)
}
```

## 重要なポイント

### 1. バンドルサイズの確認

```bash
# ビルドしてバンドルサイズを確認
npm run build

# 出力例:
# Initial chunk files   | Names         |  Raw size
# main-XXXXX.js        | main          | 150.23 kB
# admin-XXXXX.js       | admin         |  85.42 kB (lazy)
# user-XXXXX.js        | user          |  45.67 kB (lazy)
```

### 2. 遅延ローディングのメリット

✅ **初期ロード時間の短縮**
- 必要なコードのみを最初にロード
- ユーザーが実際にアクセスしたときに機能をロード

✅ **バンドルサイズの最適化**
- 機能ごとに分割されたチャンク
- 並列ダウンロードが可能

✅ **メモリ使用量の削減**
- 使用していない機能のメモリを消費しない

### 3. ルートガードとの組み合わせ

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadChildren: () => import('./features/admin/admin.routes')
    .then(m => m.ADMIN_ROUTES)
}
```

ガードが実行されて`false`を返した場合、モジュールはロードされません。

### 4. プリロード戦略

```typescript
// app.config.ts
import { PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // 全モジュールをプリロード
    )
  ]
};
```

## パフォーマンス比較

### 遅延ローディングなし
```
初期バンドル: 500 kB
初期ロード時間: 2.5秒
```

### 遅延ローディングあり
```
初期バンドル: 150 kB
初期ロード時間: 0.8秒
各機能モジュール: 50-100 kB (必要時にロード)
```

## よくある間違い

❌ **間違い**: すべてを遅延ローディングする
```typescript
// ホームページまで遅延ローディングすると初期表示が遅くなる
{
  path: 'home',
  loadChildren: () => import('./pages/home/home.routes')
}
```

✅ **正しい**: 初期表示に必要なものは即座にロード
```typescript
// ホームページは通常のインポート
{
  path: 'home',
  component: HomeComponent  // 即座にロード
}

// 管理画面などは遅延ローディング
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes')
}
```

## デモの使い方

1. **初期ロード時間を確認**
   - ブラウザの開発者ツールを開く
   - Networkタブで初期ロードされるファイルを確認

2. **遅延ロードの動作を確認**
   - 管理画面リンクをクリック
   - Networkタブで新しいJSファイルがロードされるのを確認

3. **バンドルサイズを比較**
   - `npm run build`を実行
   - dist フォルダ内のファイルサイズを確認

## 演習問題

### 初級
1. 新しい機能モジュール「Products」を遅延ローディングで追加してください
   - パス: `/products`
   - 商品一覧、商品詳細ページを含む

### 中級
2. ルートガードと組み合わせた遅延ローディングを実装してください
   - 認証されたユーザーのみがアクセスできる機能
   - 認証されていない場合はログインページにリダイレクト

### 上級
3. カスタムプリロード戦略を実装してください
   - `data.preload: true`が設定されたルートのみプリロード
   - ネットワーク接続状態に応じてプリロードを制御

## 実行方法

```bash
cd 03-advanced/lazy-loading
npm install
npm start
# または
ng serve --port 6201
```

ブラウザで `http://localhost:6201` を開いてください。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/lazy-loading` に出力されます。

## 次のステップ

次は [custom-matchers](../custom-matchers/README.md) で、カスタムルートマッチングを学びます。
