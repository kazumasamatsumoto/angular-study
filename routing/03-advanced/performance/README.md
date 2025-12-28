# Performance (パフォーマンス最適化)

## 概要

Performanceは、Angularルーティングとナビゲーションのパフォーマンスを最適化し、高速で応答性の高いユーザーエクスペリエンスを提供するための技術です。コード分割、遅延ロード、プリロード、キャッシング、バンドル最適化などの手法を組み合わせることで、初期ロード時間を短縮し、ナビゲーションを高速化できます。

適切なパフォーマンス最適化により、ユーザーの満足度が向上し、SEOランキングも改善されます。

## 学習内容

- コード分割と遅延ロードの実装
- プリロード戦略のカスタマイズ
- バンドルサイズの最適化
- キャッシング戦略とService Worker
- パフォーマンス測定とモニタリング

## 詳細な説明

### なぜパフォーマンス最適化が重要か

1. **ユーザーエクスペリエンス**: 高速なアプリケーションは使いやすい
2. **SEO**: Googleはページ速度をランキング要因として考慮
3. **コンバージョン率**: ロード時間が1秒短縮されると、コンバージョン率が向上
4. **モバイル対応**: 低速なネットワークでも快適に動作
5. **コスト削減**: 帯域幅とサーバーリソースの節約

### パフォーマンス指標

1. **FCP (First Contentful Paint)**: 最初のコンテンツ表示までの時間
2. **LCP (Largest Contentful Paint)**: 最大のコンテンツ表示までの時間
3. **TTI (Time to Interactive)**: インタラクティブになるまでの時間
4. **TBT (Total Blocking Time)**: メインスレッドのブロック時間
5. **CLS (Cumulative Layout Shift)**: レイアウトのずれ

### 最適化手法

1. **Code Splitting**: コードを小さなチャンクに分割
2. **Lazy Loading**: 必要な時だけモジュールをロード
3. **Preloading**: バックグラウンドでモジュールをプリロード
4. **Caching**: リソースをキャッシュして再利用
5. **Bundle Optimization**: バンドルサイズを最小化

## 実装例

### 例1: 基本的な遅延ロード

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    // 管理者機能は遅延ロード
  },
  {
    path: 'analytics',
    loadChildren: () => import('./features/analytics/analytics.routes')
      .then(m => m.ANALYTICS_ROUTES),
    // アナリティクス機能は遅延ロード
  }
];
```

```typescript
// features/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component')
      .then(m => m.UsersManagementComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component')
      .then(m => m.SettingsComponent)
  }
];
```

### 例2: カスタムプリロード戦略

```typescript
// strategies/custom-preload.strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadStrategy implements PreloadingStrategy {
  /**
   * ルートのプリロードを判定
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // data.preloadがtrueの場合のみプリロード
    if (route.data?.['preload']) {
      const delay = route.data?.['preloadDelay'] || 0;

      console.log(`Preloading route: ${route.path} (delay: ${delay}ms)`);

      // 遅延付きでプリロード
      return timer(delay).pipe(
        mergeMap(() => load())
      );
    }

    return of(null);
  }
}
```

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { CustomPreloadStrategy } from './strategies/custom-preload.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(CustomPreloadStrategy)
    )
  ]
};
```

```typescript
// app.routes.ts（プリロード設定付き）
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent),
    data: {
      preload: true,        // プリロードを有効化
      preloadDelay: 2000    // 2秒後にプリロード
    }
  },
  {
    path: 'popular',
    loadComponent: () => import('./pages/popular/popular.component')
      .then(m => m.PopularComponent),
    data: {
      preload: true,        // 人気ページはプリロード
      preloadDelay: 0       // 即座にプリロード
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    data: {
      preload: false        // 管理者機能はプリロードしない
    }
  }
];
```

### 例3: ネットワーク状態に基づくプリロード

```typescript
// strategies/network-aware-preload.strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // プリロード設定がない場合はスキップ
    if (!route.data?.['preload']) {
      return of(null);
    }

    // ネットワーク状態をチェック
    const connection = this.getNetworkInformation();

    // 条件に基づいてプリロードを判定
    if (this.shouldPreload(route, connection)) {
      console.log(`Preloading route: ${route.path} on ${connection.effectiveType}`);
      return load();
    }

    console.log(`Skipping preload for: ${route.path} on ${connection.effectiveType}`);
    return of(null);
  }

  /**
   * プリロードすべきかを判定
   */
  private shouldPreload(route: Route, connection: any): boolean {
    const priority = route.data?.['preloadPriority'] || 'low';

    // オフラインの場合はプリロードしない
    if (!navigator.onLine) {
      return false;
    }

    // ネットワーク情報が利用できない場合は常にプリロード
    if (!connection) {
      return true;
    }

    const effectiveType = connection.effectiveType;

    // 優先度とネットワーク速度に基づいて判定
    switch (priority) {
      case 'high':
        // 高優先度：すべてのネットワークでプリロード
        return true;

      case 'medium':
        // 中優先度：3G以上でプリロード
        return ['3g', '4g'].includes(effectiveType);

      case 'low':
      default:
        // 低優先度：4Gのみプリロード
        return effectiveType === '4g';
    }
  }

  /**
   * ネットワーク情報を取得
   */
  private getNetworkInformation(): any {
    // Network Information APIをチェック
    const nav = navigator as any;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
  }
}
```

```typescript
// app.routes.ts（優先度付きプリロード）
export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component')
      .then(m => m.ProductsComponent),
    data: {
      preload: true,
      preloadPriority: 'high'  // 高優先度：常にプリロード
    }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component')
      .then(m => m.AboutComponent),
    data: {
      preload: true,
      preloadPriority: 'medium'  // 中優先度：3G以上でプリロード
    }
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component')
      .then(m => m.GalleryComponent),
    data: {
      preload: true,
      preloadPriority: 'low'  // 低優先度：4Gのみプリロード
    }
  }
];
```

### 例4: バンドル分析とサイズ最適化

```json
// package.json
{
  "scripts": {
    "build": "ng build",
    "build:stats": "ng build --stats-json",
    "analyze": "webpack-bundle-analyzer dist/my-app/stats.json"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.10.1"
  }
}
```

```typescript
// Build optimization configuration
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": {
                "scripts": true,
                "styles": {
                  "minify": true,
                  "inlineCritical": true
                },
                "fonts": true
              },
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

