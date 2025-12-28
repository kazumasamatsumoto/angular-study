# 発展編（Intermediate） - Angular Routing

このセクションでは、Angular Routingの中級レベルの概念と実装方法を学びます。

## 学習内容

### 1. ルートガード（Route Guards）
- **CanActivate**: ルートへのアクセスを制御
  - 認証状態の確認
  - 権限チェック
  - 複数のガードの組み合わせ
- **CanDeactivate**: ルートからの離脱を制御
  - 未保存の変更の確認
  - 確認ダイアログの実装
- **CanActivateChild**: 子ルートへのアクセスを制御
- **Resolve**: ルート遷移前にデータを事前取得
  - データのプリロード
  - ローディング状態の管理
- **CanLoad**: 遅延ロードモジュールの読み込みを制御

### 2. アクティブルートの検出（Activated Route Detection）
- `ActivatedRoute` サービスの詳細な使用方法
- ルート階層の理解とナビゲーション
- `params`, `queryParams`, `data`, `fragment` の使い分け
- ルートスナップショット vs Observable
- ルートパラメータの変更を監視する方法

### 3. ルートデータと静的情報（Route Data）
- ルート設定での `data` プロパティの使用
- メタデータの定義と取得
- パンくずリスト（Breadcrumbs）の実装
- ページタイトルの動的設定

### 4. リダイレクトとルート解決（Redirects and Route Resolution）
- 複雑なリダイレクトロジック
- 条件付きリダイレクト
- デフォルトルートの設定
- ワイルドカードルートの高度な使用方法

### 5. ネストされたルートの高度な使用（Advanced Nested Routes）
- 複数階層のネストされたルート
- 名前付きルートアウトレット
- メインルートとサイドルートの実装
- モーダルとルーティングの組み合わせ

### 6. ルートイベントの監視（Route Events）
- Router イベントの種類（NavigationStart, NavigationEnd, NavigationError など）
- イベントの購読と処理
- ローディングインジケーターの実装
- エラーハンドリング

### 7. ルートスナップショットとObservable（Route Snapshot vs Observable）
- パラメータの変更を監視する必要性
- Observable によるリアクティブなデータ取得
- switchMap を使用した非同期データ処理
- メモリリークの防止

## 実装例の構造

```
02-intermediate/
├── route-guards/
│   ├── can-activate/          # CanActivate ガード
│   ├── can-deactivate/        # CanDeactivate ガード
│   ├── can-activate-child/    # CanActivateChild ガード
│   ├── resolve/               # Resolve ガード
│   └── can-load/              # CanLoad ガード
├── activated-route/           # ActivatedRoute の詳細な使用
├── route-data/                # ルートデータとメタデータ
├── redirects/                 # リダイレクトの実装
├── nested-routes-advanced/    # 高度なネストされたルート
├── route-events/              # ルートイベントの監視
└── route-observables/         # Observable パターン
```

## 学習目標

このセクションを完了すると、以下のことができるようになります：

- ✅ 各種ルートガードを実装し、アクセス制御ができる
- ✅ ルートパラメータやクエリパラメータを適切に処理できる
- ✅ ルートデータを活用してメタ情報を管理できる
- ✅ 複雑なリダイレクトロジックを実装できる
- ✅ ネストされたルートを効果的に使用できる
- ✅ ルートイベントを監視し、UIの状態を適切に更新できる
- ✅ Observable パターンを理解し、リアクティブなルーティングを実装できる

