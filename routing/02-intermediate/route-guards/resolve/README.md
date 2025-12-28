# Resolve Guard - データのプリロード

## 概要

このプロジェクトは、Angularの`Resolve`ガード（Resolver）を使用した、ルート遷移前のデータプリロードの実装例です。
ページ表示前にデータを取得することで、ローディング表示が不要になり、優れたUXを提供できます。

## 主な機能

### 1. 単一データの解決 (userResolver)
- ルートパラメータ（:id）を使った動的データ取得
- 存在しないIDの場合のエラーハンドリング
- ユーザー詳細ページでの活用

### 2. リストデータの解決 (usersResolver)
- 複数のデータを一括取得
- ユーザー一覧ページでの活用
- エラー時は空配列を返す

### 3. 複数データの並行取得 (dashboardDataResolver)
- `forkJoin`を使った並行API呼び出し
- 複数のデータソースを1つにまとめる
- ダッシュボードでの活用

## 実装のポイント

### 1. Resolverの基本構文

```typescript
export const userResolver: ResolveFn<User | null> = (route) => {
  const userService = inject(UserService);
  const id = Number(route.paramMap.get('id'));

  return userService.getUserById(id);
};
```

### 2. エラーハンドリング

```typescript
return userService.getUserById(id).pipe(
  catchError((error) => {
    console.error('エラー:', error);
    alert(`ユーザーID ${id} が見つかりませんでした`);
    router.navigate(['/']);
    return of(null);
  })
);
```

### 3. 複数データの並行取得

```typescript
return forkJoin({
  users: userService.getUsers(),
  stats: userService.getUserStats()
}).pipe(
  map(result => ({
    users: result.users,
    stats: result.stats,
    loading: false
  }))
);
```

### 4. ルート設定

```typescript
{
  path: 'users/:id',
  component: UserDetailComponent,
  resolve: {
    user: userResolver  // データをuserという名前で渡す
  }
}
```

### 5. コンポーネントでのデータ受け取り

```typescript
export class UserDetailComponent {
  // Resolverで取得したデータをinputで受け取る
  user = input.required<User | null>();
}
```

## ディレクトリ構造

```
src/app/
├── resolvers/
│   ├── user.resolver.ts           # 単一ユーザーResolver
│   ├── users.resolver.ts          # ユーザー一覧Resolver
│   └── dashboard-data.resolver.ts # 複数データResolver
├── services/
│   └── user.service.ts            # ユーザーサービス
├── pages/
│   ├── home/                      # ホームページ
│   ├── user-list/                 # ユーザー一覧
│   ├── user-detail/               # ユーザー詳細
│   └── dashboard/                 # ダッシュボード
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
ng serve --port 5203
```

ブラウザで `http://localhost:5203` を開く

### ビルド

```bash
npm run build
```

## 動作確認手順

### 1. ユーザー一覧

1. 「ユーザー一覧」をクリック
2. → データ取得中は何も表示されない（Resolverが実行中）
3. → データ取得完了後、ユーザー一覧が表示される
4. ブラウザコンソールで「[usersResolver] ユーザー一覧のデータを解決中...」を確認

### 2. ユーザー詳細

1. ユーザー一覧から「詳細を見る」をクリック
2. または「ユーザー詳細 #1」をクリック
3. → データ取得完了後、ユーザー詳細が表示される
4. ブラウザコンソールで「[userResolver] ユーザー #1 のデータを解決中...」を確認

### 3. 存在しないユーザー

1. URLバーで `/users/999` にアクセス
2. → エラーダイアログが表示される
3. → ホームページにリダイレクトされる

### 4. ダッシュボード

1. 「ダッシュボード」をクリック
2. → 複数のAPIが並行実行される
3. → すべてのデータ取得完了後、ダッシュボードが表示される
4. ブラウザコンソールで並行実行のログを確認

## 重要なコンセプト

### Resolve とは

- ルートをアクティブ化する前にデータを取得するガード
- データ取得完了まで、ページ遷移を遅延させる
- コンポーネントに事前にデータを渡すことができる

### Resolverの利点

1. **UX向上**
   - ページ表示時にデータが揃っている
   - ローディングスピナーが不要

2. **コードの整理**
   - データ取得ロジックを分離
   - コンポーネントがシンプルになる

3. **型安全性**
   - データの存在が保証される
   - `undefined`チェックが不要

