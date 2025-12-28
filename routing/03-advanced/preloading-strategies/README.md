# プリロード戦略（Preloading Strategies）

遅延ロードされたモジュールをバックグラウンドでプリロードする戦略を学びます。

## 学習内容

1. **プリロード戦略の基礎**
   - デフォルトの挙動（プリロードなし）
   - `PreloadAllModules` 戦略
   - カスタムプリロード戦略

2. **カスタムプリロード戦略の実装**
   - `PreloadingStrategy` インターフェース
   - データ駆動型プリロード
   - 条件付きプリロード

3. **高度なプリロード戦略**
   - ネットワーク状態に基づくプリロード
   - 優先度ベースのプリロード
   - 遅延プリロード（Delayed Preloading）

## プリロード戦略とは？

遅延ローディングは初期バンドルサイズを削減しますが、ユーザーがページにアクセスした時にロード待ち時間が発生します。プリロード戦略を使うと、バックグラウンドでモジュールを事前にロードし、この待ち時間を解消できます。

### 3つのアプローチ

| アプローチ | 初期ロード | ユーザー体験 | 帯域幅使用 |
|-----------|----------|------------|-----------|
| 通常のインポート | 遅い | 即座 | 多い |
| 遅延ローディング | 速い | 待ち時間あり | 少ない |
| プリロード | 速い | 即座 | 中程度 |

## 実装例

### 1. デフォルト（プリロードなし）

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)  // プリロードなし
  ]
};
```

### 2. すべてのモジュールをプリロード

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)  // すべてプリロード
    )
  ]
};
```

