# 基礎編（Basic） - Angular Routing

このセクションでは、Angular Routingの基礎的な概念と機能を学びます。

## 学習内容

### 1. ルーティングの基本設定（Basic Routing Setup）
- Angular Routerの導入方法
- `app-routing.module.ts` の作成と設定
- 基本的なルート定義（`path` と `component`）
- `router-outlet` の使用方法
- ルーティングモジュールの設定

### 2. ナビゲーション（Navigation）
- `routerLink` ディレクティブの使用方法
- `router.navigate()` メソッドによるプログラム的なナビゲーション
- `routerLinkActive` によるアクティブなリンクのスタイリング
- 絶対パスと相対パスでのナビゲーション

### 3. ルートパラメータ（Route Parameters）
- 動的ルートパラメータの定義（`:id`）
- `ActivatedRoute` サービスによるパラメータの取得
- `snapshot` と `params` Observable の使い分け
- 複数のパラメータの扱い方

### 4. クエリパラメータ（Query Parameters）
- クエリパラメータの設定方法
- `queryParams` によるクエリパラメータの渡し方
- `ActivatedRoute.queryParams` による取得方法
- オプショナルパラメータとしての活用

### 5. ルート設定の詳細（Route Configuration Details）
- `pathMatch` オプション（`full` と `prefix`）
- リダイレクトの設定方法
- ワイルドカードルート（`**`）の使用方法
- 404ページの実装

### 6. ネストされたルートの基礎（Basic Nested Routes）
- 子ルートの定義方法
- ネストされた `router-outlet` の配置
- 親ルートと子ルートの関係性

## 実装例の構造

```
01-basic/
├── basic-routing/              # 基本的なルーティング設定
├── navigation/                 # ナビゲーション方法
├── route-parameters/           # ルートパラメータの使用
├── query-parameters/           # クエリパラメータの使用
├── route-configuration/        # ルート設定の詳細
└── nested-routes-basic/        # ネストされたルートの基礎
```

## 学習目標

このセクションを完了すると、以下のことができるようになります：

- ✅ Angular Routerの基本的な設定ができる
- ✅ ルートを定義し、コンポーネントを表示できる
- ✅ ユーザーがナビゲーションできる機能を実装できる
- ✅ ルートパラメータとクエリパラメータを適切に使用できる
- ✅ 基本的なリダイレクトや404ページを実装できる
- ✅ シンプルなネストされたルートを理解し、実装できる