4. **エラーハンドリング**
   - 遷移前にエラーを処理
   - 適切なページにリダイレクト可能

### Resolverを使うべき場面

✅ **使うべき:**
- マスターデータの取得
- 詳細ページのデータ取得
- ページ表示に必須のデータ

❌ **使わない方が良い:**
- 非常に大きなデータ
- 時間のかかるリクエスト
- オプショナルなデータ

### forkJoinの使い方

複数のObservableを並行実行し、すべて完了を待つ：

```typescript
forkJoin({
  data1: observable1$,
  data2: observable2$,
  data3: observable3$
}).subscribe(result => {
  console.log(result.data1);
  console.log(result.data2);
  console.log(result.data3);
});
```

注意: どれか1つでも失敗すると、全体が失敗する。

## 演習問題

### 初級

1. **キャッシュ機能の追加**
   - 一度取得したデータを再利用
   - ヒント: Serviceにキャッシュ用のMapを追加

2. **ローディングインジケーター**
   - Resolver実行中にプログレスバーを表示
   - ヒント: ルーティングイベントを監視

### 中級

3. **タイムアウト処理**
   - 一定時間でResolverをタイムアウト
   ```typescript
   return userService.getUserById(id).pipe(
     timeout(5000),
     catchError(() => of(null))
   );
   ```

4. **ページネーション対応**
   - クエリパラメータでページ番号を受け取る
   ```typescript
   const page = Number(route.queryParamMap.get('page')) || 1;
   return userService.getUsers(page);
   ```

### 上級

5. **条件付きResolver**
   - 条件によってデータ取得をスキップ
   ```typescript
   if (condition) {
     return of(null);  // データ取得をスキップ
   }
   return userService.getData();
   ```

6. **階層的データ取得**
   - 親データ取得後、その結果を使って子データを取得
   ```typescript
   return userService.getUser(id).pipe(
     switchMap(user =>
       forkJoin({
         user: of(user),
         posts: postService.getUserPosts(user.id)
       })
     )
   );
   ```

## 実務での応用例

### 1. 認証情報の取得

```typescript
export const authResolver: ResolveFn<User | null> = () => {
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    catchError(() => {
      // 認証エラー時はログインページへ
      inject(Router).navigate(['/login']);
      return of(null);
    })
  );
};
```

### 2. マスターデータの事前ロード

```typescript
export const masterDataResolver: ResolveFn<MasterData> = () => {
  const masterService = inject(MasterService);

  return forkJoin({
    countries: masterService.getCountries(),
    categories: masterService.getCategories(),
    statuses: masterService.getStatuses()
  });
};
```

### 3. 動的メタデータの設定

```typescript
export const articleResolver: ResolveFn<Article> = (route) => {
  const articleService = inject(ArticleService);
  const title = inject(Title);
  const id = Number(route.paramMap.get('id'));

  return articleService.getArticle(id).pipe(
    tap(article => {
      title.setTitle(article.title);  // ページタイトルを設定
    })
  );
};
```

## トラブルシューティング

### Resolverが実行されない

- ルート設定で`resolve`が正しく指定されているか確認
- Resolverがエクスポートされているか確認

### データが取得できない

- Resolverがnullやundefinedを返していないか確認
- catchErrorで適切なデフォルト値を返しているか確認

### ページ遷移が遅い

- Resolverで時間のかかる処理をしていないか確認
- タイムアウト処理の追加を検討
- 必要に応じてResolverを使わずコンポーネント内で取得

### 無限ループ

- Resolver内でルーティングする場合、無限ループに注意
- リダイレクト先のルートにResolverがないことを確認

## 参考リンク

- [Angular Resolve Guard](https://angular.dev/api/router/Resolve)
- [ResolveFn](https://angular.dev/api/router/ResolveFn)
- [Route Data](https://angular.dev/api/router/Route#data)
- [RxJS forkJoin](https://rxjs.dev/api/index/function/forkJoin)

## まとめ

このデモで学べること：

- ✅ Resolverの基本的な使い方
- ✅ ルートパラメータの活用
- ✅ エラーハンドリングパターン
- ✅ 複数データの並行取得
- ✅ コンポーネントでのデータ受け取り
- ✅ 実務で使える実装パターン

Resolverを適切に使うことで、ユーザーに優れた体験を提供し、
メンテナンスしやすいコードを書くことができます。