### 例5: Service Workerとキャッシング

```json
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": [
        "/api/**"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "5s"
      }
    },
    {
      "name": "static-api",
      "urls": [
        "/api/static/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 100,
        "maxAge": "1d"
      }
    }
  ],
  "navigationUrls": [
    "/**",
    "!/**/*.*",
    "!/**/api/**"
  ]
}
```

```typescript
// app.config.ts（Service Worker有効化）
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
```

### 例6: ルートレベルのコード分割

```typescript
// services/route-optimizer.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteOptimizerService {
  private loadedRoutes = new Set<string>();

  /**
   * ルートがすでにロードされているかチェック
   */
  isRouteLoaded(path: string): boolean {
    return this.loadedRoutes.has(path);
  }

  /**
   * ロード済みルートとしてマーク
   */
  markRouteAsLoaded(path: string): void {
    this.loadedRoutes.add(path);
  }

  /**
   * ルートのプリロード
   */
  async preloadRoute(path: string): Promise<void> {
    if (this.isRouteLoaded(path)) {
      console.log(`Route already loaded: ${path}`);
      return;
    }

    try {
      // 動的インポートでルートをプリロード
      await this.loadRouteModule(path);
      this.markRouteAsLoaded(path);
      console.log(`Preloaded route: ${path}`);
    } catch (error) {
      console.error(`Failed to preload route: ${path}`, error);
    }
  }

  /**
   * ルートモジュールをロード
   */
  private async loadRouteModule(path: string): Promise<any> {
    // ルートパスに基づいて適切なモジュールをインポート
    switch (path) {
      case '/products':
        return import('../pages/products/products.component');
      case '/about':
        return import('../pages/about/about.component');
      case '/contact':
        return import('../pages/contact/contact.component');
      default:
        throw new Error(`Unknown route: ${path}`);
    }
  }

  /**
   * 複数のルートを一括プリロード
   */
  async preloadRoutes(paths: string[]): Promise<void> {
    await Promise.all(
      paths.map(path => this.preloadRoute(path))
    );
  }
}
```

