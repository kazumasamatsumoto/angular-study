# Route Events - ルーティングイベントの監視

## 概要

このプロジェクトは、Angularのルーティングイベントを監視して、ローディングインジケーター、プログレスバー、
イベントログを実装する方法を示すデモです。実務で役立つUX向上のパターンを学べます。

## 主な機能

### 1. プログレスバー
- 画面上部にナビゲーション進捗を表示
- NavigationStartで開始、NavigationEndで完了
- 滑らかなアニメーション

### 2. ローディングオーバーレイ
- データ取得中の全画面ローディング表示
- スピナーアニメーション
- ユーザーの操作をブロック

### 3. イベントログ
- すべてのナビゲーションイベントを記録
- タイムスタンプ付き
- イベントタイプ別の色分け表示

### 4. 統計情報
- 総ナビゲーション数
- 成功/失敗/キャンセルの集計
- リアルタイム更新

## 実装のポイント

### 1. ナビゲーションイベントの監視

```typescript
constructor(private router: Router) {
  // NavigationStart: ナビゲーション開始
  this.router.events.pipe(
    filter(event => event instanceof NavigationStart)
  ).subscribe((event: NavigationStart) => {
    this.isLoading.set(true);
    this.progress.set(10);
  });

  // NavigationEnd: ナビゲーション成功
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    this.isLoading.set(false);
    this.progress.set(100);
  });

  // NavigationError: ナビゲーションエラー
  this.router.events.pipe(
    filter(event => event instanceof NavigationError)
  ).subscribe((event: NavigationError) => {
    this.isLoading.set(false);
    console.error('Navigation error:', event.error);
  });
}
```

### 2. プログレスバーコンポーネント

```typescript
@Component({
  template: `
    @if (navigationTracker.progress() > 0) {
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          [style.width.%]="navigationTracker.progress()"
        ></div>
      </div>
    }
  `
})
export class ProgressBarComponent {
  navigationTracker = inject(NavigationTrackerService);
}
```

### 3. ローディングインジケーター

```typescript
@Component({
  template: `
    @if (navigationTracker.isLoading()) {
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    }
  `
})
export class LoadingIndicatorComponent {
  navigationTracker = inject(NavigationTrackerService);
}
```

## ディレクトリ構造

```
src/app/
├── components/
│   ├── loading-indicator/       # ローディングオーバーレイ
│   ├── progress-bar/            # プログレスバー
│   └── event-logger/            # イベントログ
├── services/
│   └── navigation-tracker.service.ts  # ナビゲーション追跡
├── resolvers/
│   └── slow-page.resolver.ts    # 遅延シミュレーション
├── pages/
│   ├── home/                    # ホームページ
│   ├── page1/                   # ページ1
│   ├── page2/                   # ページ2
│   └── slow-page/               # 遅いページ
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
ng serve --port 5205
```

ブラウザで `http://localhost:5205` を開く

### ビルド

```bash
npm run build
```

## 動作確認手順

### 1. プログレスバーの確認

1. 任意のページリンクをクリック
2. 画面上部にプログレスバーが表示される
3. ページ遷移完了後、プログレスバーが100%になり消える

### 2. ローディングオーバーレイの確認

1. 「遅いページ」リンクをクリック
2. 全画面のローディングオーバーレイが表示される
3. 3秒後にページが表示される

### 3. イベントログの確認

1. 複数のページを行き来する
2. イベントログに各ナビゲーションが記録される
3. タイムスタンプとイベントタイプが表示される

### 4. 統計情報の確認

1. ページ遷移を繰り返す
2. 統計カードの数値が更新される
3. 「統計をリセット」ボタンで0にリセット可能

## 重要なコンセプト

### ルーティングイベントの種類

1. **NavigationStart**
   - ナビゲーション開始時に発火
   - URLとナビゲーションIDを含む

2. **NavigationEnd**
   - ナビゲーション成功時に発火
   - 最終的なURLを含む

