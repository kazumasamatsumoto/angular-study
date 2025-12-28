# CanActivate ルートガード - 認証・認可のデモ

## 概要

このプロジェクトは、Angularの`CanActivate`ガードを使用した認証・認可の実装例です。
ルートへのアクセス前にユーザーの認証状態や権限を確認し、適切なページにリダイレクトする方法を学べます。

## 主な機能

### 1. 認証ガード (authGuard)
- ユーザーがログインしているかをチェック
- 未認証の場合、ログインページにリダイレクト
- ログイン後、元のページに自動的に戻る機能

### 2. 権限ガード (adminGuard)
- ユーザーが管理者権限を持っているかをチェック
- 権限がない場合、ダッシュボードにリダイレクト
- 複数ガードの組み合わせ

### 3. 認証サービス (AuthService)
- ログイン/ログアウト機能
- ユーザー情報の管理（Signalを使用）
- ローカルストレージへの保存/復元

## 実装のポイント

### 1. 関数型ガード (CanActivateFn)

Angular 14以降の推奨スタイル：

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
```

### 2. inject関数によるDI

関数型ガードでは`inject`関数を使ってサービスを注入：

```typescript
const authService = inject(AuthService);
const router = inject(Router);
```

### 3. 複数ガードの適用

配列で複数のガードを指定：

```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, adminGuard]  // 順番に実行される
}
```

### 4. Signalによる状態管理

リアクティブな認証状態の管理：

```typescript
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
}
```

### 5. リダイレクト処理

ログイン後、元のページに戻る：

```typescript
// ガード側
router.navigate(['/login'], {
  queryParams: { returnUrl: state.url }
});

// ログインコンポーネント側
const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
this.router.navigateByUrl(returnUrl);
```

## ディレクトリ構造

```
src/app/
├── guards/
│   ├── auth.guard.ts      # 認証ガード
│   └── admin.guard.ts     # 権限ガード
├── services/
│   └── auth.service.ts    # 認証サービス
├── pages/
│   ├── home/              # ホームページ
│   ├── login/             # ログインページ
│   ├── dashboard/         # ダッシュボード（認証必要）
│   └── admin/             # 管理画面（管理者権限必要）
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
ng serve --port 5201
```

ブラウザで `http://localhost:5201` を開く

### ビルド

```bash
npm run build
```

## デモ用アカウント

### 管理者アカウント
- **ユーザー名:** `admin`
- **パスワード:** `password`
- **権限:** 管理者（すべてのページにアクセス可能）

### 一般ユーザーアカウント
- **ユーザー名:** `user`
- **パスワード:** `password`
- **権限:** 一般ユーザー（ダッシュボードまでアクセス可能、管理画面は不可）

## 動作確認手順

### 1. 認証ガードの確認

1. ログインせずに「ダッシュボード」をクリック
2. → ログインページにリダイレクトされる
3. ログイン後、ダッシュボードに自動的に遷移する

### 2. 権限ガードの確認

1. `user`でログインする
2. 「管理画面」をクリック
3. → 「管理者権限が必要です」というアラートが表示され、ダッシュボードにリダイレクトされる
4. ログアウトして`admin`でログインし直す
5. 「管理画面」をクリック
6. → 管理画面にアクセスできる

### 3. リダイレクト機能の確認

1. ログアウトした状態で、URLに直接`/dashboard`を入力
2. → ログインページにリダイレクトされる（URLパラメータに`returnUrl`が付与される）
3. ログインする
4. → ダッシュボードに自動的に遷移する

## 重要なコンセプト

### CanActivate とは

- ルートをアクティブ化（表示）する前に実行されるガード
- `true`を返すとアクセスを許可、`false`を返すとアクセスを拒否
- `UrlTree`を返すと、指定したURLにリダイレクト

### ガードの実行順序

複数のガードが指定されている場合、配列の順番に実行される：

```typescript
canActivate: [authGuard, adminGuard]
// 1. authGuard実行 → 2. adminGuard実行
```

どれか1つでも`false`を返すと、その時点でアクセスが拒否される。

### inject関数

Angular 14以降で導入された関数型の依存性注入：

```typescript
// 旧スタイル（クラスベース）
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate() { ... }
}

// 新スタイル（関数ベース）
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  ...
};
```

## 演習問題

### 初級

1. **セッションタイムアウト実装**
   - 一定時間経過後、自動的にログアウトする機能を追加
   - ヒント: `setTimeout`とAuthServiceを組み合わせる

2. **ログイン試行回数制限**
   - 3回失敗したらアカウントをロックする機能を追加
   - ヒント: カウンターをlocalStorageに保存

### 中級

3. **役割ベースのアクセス制御（RBAC）**
   - `editor`, `viewer`, `admin`など複数の役割を追加
   - 役割ごとに異なるページへのアクセス権を設定
   - ヒント: 汎用的な`roleGuard`を作成

4. **トークンベース認証**
   - JWTトークンを使った認証に変更
   - ヒント: トークンをlocalStorageに保存し、有効期限をチェック

### 上級

5. **権限の動的チェック**
   - ルート設定の`data`プロパティで必要な権限を定義
   - ガードで動的に権限をチェック
   ```typescript
   {
     path: 'admin',
     component: AdminComponent,
     canActivate: [permissionGuard],
     data: { requiredPermissions: ['admin', 'superuser'] }
   }
   ```

6. **非同期認証チェック**
   - バックエンドAPIでトークンの有効性を確認
   - ヒント: ガードから`Observable<boolean>`を返す

## 実務での応用例

### 1. エンタープライズアプリケーション

```typescript
// 複雑な権限チェック
export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const requiredPermissions = route.data['requiredPermissions'] as string[];

  return authService.hasPermissions(requiredPermissions);
};
```

### 2. マルチテナント対応

```typescript
// テナントごとのアクセス制御
export const tenantGuard: CanActivateFn = (route) => {
  const tenantService = inject(TenantService);
  const tenantId = route.params['tenantId'];

  return tenantService.canAccessTenant(tenantId);
};
```

### 3. 機能フラグによる制御

```typescript
// 機能フラグでページの有効/無効を制御
export const featureGuard: CanActivateFn = (route) => {
  const featureService = inject(FeatureService);
  const featureName = route.data['feature'] as string;

  return featureService.isFeatureEnabled(featureName);
};
```

## トラブルシューティング

### ガードが実行されない

- ルート設定で`canActivate`が正しく指定されているか確認
- ガードが`providers`に登録されているか確認（関数型ガードは不要）

### 無限リダイレクトループ

- リダイレクト先のルートにもガードが適用されていないか確認
- ログインページにはガードを適用しない

### ログイン状態が保持されない

- AuthServiceが`providedIn: 'root'`で提供されているか確認
- ローカルストレージへの保存/復元処理が正しく実装されているか確認

## 参考リンク

- [Angular Router Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [CanActivate API](https://angular.dev/api/router/CanActivate)
- [inject Function](https://angular.dev/api/core/inject)
- [Angular Signals](https://angular.dev/guide/signals)

## まとめ

このデモで学べること：

- ✅ CanActivateガードの基本的な使い方
- ✅ 認証・認可の実装パターン
- ✅ 関数型ガードとinject関数の使用
- ✅ 複数ガードの組み合わせ
- ✅ リダイレクト処理の実装
- ✅ Signalを使った状態管理

これらの知識は、実務でのセキュアなアプリケーション開発に直接役立ちます。