```typescript
// app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouteOptimizerService } from './services/route-optimizer.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private routeOptimizer = inject(RouteOptimizerService);

  ngOnInit(): void {
    // ナビゲーション完了時に関連ルートをプリロード
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.preloadRelatedRoutes(event.url);
      });

    // アイドル時に人気ルートをプリロード
    this.preloadPopularRoutes();
  }

  /**
   * 現在のルートに関連するルートをプリロード
   */
  private preloadRelatedRoutes(currentUrl: string): void {
    const relatedRoutes = this.getRelatedRoutes(currentUrl);
    if (relatedRoutes.length > 0) {
      // 少し遅延してからプリロード
      setTimeout(() => {
        this.routeOptimizer.preloadRoutes(relatedRoutes);
      }, 1000);
    }
  }

  /**
   * 関連ルートを取得
   */
  private getRelatedRoutes(currentUrl: string): string[] {
    const routeRelations: Record<string, string[]> = {
      '/': ['/products', '/about'],
      '/products': ['/cart', '/checkout'],
      '/cart': ['/checkout', '/products'],
      '/product/:id': ['/cart', '/products']
    };

    const baseUrl = currentUrl.split('/')[1] || '/';
    return routeRelations[`/${baseUrl}`] || [];
  }

  /**
   * 人気のあるルートをプリロード
   */
  private preloadPopularRoutes(): void {
    // ブラウザがアイドル状態になったらプリロード
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.routeOptimizer.preloadRoutes([
          '/products',
          '/about',
          '/contact'
        ]);
      });
    } else {
      // フォールバック：2秒後にプリロード
      setTimeout(() => {
        this.routeOptimizer.preloadRoutes([
          '/products',
          '/about',
          '/contact'
        ]);
      }, 2000);
    }
  }
}
```

### 例7: パフォーマンス測定とモニタリング

```typescript
// services/performance-monitor.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PerformanceMetrics {
  route: string;
  navigationTime: number;
  renderTime: number;
  totalTime: number;
  timestamp: Date;
}

export interface CoreWebVitals {
  FCP: number | null;  // First Contentful Paint
  LCP: number | null;  // Largest Contentful Paint
  FID: number | null;  // First Input Delay
  CLS: number | null;  // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private navigationStartTime = 0;
  private metrics: PerformanceMetrics[] = [];

  constructor(private router: Router) {
    this.initRouterMonitoring();
    this.initWebVitalsMonitoring();
  }

  /**
   * ルーターのパフォーマンスを監視
   */
  private initRouterMonitoring(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart || event instanceof NavigationEnd)
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.navigationStartTime = performance.now();
        } else if (event instanceof NavigationEnd) {
          this.recordNavigationMetrics(event.url);
        }
      });
  }

  /**
   * ナビゲーションメトリクスを記録
   */
  private recordNavigationMetrics(route: string): void {
    const navigationTime = performance.now() - this.navigationStartTime;

    // レンダリング完了を待つ
    requestAnimationFrame(() => {
      const renderTime = performance.now() - this.navigationStartTime - navigationTime;
      const totalTime = performance.now() - this.navigationStartTime;

      const metric: PerformanceMetrics = {
        route,
        navigationTime,
        renderTime,
        totalTime,
        timestamp: new Date()
      };

      this.metrics.push(metric);
      this.logMetric(metric);

      // メトリクスの数を制限
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }
    });
  }

  /**
   * Core Web Vitalsを監視
   */
  private initWebVitalsMonitoring(): void {
    if (typeof window === 'undefined') return;

    // PerformanceObserver APIを使用
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      this.observeLCP();

      // FID (First Input Delay)
      this.observeFID();

      // CLS (Cumulative Layout Shift)
      this.observeCLS();
    }

    // Navigation Timing APIでFCPとTTFBを取得
    window.addEventListener('load', () => {
      this.recordNavigationTiming();
    });
  }

  /**
   * LCPを観測
   */
  private observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * FIDを観測
   */
  private observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  /**
   * CLSを観測
   */
  private observeCLS(): void {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Navigation Timingを記録
   */
  private recordNavigationTiming(): void {
    const navTiming = performance.getEntriesByType('navigation')[0] as any;

    if (navTiming) {
      const metrics = {
        TTFB: navTiming.responseStart - navTiming.requestStart,
        domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
        loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart
      };

      console.log('Navigation Timing:', metrics);
    }
  }

  /**
   * メトリクスをログに記録
   */
  private logMetric(metric: PerformanceMetrics): void {
    console.log('Performance Metric:', {
      route: metric.route,
      navigationTime: `${metric.navigationTime.toFixed(2)}ms`,
      renderTime: `${metric.renderTime.toFixed(2)}ms`,
      totalTime: `${metric.totalTime.toFixed(2)}ms`
    });

    // 警告閾値をチェック
    if (metric.totalTime > 1000) {
      console.warn(`Slow navigation detected: ${metric.route} (${metric.totalTime.toFixed(2)}ms)`);
    }
  }

  /**
   * すべてのメトリクスを取得
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 平均パフォーマンスを計算
   */
  getAveragePerformance(): {
    avgNavigationTime: number;
    avgRenderTime: number;
    avgTotalTime: number;
  } {
    if (this.metrics.length === 0) {
      return {
        avgNavigationTime: 0,
        avgRenderTime: 0,
        avgTotalTime: 0
      };
    }

    const sum = this.metrics.reduce(
      (acc, metric) => ({
        navigationTime: acc.navigationTime + metric.navigationTime,
        renderTime: acc.renderTime + metric.renderTime,
        totalTime: acc.totalTime + metric.totalTime
      }),
      { navigationTime: 0, renderTime: 0, totalTime: 0 }
    );

    const count = this.metrics.length;

    return {
      avgNavigationTime: sum.navigationTime / count,
      avgRenderTime: sum.renderTime / count,
      avgTotalTime: sum.totalTime / count
    };
  }

  /**
   * メトリクスをクリア
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}
```