3. **NavigationCancel**
   - ナビゲーションがキャンセルされた時
   - ガードによる拒否など

4. **NavigationError**
   - ナビゲーションエラー時
   - エラーオブジェクトを含む

5. **その他のイベント**
   - RoutesRecognized
   - GuardsCheckStart/End
   - ResolveStart/End

### イベント監視のベストプラクティス

```typescript
// サービスで一元管理
@Injectable({ providedIn: 'root' })
export class NavigationTrackerService {
  private setupNavigationTracking(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // 開始処理
      } else if (event instanceof NavigationEnd) {
        // 完了処理
      } else if (event instanceof NavigationError) {
        // エラー処理
      }
    });
  }
}

// またはfilterを使用
this.router.events.pipe(
  filter(event =>
    event instanceof NavigationStart ||
    event instanceof NavigationEnd
  )
).subscribe(event => {
  // 処理
});
```

## 演習問題

### 初級

1. **ナビゲーション時間の計測**
   - StartとEndのタイムスタンプから所要時間を計算
   - ヒント: Mapでスタート時刻を保存

2. **カスタムトーストメッセージ**
   - エラー時にトースト通知を表示
   - ヒント: NavigationErrorイベントで通知

### 中級

3. **段階的プログレスバー**
   - ガード、Resolverの進捗に応じて更新
   ```typescript
   GuardsCheckStart: 30%
   ResolveStart: 60%
   NavigationEnd: 100%
   ```

4. **ページ遷移アニメーション**
   - イベントに基づいてフェードイン/アウト
   - ヒント: @angular/animationsを使用

### 上級

5. **条件付きローディング表示**
   - 特定のルートのみローディング表示
   ```typescript
   if (event.url.includes('/slow')) {
     this.showLoading.set(true);
   }
   ```

6. **アナリティクス統合**
   - ページビューをGoogle Analyticsに送信
   ```typescript
   this.router.events.pipe(
     filter(event => event instanceof NavigationEnd)
   ).subscribe((event: NavigationEnd) => {
     gtag('config', 'GA_MEASUREMENT_ID', {
       page_path: event.urlAfterRedirects
     });
   });
   ```

## 実務での応用例

### 1. グローバルローディング

```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  isLoading$ = new BehaviorSubject<boolean>(false);

  show(): void {
    this.loadingCount++;
    this.isLoading$.next(true);
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading$.next(false);
    }
  }
}
```

### 2. ページビュートラッキング

```typescript
constructor(
  private router: Router,
  private analytics: AnalyticsService
) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    this.analytics.trackPageView(event.urlAfterRedirects);
  });
}
```

### 3. エラーログ記録

```typescript
this.router.events.pipe(
  filter(event => event instanceof NavigationError)
).subscribe((event: NavigationError) => {
  this.errorLogger.log({
    type: 'NavigationError',
    url: event.url,
    error: event.error,
    timestamp: new Date()
  });
});
```

## トラブルシューティング

### イベントが発火しない

- Router.eventsを正しくsubscribeしているか確認
- filterの条件が正しいか確認

### メモリリーク

- subscriptionを適切にunsubscribe
- takeUntilDestroyedを使用

### プログレスバーが表示されない

- CSSのz-indexを確認
- position: fixedが正しく設定されているか確認

## 参考リンク

- [Angular Router Events](https://angular.dev/api/router/Event)
- [NavigationStart](https://angular.dev/api/router/NavigationStart)
- [NavigationEnd](https://angular.dev/api/router/NavigationEnd)
- [NavigationError](https://angular.dev/api/router/NavigationError)

## まとめ

このデモで学べること：

- ✅ ルーティングイベントの種類と使い方
- ✅ ローディングインジケーターの実装
- ✅ プログレスバーの実装
- ✅ イベントログとトラッキング
- ✅ 実務で使える実装パターン

ルーティングイベントを適切に活用することで、優れたUXを提供し、
デバッグや分析も容易になります。