または

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ]
});
```

### 3. データ駆動型プリロード戦略

ルート設定の`data`プロパティに基づいてプリロードを制御します。

**strategies/selective-preload.strategy.ts**
```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // data.preload が true の場合のみプリロード
    if (route.data && route.data['preload']) {
      console.log('Preloading:', route.path);
      return load();
    }

    return of(null);
  }
}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  // プリロードする
  {
    path: 'dashboard',
    data: { preload: true },
    loadChildren: () => import('./features/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  },

  // プリロードしない
  {
    path: 'admin',
    data: { preload: false },
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  }
];
```

**app.config.ts**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SelectivePreloadStrategy } from './strategies/selective-preload.strategy';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, {
      preloadingStrategy: SelectivePreloadStrategy
    })
  ]
};
```

### 4. ネットワーク状態に基づくプリロード

**strategies/network-aware-preload.strategy.ts**
```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // ネットワーク情報APIをチェック
    const connection = (navigator as any).connection;

    if (connection) {
      // 遅い接続の場合はプリロードしない
      if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.log('Slow connection detected, skipping preload:', route.path);
        return of(null);
      }

      // 4G以上の場合のみプリロード
      if (connection.effectiveType === '4g' || connection.effectiveType === '5g') {
        console.log('Fast connection, preloading:', route.path);
        return load();
      }
    }

    // ネットワーク情報が取得できない場合は、data.preload を確認
    if (route.data && route.data['preload']) {
      return load();
    }

    return of(null);
  }
}
```

### 5. 優先度ベースのプリロード

**strategies/priority-preload.strategy.ts**
```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PriorityPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      const priority = route.data['priority'] || 5;
      const delay = this.getDelay(priority);

      console.log(`Preloading ${route.path} with priority ${priority} (delay: ${delay}ms)`);

      // 優先度に応じて遅延を設定
      return timer(delay).pipe(
        mergeMap(() => load())
      );
    }

    return of(null);
  }

  private getDelay(priority: number): number {
    // 優先度1: 即座、優先度5: 5秒後、優先度10: 10秒後
    return (priority - 1) * 1000;
  }
}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  // 優先度1: 即座にプリロード
  {
    path: 'dashboard',
    data: { preload: true, priority: 1 },
    loadChildren: () => import('./features/dashboard/dashboard.routes')
  },

  // 優先度3: 2秒後にプリロード
  {
    path: 'user',
    data: { preload: true, priority: 3 },
    loadChildren: () => import('./features/user/user.routes')
  },

  // 優先度5: 4秒後にプリロード
  {
    path: 'reports',
    data: { preload: true, priority: 5 },
    loadChildren: () => import('./features/reports/reports.routes')
  }
];
```

### 6. 条件付きプリロード（ユーザー権限）

**strategies/auth-aware-preload.strategy.ts**
```typescript
import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthAwarePreloadStrategy implements PreloadingStrategy {
  private authService = inject(AuthService);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // 認証が必要なルートの場合
    if (route.data && route.data['requiresAuth']) {
      // ログインしている場合のみプリロード
      if (this.authService.isAuthenticated()) {
        console.log('User authenticated, preloading:', route.path);
        return load();
      } else {
        console.log('User not authenticated, skipping:', route.path);
        return of(null);
      }
    }

    // 管理者専用ルートの場合
    if (route.data && route.data['requiresAdmin']) {
      if (this.authService.isAdmin()) {
        console.log('User is admin, preloading:', route.path);
        return load();
      } else {
        console.log('User is not admin, skipping:', route.path);
        return of(null);
      }
    }

    // デフォルトの動作
    if (route.data && route.data['preload']) {
      return load();
    }

    return of(null);
  }
}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    data: { requiresAuth: true, preload: true },
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes')
  },

  {
    path: 'admin',
    data: { requiresAdmin: true, preload: true },
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
  }
];
```

### 7. カスタムイベント駆動型プリロード

**strategies/event-driven-preload.strategy.ts**
```typescript
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, fromEvent } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventDrivenPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preloadOn']) {
      const eventName = route.data['preloadOn'];

      console.log(`Waiting for ${eventName} event to preload:`, route.path);

      // 特定のイベント発火後にプリロード
      return fromEvent(window, eventName).pipe(
        take(1),
        mergeMap(() => {
          console.log(`${eventName} event fired, preloading:`, route.path);
          return load();
        })
      );
    }

    return of(null);
  }
}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  {
    path: 'advanced',
    data: { preloadOn: 'user-active' },  // カスタムイベント
    loadChildren: () => import('./features/advanced/advanced.routes')
  }
];
```

**どこかのコンポーネントで**
```typescript
// ユーザーがアクティブになったらイベントを発火
window.dispatchEvent(new Event('user-active'));
```

## プリロードの監視

**services/preload-monitor.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PreloadMonitorService {
  private preloadedModules = new Set<string>();

  constructor(private router: Router) {
    this.monitorPreloading();
  }

  private monitorPreloading(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // ルーターの設定を確認
        this.checkPreloadedModules();
      });
  }

  private checkPreloadedModules(): void {
    // プリロードされたモジュールを追跡
    console.log('Preloaded modules:', Array.from(this.preloadedModules));
  }

  addPreloadedModule(modulePath: string): void {
    this.preloadedModules.add(modulePath);
    console.log(`Module preloaded: ${modulePath}`);
  }
}
```

## パフォーマンス比較

### プリロードなし
```
初期ロード: 150 kB (速い)
ページ遷移: 50 kB ロード後に表示 (遅い)
```

### PreloadAllModules
```
初期ロード: 150 kB (速い)
バックグラウンド: 150 kB プリロード
ページ遷移: 即座に表示 (速い)
```

### 選択的プリロード
```
初期ロード: 150 kB (速い)
バックグラウンド: 80 kB プリロード（重要なもののみ）
ページ遷移: 一部即座、一部ロード待ち
```

## ベストプラクティス

### 1. データセーバーモードを尊重

```typescript
if (navigator.connection?.saveData) {
  // プリロードをスキップ
  return of(null);
}
```

### 2. ユーザーの使用パターンに基づく

```typescript
// よく使われるページを優先的にプリロード
{
  path: 'popular-page',
  data: { preload: true, priority: 1 }
}
```

### 3. 段階的なプリロード

```typescript
// 重要度順にプリロード
- Priority 1: ダッシュボード（即座）
- Priority 2: プロフィール（2秒後）
- Priority 3: 設定（5秒後）
```

### 4. プリロードのログ

```typescript
preload(route: Route, load: () => Observable<any>): Observable<any> {
  if (shouldPreload(route)) {
    console.log('[Preload] Starting:', route.path);
    return load().pipe(
      tap(() => console.log('[Preload] Complete:', route.path))
    );
  }
  return of(null);
}
```

## よくある間違い

❌ **すべてをプリロード**
```typescript
// 大きなアプリケーションですべてをプリロードすると帯域幅を無駄にする
PreloadAllModules
```

✅ **選択的にプリロード**
```typescript
// よく使われるページのみプリロード
SelectivePreloadStrategy with data.preload: true
```

❌ **ネットワーク状態を無視**
```typescript
// 遅い回線でもプリロードしてしまう
```

✅ **ネットワーク状態を考慮**
```typescript
// 高速回線の場合のみプリロード
NetworkAwarePreloadStrategy
```

## 演習問題

### 初級
1. `PreloadAllModules` を設定して、すべてのモジュールをプリロードしてください
2. データ駆動型プリロード戦略を実装してください

### 中級
3. ネットワーク速度に基づくプリロード戦略を実装してください
4. ユーザーの権限に基づいてプリロードを制御してください

### 上級
5. アイドル時間（ユーザーが何もしていない時）にプリロードする戦略を実装してください
6. プリロードの統計（どのモジュールがいつロードされたか）を収集するサービスを作成してください

## 次のステップ

次は [testing](../testing/README.md) で、ルーティングのテスト方法を学びます。