## ベストプラクティス

### 1. 遅延ロードの積極的な使用

初期ロード時間を短縮するために、可能な限り遅延ロードを使用します。

```typescript
// 良い例：機能モジュールを遅延ロード
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes')
}

// 悪い例：すべてを初期ロード
import { AdminModule } from './features/admin/admin.module';
```

### 2. プリロード戦略のカスタマイズ

ネットワーク状態やユーザー行動に基づいてプリロードを最適化します。

```typescript
withPreloading(NetworkAwarePreloadStrategy)
```

### 3. バンドルサイズの監視

ビルド時にバンドルサイズをチェックして警告を表示します。

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kb",
    "maximumError": "1mb"
  }
]
```

### 4. Tree Shakingの活用

未使用のコードを自動的に削除します。

```typescript
// 良い例：名前付きインポート
import { Component } from '@angular/core';

// 悪い例：デフォルトインポート
import * as angular from '@angular/core';
```

### 5. Change Detection Strategyの最適化

OnPushを使用してChange Detectionを最適化します。

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 6. TrackByの使用

ngForでtrackByを使用してDOM操作を最小化します。

```typescript
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: any): number {
  return item.id;
}
```

### 7. Service Workerの実装

オフライン対応とキャッシングを実装します。

```typescript
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode()
})
```

### 8. 画像の最適化

適切なフォーマットとサイズで画像を提供します。

```html
<img
  [src]="imagePath"
  loading="lazy"
  width="800"
  height="600"
  alt="Description">
```

### 9. リソースヒントの使用

dns-prefetch、preconnect、preloadを活用します。

```html
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="preconnect" href="https://cdn.example.com">
<link rel="preload" as="font" href="/fonts/main.woff2">
```

### 10. パフォーマンス測定の実装

Core Web Vitalsを継続的に監視します。

```typescript
const performanceMonitor = new PerformanceMonitorService();
performanceMonitor.getAveragePerformance();
```

## よくある間違い

### 1. すべてを初期ロード

遅延ロードを使用せずにすべてのモジュールを初期ロードしてしまう。

```typescript
// 悪い例
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';

// 良い例
loadChildren: () => import('./admin/admin.routes')
```

### 2. プリロード戦略の未設定

デフォルトのプリロード戦略のみを使用する。

```typescript
// 悪い例：デフォルトのみ

// 良い例：カスタム戦略
withPreloading(CustomPreloadStrategy)
```

### 3. バンドルサイズの無視

バンドルサイズを監視せずに肥大化させてしまう。

```bash
# バンドル分析を定期的に実行
npm run analyze
```

### 4. 未使用の依存関係

使用していないライブラリがバンドルに含まれる。

```bash
# 未使用の依存関係をチェック
npm prune
```

### 5. OnPushの未使用

デフォルトのChange Detection Strategyを使用し続ける。

```typescript
// 良い例
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 6. TrackByの欠如

ngForでtrackByを使用しない。

```html
<!-- 悪い例 -->
<div *ngFor="let item of items">

<!-- 良い例 -->
<div *ngFor="let item of items; trackBy: trackById">
```

### 7. Service Workerの未実装

オフライン対応やキャッシングを実装していない。

```typescript
// 良い例
provideServiceWorker('ngsw-worker.js')
```

### 8. 画像の最適化不足

大きな画像をそのまま使用してしまう。

```html
<!-- 悪い例 -->
<img src="huge-image.jpg">

<!-- 良い例 -->
<img src="optimized-image.webp" loading="lazy">
```

### 9. パフォーマンス測定の欠如

パフォーマンスを測定せずに最適化を試みる。

```typescript
// 良い例：測定してから最適化
const metrics = performanceMonitor.getMetrics();
```

### 10. メモリリークの放置

Subscriptionの解除を忘れてメモリリークが発生する。

```typescript
// 悪い例
ngOnInit() {
  this.service.getData().subscribe(...);
}

// 良い例
ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(...);
}
```

## 演習問題

### 初級

#### 演習1: 基本的な遅延ロード

タスク：
1. 3つの機能モジュールを作成
2. すべてのモジュールに遅延ロードを設定
3. ビルドして複数のチャンクが生成されることを確認
4. DevToolsでロードタイミングを確認

期待される動作：
- 初期バンドルサイズが小さい
- ルート遷移時に対応するチャンクがロードされる
- ネットワークタブで確認できる

#### 演習2: プリロード戦略の実装

タスク：
1. カスタムプリロード戦略を作成
2. data.preloadフラグに基づいてプリロード
3. 遅延を設定可能にする
4. コンソールにログを出力

期待される動作：
- 指定されたルートのみがプリロードされる
- 設定した遅延時間後にプリロードが開始される
- ログでプリロード状況が確認できる

### 中級

#### 演習1: ネットワーク対応プリロード

タスク：
1. ネットワーク状態を検出
2. ネットワーク速度に基づいてプリロード戦略を変更
3. 優先度システムを実装
4. オフライン時はプリロードをスキップ

期待される動作：
- 高速ネットワークでは積極的にプリロード
- 低速ネットワークでは必要最小限のプリロード
- オフライン時は既存のリソースのみ使用

#### 演習2: パフォーマンス監視システム

タスク：
1. ルーター遷移時間を測定
2. Core Web Vitalsを収集
3. パフォーマンスダッシュボードを作成
4. 警告閾値を設定

期待される動作：
- すべてのナビゲーションの時間が記録される
- LCP、FID、CLSが測定される
- ダッシュボードでメトリクスが表示される
- 遅いナビゲーションに警告が表示される

### 上級

#### 演習1: 包括的なパフォーマンス最適化

タスク：
1. コード分割を最適化
2. カスタムプリロード戦略を実装
3. Service Workerを設定
4. バンドルサイズを分析して最適化
5. パフォーマンスを継続的に監視

期待される動作：
- 初期ロード時間が大幅に短縮される
- すべてのページの遷移が高速
- オフラインでも基本機能が動作
- バンドルサイズが制限内
- パフォーマンスメトリクスがすべてGood

実装のヒント：
```typescript
interface PerformanceTarget {
  FCP: number;  // < 1.8s
  LCP: number;  // < 2.5s
  FID: number;  // < 100ms
  CLS: number;  // < 0.1
}
```

#### 演習2: インテリジェントプリロードシステム

タスク：
1. ユーザー行動を学習
2. よく訪問されるページを予測
3. アイドル時に予測されるページをプリロード
4. 機械学習的なアプローチを実装

期待される動作：
- ユーザーの行動パターンが記録される
- 次に訪問する可能性が高いページが予測される
- 予測に基づいて自動的にプリロードされる
- 時間とともに精度が向上する

実装のヒント：
```typescript
interface UserBehavior {
  currentPage: string;
  previousPages: string[];
  navigationPatterns: Map<string, string[]>;
  visitFrequency: Map<string, number>;
}

class PredictivePreloadService {
  predictNextRoute(currentRoute: string): string[] {
    // 過去のパターンから予測
  }
}
```

## 次のステップへのリンク

Performanceの基礎を学んだら、次のトピックに進みましょう：

- [State Management](../state-management/README.md) - 状態管理との統合
- [Route Reuse](../route-reuse/README.md) - ルート再利用戦略
- [Error Handling](../error-handling/README.md) - エラーハンドリング
- [Deep Linking](../deep-linking/README.md) - 深いリンクとフラグメント

## 参考リンク

- [Angular Performance Guide](https://angular.dev/guide/performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)

## まとめ

Performanceは、優れたユーザーエクスペリエンスを提供する上で最も重要な要素の一つです。適切な最適化により、以下のメリットが得られます：

- 高速な初期ロード時間
- スムーズなナビゲーション体験
- SEOランキングの向上
- コンバージョン率の改善
- ユーザー満足度の向上

コード分割、遅延ロード、プリロード戦略、Service Worker、バンドル最適化を適切に組み合わせて、高速で応答性の高いアプリケーションを構築しましょう。継続的なパフォーマンス測定とモニタリングも忘れずに実施してください。
