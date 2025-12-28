# Route Reuse Strategy (ルート再利用戦略)

## 概要

RouteReuseStrategyは、Angularルーターがコンポーネントインスタンスを再利用するかどうかを制御する強力な機能です。デフォルトでは、ルートを離れるとコンポーネントは破棄されますが、RouteReuseStrategyを使用することで、コンポーネントの状態を保持し、パフォーマンスを向上させることができます。

この機能は、タブナビゲーション、検索フィルター、フォーム入力の保持などに特に有用です。

## 学習内容

- RouteReuseStrategyの基本概念と実装方法
- カスタムルート再利用戦略の作成
- タブナビゲーションでの状態保持
- メモリ管理とパフォーマンス最適化
- デバッグとトラブルシューティング

## 詳細な説明

### RouteReuseStrategyとは

RouteReuseStrategyは、Angularルーターがコンポーネントのライフサイクルを管理する方法をカスタマイズするためのインターフェースです。以下の5つのメソッドを実装する必要があります：

1. **shouldDetach(route: ActivatedRouteSnapshot): boolean**
   - ルートから離れるときにコンポーネントをデタッチ（保存）すべきかを判断

2. **store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void**
   - デタッチされたコンポーネントを保存

3. **shouldAttach(route: ActivatedRouteSnapshot): boolean**
   - ルートに移動するときに保存されたコンポーネントをアタッチすべきかを判断

4. **retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null**
   - 保存されたコンポーネントを取得

5. **shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean**
   - 現在のルートと次のルートが同じかを判断

### なぜRouteReuseStrategyが必要か

1. **パフォーマンス向上**: コンポーネントの再初期化を避け、レンダリング時間を短縮
2. **状態保持**: ユーザーの入力、スクロール位置、フィルター設定などを保持
3. **ユーザーエクスペリエンス向上**: タブ間の切り替えが瞬時に行われる
4. **ネットワークリクエストの削減**: 既に取得したデータを再利用

### 使用シナリオ

- **タブナビゲーション**: ユーザーがタブ間を移動してもコンテンツが保持される
- **検索・フィルター**: 検索結果やフィルター設定を保持
- **フォーム入力**: 複数ページのフォームで入力内容を保持
- **マスター詳細ビュー**: リストと詳細ビュー間の移動で状態を保持

## 実装例

### 例1: 基本的なRouteReuseStrategyの実装

```typescript
// custom-route-reuse-strategy.ts
import { Injectable } from '@angular/core';
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle
} from '@angular/router';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // 保存されたルートを格納するマップ
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // ルートから離れるときにコンポーネントを保存すべきか
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // data.reuseがtrueの場合のみ保存
    return route.data['reuse'] === true;
  }

  // デタッチされたコンポーネントを保存
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      const path = this.getRoutePath(route);
      this.storedRoutes.set(path, handle);
      console.log('Stored route:', path);
    }
  }

  // ルートに移動するときに保存されたコンポーネントをアタッチすべきか
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getRoutePath(route);
    return this.storedRoutes.has(path) && route.data['reuse'] === true;
  }

  // 保存されたコンポーネントを取得
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getRoutePath(route);
    return this.storedRoutes.get(path) || null;
  }

  // 現在のルートと次のルートが同じかを判断
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    // デフォルトの動作: ルート設定が同じなら再利用
    return future.routeConfig === curr.routeConfig;
  }

  // ルートのパスを取得するヘルパーメソッド
  private getRoutePath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(r => r.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

  // 特定のルートをクリア
  clearRoute(path: string): void {
    this.storedRoutes.delete(path);
  }

  // すべての保存されたルートをクリア
  clearAll(): void {
    this.storedRoutes.clear();
  }
}
```

### 例2: RouteReuseStrategyの登録（app.config.ts）

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './strategies/custom-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ]
};
```

### 例3: ルート設定でreuseフラグを使用

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { DetailsComponent } from './components/details/details.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    data: { reuse: true } // このルートは再利用される
  },
  {
    path: 'results',
    component: ResultsComponent,
    data: { reuse: true }
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { reuse: false } // このルートは再利用されない
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { reuse: true }
  }
];
```

### 例4: タブナビゲーションでの実装

```typescript
// tab-navigation.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tab-container">
      <nav class="tab-nav">
        <button
          *ngFor="let tab of tabs"
          [class.active]="isActive(tab.path)"
          (click)="navigateToTab(tab.path)"
          class="tab-button">
          {{ tab.label }}
          <span *ngIf="tab.hasChanges" class="badge">!</span>
        </button>
      </nav>
      <div class="tab-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .tab-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .tab-nav {
      display: flex;
      gap: 8px;
      padding: 16px;
      background: #f5f5f5;
      border-bottom: 2px solid #ddd;
    }

    .tab-button {
      padding: 12px 24px;
      border: none;
      background: white;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
    }

    .tab-button:hover {
      background: #e8e8e8;
    }

    .tab-button.active {
      background: white;
      border-bottom: 3px solid #1976d2;
      color: #1976d2;
    }

    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: #f44336;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tab-content {
      flex: 1;
      overflow: auto;
      padding: 16px;
    }
  `]
})
export class TabNavigationComponent {
  tabs = [
    { path: '/tabs/dashboard', label: 'Dashboard', hasChanges: false },
    { path: '/tabs/analytics', label: 'Analytics', hasChanges: true },
    { path: '/tabs/settings', label: 'Settings', hasChanges: false },
    { path: '/tabs/reports', label: 'Reports', hasChanges: false }
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  navigateToTab(path: string): void {
    this.router.navigate([path]);
  }
}
```

```typescript
// dashboard-tab.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>
      <p class="lifecycle-info">Component created at: {{ createdAt | date:'medium' }}</p>

      <div class="filter-section">
        <h3>Filters</h3>
        <div class="filter-group">
          <label>
            <input type="checkbox" [(ngModel)]="filters.active" />
            Show Active Only
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="filters.pending" />
            Show Pending
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="filters.completed" />
            Show Completed
          </label>
        </div>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search..."
          class="search-input"
        />
      </div>

      <div class="data-section">
        <h3>Data</h3>
        <p>Search Query: {{ searchQuery || 'None' }}</p>
        <p>Active Filters: {{ getActiveFilters() }}</p>
        <p>Counter: {{ counter }}</p>
        <button (click)="counter = counter + 1" class="btn">Increment Counter</button>
      </div>

      <div class="scroll-content">
        <div *ngFor="let item of items" class="item">
          {{ item }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }

    .lifecycle-info {
      color: #666;
      font-size: 12px;
      margin-bottom: 20px;
    }

    .filter-section {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .filter-group {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
    }

    .filter-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .search-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .data-section {
      background: #fff;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn:hover {
      background: #1565c0;
    }

    .scroll-content {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
    }

    .item {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .item:last-child {
      border-bottom: none;
    }
  `]
})
export class DashboardTabComponent implements OnInit, OnDestroy {
  createdAt = new Date();
  counter = 0;
  searchQuery = '';
  filters = {
    active: false,
    pending: false,
    completed: false
  };
  items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  ngOnInit(): void {
    console.log('DashboardTabComponent initialized');
  }

  ngOnDestroy(): void {
    console.log('DashboardTabComponent destroyed');
  }

  getActiveFilters(): string {
    const active = Object.entries(this.filters)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    return active.length > 0 ? active.join(', ') : 'None';
  }
}
```

### 例5: パラメータ付きルートの再利用戦略

```typescript
// advanced-route-reuse-strategy.ts
import { Injectable } from '@angular/core';
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle
} from '@angular/router';

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
  timestamp: number;
}

@Injectable()
export class AdvancedRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, RouteStorageObject>();
  private maxStorageSize = 5; // 最大5つのルートを保存
  private maxAge = 5 * 60 * 1000; // 5分間保存

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // reuseが明示的にfalseの場合は保存しない
    if (route.data['reuse'] === false) {
      return false;
    }

    // reuseがtrueまたはreuseWithParamsがtrueの場合は保存
    return route.data['reuse'] === true || route.data['reuseWithParams'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (!handle) return;

    const path = this.getStorageKey(route);

    // 古いエントリーをクリーンアップ
    this.cleanupOldEntries();

    // ストレージサイズが上限に達している場合、最も古いエントリーを削除
    if (this.storedRoutes.size >= this.maxStorageSize) {
      this.removeOldestEntry();
    }

    this.storedRoutes.set(path, {
      snapshot: route,
      handle,
      timestamp: Date.now()
    });

    console.log('Stored route:', path, 'Total stored:', this.storedRoutes.size);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getStorageKey(route);
    const stored = this.storedRoutes.get(path);

    if (!stored) return false;

    // 有効期限チェック
    const age = Date.now() - stored.timestamp;
    if (age > this.maxAge) {
      this.storedRoutes.delete(path);
      return false;
    }

    // パラメータの比較（reuseWithParamsの場合）
    if (route.data['reuseWithParams']) {
      return this.compareParams(route, stored.snapshot);
    }

    return true;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getStorageKey(route);
    const stored = this.storedRoutes.get(path);
    return stored ? stored.handle : null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getStorageKey(route: ActivatedRouteSnapshot): string {
    // reuseWithParamsの場合はパラメータを含める
    if (route.data['reuseWithParams']) {
      const path = route.pathFromRoot
        .map(r => r.url.map(segment => segment.toString()).join('/'))
        .join('/');
      const params = JSON.stringify(route.params);
      const queryParams = JSON.stringify(route.queryParams);
      return `${path}?params=${params}&query=${queryParams}`;
    }

    return route.pathFromRoot
      .map(r => r.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

  private compareParams(
    route1: ActivatedRouteSnapshot,
    route2: ActivatedRouteSnapshot
  ): boolean {
    const params1 = JSON.stringify(route1.params);
    const params2 = JSON.stringify(route2.params);
    const query1 = JSON.stringify(route1.queryParams);
    const query2 = JSON.stringify(route2.queryParams);

    return params1 === params2 && query1 === query2;
  }

  private cleanupOldEntries(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.storedRoutes.forEach((value, key) => {
      if (now - value.timestamp > this.maxAge) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => {
      this.storedRoutes.delete(key);
      console.log('Cleaned up old route:', key);
    });
  }

  private removeOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.storedRoutes.forEach((value, key) => {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.storedRoutes.delete(oldestKey);
      console.log('Removed oldest route:', oldestKey);
    }
  }

  // 手動でルートをクリアするメソッド
  clearRoute(path: string): void {
    this.storedRoutes.delete(path);
  }

  clearAll(): void {
    this.storedRoutes.clear();
  }

  getStoredRouteCount(): number {
    return this.storedRoutes.size;
  }
}
```

### 例6: RouteReuseStrategyの制御サービス

```typescript
// route-reuse.service.ts
import { Injectable, inject } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { AdvancedRouteReuseStrategy } from './advanced-route-reuse-strategy';

@Injectable({
  providedIn: 'root'
})
export class RouteReuseService {
  private reuseStrategy = inject(RouteReuseStrategy) as AdvancedRouteReuseStrategy;

  /**
   * 特定のルートのキャッシュをクリア
   */
  clearRouteCache(path: string): void {
    this.reuseStrategy.clearRoute(path);
    console.log('Route cache cleared:', path);
  }

  /**
   * すべてのルートのキャッシュをクリア
   */
  clearAllCaches(): void {
    this.reuseStrategy.clearAll();
    console.log('All route caches cleared');
  }

  /**
   * 保存されているルートの数を取得
   */
  getStoredRouteCount(): number {
    return this.reuseStrategy.getStoredRouteCount();
  }

  /**
   * ログアウト時にキャッシュをクリア
   */
  onLogout(): void {
    this.clearAllCaches();
  }

  /**
   * ユーザー切り替え時にキャッシュをクリア
   */
  onUserSwitch(): void {
    this.clearAllCaches();
  }
}
```

```typescript
// header.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouteReuseService } from '../services/route-reuse.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav>
        <a routerLink="/home" routerLinkActive="active">Home</a>
        <a routerLink="/tabs" routerLinkActive="active">Tabs</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
      </nav>
      <div class="actions">
        <span class="cache-count">
          Cached Routes: {{ routeReuseService.getStoredRouteCount() }}
        </span>
        <button (click)="clearCache()" class="btn">Clear Cache</button>
        <button (click)="logout()" class="btn btn-logout">Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #1976d2;
      color: white;
    }

    nav {
      display: flex;
      gap: 24px;
    }

    nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    nav a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    nav a.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .cache-count {
      font-size: 14px;
      opacity: 0.9;
    }

    .btn {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-logout {
      background: #f44336;
      border-color: #d32f2f;
    }

    .btn-logout:hover {
      background: #d32f2f;
    }
  `]
})
export class HeaderComponent {
  routeReuseService = inject(RouteReuseService);

  clearCache(): void {
    this.routeReuseService.clearAllCaches();
  }

  logout(): void {
    this.routeReuseService.onLogout();
    // ログアウト処理...
  }
}
```

### 例7: メモリリーク防止とクリーンアップ

```typescript
// memory-safe-route-reuse-strategy.ts
import { Injectable } from '@angular/core';
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle
} from '@angular/router';

interface StoredRoute {
  handle: DetachedRouteHandle;
  snapshot: ActivatedRouteSnapshot;
  timestamp: number;
  size: number; // 推定メモリサイズ
}

@Injectable()
export class MemorySafeRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, StoredRoute>();

  // メモリ管理設定
  private readonly MAX_STORAGE_SIZE = 5;
  private readonly MAX_AGE_MS = 10 * 60 * 1000; // 10分
  private readonly MAX_MEMORY_MB = 50; // 最大50MB
  private currentMemoryUsage = 0;

  // クリーンアップタイマー
  private cleanupInterval?: ReturnType<typeof setInterval>;

  constructor() {
    this.startCleanupTimer();
    this.setupMemoryMonitoring();
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // メモリ使用量が上限に達している場合は保存しない
    if (this.currentMemoryUsage > this.MAX_MEMORY_MB * 1024 * 1024) {
      console.warn('Memory limit reached, not storing route');
      return false;
    }

    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (!handle) return;

    const path = this.getRoutePath(route);

    // 推定メモリサイズを計算
    const estimatedSize = this.estimateHandleSize(handle);

    // メモリチェック
    if (this.currentMemoryUsage + estimatedSize > this.MAX_MEMORY_MB * 1024 * 1024) {
      this.freeMemory(estimatedSize);
    }

    // サイズ制限チェック
    if (this.storedRoutes.size >= this.MAX_STORAGE_SIZE) {
      this.removeOldestEntry();
    }

    // 既存のエントリーがある場合はメモリ使用量を減算
    const existing = this.storedRoutes.get(path);
    if (existing) {
      this.currentMemoryUsage -= existing.size;
    }

    // 新しいエントリーを保存
    this.storedRoutes.set(path, {
      handle,
      snapshot: route,
      timestamp: Date.now(),
      size: estimatedSize
    });

    this.currentMemoryUsage += estimatedSize;

    console.log('Stored route:', path,
                'Size:', (estimatedSize / 1024).toFixed(2), 'KB',
                'Total memory:', (this.currentMemoryUsage / 1024 / 1024).toFixed(2), 'MB');
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getRoutePath(route);
    const stored = this.storedRoutes.get(path);

    if (!stored) return false;

    // 有効期限チェック
    const age = Date.now() - stored.timestamp;
    if (age > this.MAX_AGE_MS) {
      this.removeRoute(path);
      return false;
    }

    return route.data['reuse'] === true;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getRoutePath(route);
    const stored = this.storedRoutes.get(path);
    return stored ? stored.handle : null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getRoutePath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(r => r.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

  private estimateHandleSize(handle: DetachedRouteHandle): number {
    // 簡易的なサイズ推定（実際のサイズは計測困難）
    // 平均的なコンポーネントのサイズを500KBと仮定
    return 500 * 1024;
  }

  private freeMemory(requiredSize: number): void {
    console.log('Freeing memory, required:', (requiredSize / 1024).toFixed(2), 'KB');

    // 古い順にソート
    const sorted = Array.from(this.storedRoutes.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    let freedMemory = 0;
    for (const [path, stored] of sorted) {
      if (freedMemory >= requiredSize) break;

      this.removeRoute(path);
      freedMemory += stored.size;
    }

    console.log('Freed memory:', (freedMemory / 1024).toFixed(2), 'KB');
  }

  private removeOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.storedRoutes.forEach((value, key) => {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.removeRoute(oldestKey);
    }
  }

  private removeRoute(path: string): void {
    const stored = this.storedRoutes.get(path);
    if (stored) {
      this.currentMemoryUsage -= stored.size;
      this.storedRoutes.delete(path);
      console.log('Removed route:', path);
    }
  }

  private startCleanupTimer(): void {
    // 1分ごとにクリーンアップを実行
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.storedRoutes.forEach((value, key) => {
      if (now - value.timestamp > this.MAX_AGE_MS) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(path => this.removeRoute(path));

    if (toDelete.length > 0) {
      console.log('Cleanup completed, removed', toDelete.length, 'routes');
    }
  }

  private setupMemoryMonitoring(): void {
    // パフォーマンスAPIが利用可能な場合
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
          totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
          storedRoutes: this.storedRoutes.size,
          estimatedRouteMemory: (this.currentMemoryUsage / 1024 / 1024).toFixed(2) + ' MB'
        });
      }, 30 * 1000); // 30秒ごと
    }
  }

  // クリーンアップメソッド（アプリケーション終了時に呼び出す）
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clearAll();
  }

  clearRoute(path: string): void {
    this.removeRoute(path);
  }

  clearAll(): void {
    this.storedRoutes.clear();
    this.currentMemoryUsage = 0;
    console.log('All routes cleared');
  }

  getStoredRouteCount(): number {
    return this.storedRoutes.size;
  }

  getMemoryUsage(): number {
    return this.currentMemoryUsage;
  }
}
```

## ベストプラクティス

### 1. 選択的な再利用

すべてのルートを再利用するのではなく、本当に必要なルートのみを再利用します。

```typescript
// 良い例：data.reuseフラグで制御
export const routes: Routes = [
  { path: 'search', component: SearchComponent, data: { reuse: true } },
  { path: 'details/:id', component: DetailsComponent, data: { reuse: false } }
];

// 悪い例：すべてのルートを無条件に再利用
shouldDetach(route: ActivatedRouteSnapshot): boolean {
  return true; // すべて保存 - メモリリークの原因
}
```

### 2. メモリ管理の実装

保存するルートの数とサイズに制限を設けます。

```typescript
private readonly MAX_STORAGE_SIZE = 5;
private readonly MAX_AGE_MS = 10 * 60 * 1000;

store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
  if (this.storedRoutes.size >= this.MAX_STORAGE_SIZE) {
    this.removeOldestEntry();
  }
  // 保存処理...
}
```

### 3. 有効期限の設定

古いキャッシュを自動的にクリアします。

```typescript
shouldAttach(route: ActivatedRouteSnapshot): boolean {
  const stored = this.storedRoutes.get(path);
  if (!stored) return false;

  const age = Date.now() - stored.timestamp;
  if (age > this.MAX_AGE_MS) {
    this.storedRoutes.delete(path);
    return false;
  }

  return true;
}
```

### 4. ログアウト時のクリーンアップ

ユーザーがログアウトする際は、すべてのキャッシュをクリアします。

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private routeReuseService = inject(RouteReuseService);

  logout(): void {
    this.routeReuseService.clearAllCaches();
    // その他のログアウト処理...
  }
}
```

### 5. デバッグ情報の提供

開発中はコンソールログで状態を確認できるようにします。

```typescript
store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
  const path = this.getRoutePath(route);
  console.log('Storing route:', path, 'Total:', this.storedRoutes.size);
  // 保存処理...
}
```

### 6. パラメータの考慮

パラメータ付きルートの場合、パラメータも考慮してキャッシュキーを生成します。

```typescript
private getStorageKey(route: ActivatedRouteSnapshot): string {
  if (route.data['reuseWithParams']) {
    const path = this.getRoutePath(route);
    const params = JSON.stringify(route.params);
    return `${path}?${params}`;
  }
  return this.getRoutePath(route);
}
```

### 7. クエリパラメータの扱い

クエリパラメータの変更時の挙動を明確にします。

```typescript
shouldReuseRoute(
  future: ActivatedRouteSnapshot,
  curr: ActivatedRouteSnapshot
): boolean {
  // クエリパラメータが変わってもコンポーネントは再利用
  if (future.data['ignoreQueryParams']) {
    return future.routeConfig === curr.routeConfig;
  }

  // デフォルト動作
  return future.routeConfig === curr.routeConfig &&
         JSON.stringify(future.queryParams) === JSON.stringify(curr.queryParams);
}
```

### 8. サービスとの連携

RouteReuseStrategyを制御するサービスを提供します。

```typescript
@Injectable({ providedIn: 'root' })
export class RouteReuseService {
  private strategy = inject(RouteReuseStrategy);

  clearCache(path?: string): void {
    if (path) {
      (this.strategy as CustomRouteReuseStrategy).clearRoute(path);
    } else {
      (this.strategy as CustomRouteReuseStrategy).clearAll();
    }
  }
}
```

### 9. テスト容易性の確保

RouteReuseStrategyをテストしやすい設計にします。

```typescript
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // テスト用のメソッド
  getStoredRoutesForTesting(): Map<string, DetachedRouteHandle> {
    return new Map(this.storedRoutes);
  }
}
```

### 10. パフォーマンスモニタリング

キャッシュのヒット率やメモリ使用量をモニタリングします。

```typescript
export class MonitoredRouteReuseStrategy implements RouteReuseStrategy {
  private hits = 0;
  private misses = 0;

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const shouldAttach = /* ロジック */;
    if (shouldAttach) {
      this.hits++;
    } else {
      this.misses++;
    }
    console.log('Cache hit rate:', (this.hits / (this.hits + this.misses) * 100).toFixed(2) + '%');
    return shouldAttach;
  }
}
```

## よくある間違い

### 1. メモリリークの発生

すべてのルートを無制限に保存してしまう。

```typescript
// 悪い例
export class BadRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true; // すべて保存 - メモリリーク！
  }

  // クリーンアップ処理なし
}

// 良い例
export class GoodRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();
  private readonly MAX_SIZE = 5;

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['reuse'] === true; // 選択的に保存
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (this.storedRoutes.size >= this.MAX_SIZE) {
      this.removeOldest();
    }
    // 保存...
  }
}
```

### 2. ストレージキーの衝突

ルートパスの生成方法が不適切で、異なるルートが同じキーになる。

```typescript
// 悪い例
private getRoutePath(route: ActivatedRouteSnapshot): string {
  return route.url.join('/'); // pathFromRootを考慮していない
}

// 良い例
private getRoutePath(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map(r => r.url.map(segment => segment.toString()).join('/'))
    .join('/');
}
```

### 3. パラメータ変更時の問題

パラメータが変わっても同じキャッシュを使ってしまう。

```typescript
// 悪い例
private getStorageKey(route: ActivatedRouteSnapshot): string {
  return route.routeConfig?.path || ''; // パラメータを無視
}

// 良い例
private getStorageKey(route: ActivatedRouteSnapshot): string {
  const path = this.getRoutePath(route);
  if (route.data['reuseWithParams']) {
    const params = JSON.stringify(route.params);
    return `${path}?${params}`;
  }
  return path;
}
```

### 4. ログアウト時のキャッシュ削除忘れ

ユーザーがログアウトしてもキャッシュが残り、セキュリティリスクになる。

```typescript
// 悪い例
logout(): void {
  this.authService.clearToken();
  this.router.navigate(['/login']);
  // キャッシュが残ったまま
}

// 良い例
logout(): void {
  this.routeReuseService.clearAllCaches();
  this.authService.clearToken();
  this.router.navigate(['/login']);
}
```

### 5. shouldReuseRouteの誤った実装

常にfalseを返してしまい、再利用が機能しない。

```typescript
// 悪い例
shouldReuseRoute(
  future: ActivatedRouteSnapshot,
  curr: ActivatedRouteSnapshot
): boolean {
  return false; // 常に新しいコンポーネントを作成
}

// 良い例
shouldReuseRoute(
  future: ActivatedRouteSnapshot,
  curr: ActivatedRouteSnapshot
): boolean {
  return future.routeConfig === curr.routeConfig;
}
```

### 6. 非同期データのハンドリング不足

保存時に進行中の非同期処理が適切に処理されない。

```typescript
// 悪い例
export class BadComponent implements OnDestroy {
  ngOnDestroy(): void {
    // Subscriptionの解除なし
  }
}

// 良い例
export class GoodComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 7. 子ルートの考慮不足

親ルートだけを再利用し、子ルートが考慮されていない。

```typescript
// 悪い例
private getRoutePath(route: ActivatedRouteSnapshot): string {
  return route.url.join('/'); // 子ルートを無視
}

// 良い例
private getRoutePath(route: ActivatedRouteSnapshot): string {
  // pathFromRootで完全なパスを取得
  return route.pathFromRoot
    .filter(r => r.url.length > 0)
    .map(r => r.url.map(s => s.path).join('/'))
    .join('/');
}
```

### 8. デバッグの難しさ

ログや状態確認の手段がなく、問題の診断が困難。

```typescript
// 悪い例
store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
  this.storedRoutes.set(path, handle);
  // ログなし
}

// 良い例
store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
  const path = this.getRoutePath(route);
  this.storedRoutes.set(path, handle);
  console.log('[RouteReuse] Stored:', path, 'Total:', this.storedRoutes.size);
}
```

### 9. テストの欠如

RouteReuseStrategyのテストがなく、リグレッションが発生しやすい。

```typescript
// 良い例：テストの実装
describe('CustomRouteReuseStrategy', () => {
  let strategy: CustomRouteReuseStrategy;

  beforeEach(() => {
    strategy = new CustomRouteReuseStrategy();
  });

  it('should store route when reuse is true', () => {
    const route = createMockRoute({ data: { reuse: true } });
    const handle = {} as DetachedRouteHandle;

    expect(strategy.shouldDetach(route)).toBe(true);
    strategy.store(route, handle);
    expect(strategy.shouldAttach(route)).toBe(true);
  });
});
```

### 10. パフォーマンスへの過信

RouteReuseStrategyが常にパフォーマンス向上につながると誤解する。

```typescript
// 悪い例：大量のデータを持つコンポーネントを保存
{
  path: 'large-data',
  component: LargeDataComponent,
  data: { reuse: true } // メモリを大量消費
}

// 良い例：軽量なコンポーネントのみ保存
{
  path: 'search-results',
  component: SearchResultsComponent,
  data: {
    reuse: true,
    maxCacheSize: 1024 * 1024 // 1MB制限
  }
}
```

## 演習問題

### 初級

#### 演習1: 基本的なRouteReuseStrategyの実装

タスク：
1. シンプルなRouteReuseStrategyを実装
2. `data.reuse`フラグに基づいてルートを再利用
3. 最大3つのルートを保存
4. コンソールにログを出力

期待される動作：
- reuseフラグがtrueのルートのみ保存される
- 3つを超えるルートは保存されない
- すべての操作がログに記録される

#### 演習2: タブナビゲーションの実装

タスク：
1. 3つのタブを持つタブナビゲーションを作成
2. 各タブにカウンターを配置
3. タブを切り替えてもカウンターの値が保持される
4. RouteReuseStrategyを使用して実装

期待される動作：
- タブ間を移動してもカウンターの値が保持される
- 各タブのスクロール位置が保持される

### 中級

#### 演習1: パラメータ付きルートの再利用

タスク：
1. IDパラメータを持つ詳細ページを作成
2. 同じIDの場合はコンポーネントを再利用
3. 異なるIDの場合は新しいコンポーネントを作成
4. パラメータ変更を検出して適切に処理

期待される動作：
- `/details/1`から`/details/1`への移動では再利用
- `/details/1`から`/details/2`への移動では新規作成
- パラメータが変わった際に適切にデータが更新される

#### 演習2: メモリ管理の実装

タスク：
1. 有効期限付きのRouteReuseStrategyを実装
2. 5分以上古いキャッシュを自動削除
3. 最大5つまでのルートを保存
4. メモリ使用量の推定を実装

期待される動作：
- 古いキャッシュが自動的に削除される
- 最大保存数を超えると最も古いものが削除される
- メモリ使用量がログに出力される

### 上級

#### 演習1: 高度なキャッシュ戦略

タスク：
1. 優先度ベースのキャッシュ戦略を実装
2. ルートごとに優先度を設定可能にする
3. メモリ不足時は優先度の低いルートから削除
4. アクセス頻度を記録し、よく使われるルートを優先

期待される動作：
- 優先度の高いルートが長く保持される
- アクセス頻度が高いルートが優先的に保持される
- メモリ使用量が閾値を超えると自動的に最適化される

実装のヒント：
```typescript
interface PrioritizedRoute {
  handle: DetachedRouteHandle;
  priority: number;
  accessCount: number;
  lastAccessed: number;
}
```

#### 演習2: 状態同期システム

タスク：
1. RouteReuseStrategyと状態管理を統合
2. キャッシュされたコンポーネントの状態をStoreと同期
3. ログアウト時にすべてのキャッシュと状態をクリア
4. キャッシュの復元時に最新の状態を反映

期待される動作：
- コンポーネントがキャッシュから復元される際、Storeの状態が反映される
- ユーザーアクションによる状態変更がキャッシュに反映される
- ログアウト時に完全にクリーンアップされる

実装のヒント：
```typescript
interface RouteState {
  handle: DetachedRouteHandle;
  storeSnapshot: any;
  timestamp: number;
}
```

## 次のステップへのリンク

RouteReuseStrategyの基礎を学んだら、次のトピックに進みましょう：

- [Deep Linking](../deep-linking/README.md) - フラグメントとスクロール制御
- [Routing Animations](../routing-animations/README.md) - ルート遷移のアニメーション
- [Performance](../performance/README.md) - ルーティングのパフォーマンス最適化
- [State Management](../state-management/README.md) - ルーターと状態管理の統合

## 参考リンク

- [Angular Router API - RouteReuseStrategy](https://angular.dev/api/router/RouteReuseStrategy)
- [Angular Router Guide](https://angular.dev/guide/routing)
- [Component Lifecycle Hooks](https://angular.dev/guide/components/lifecycle)

## まとめ

RouteReuseStrategyは、Angularアプリケーションのパフォーマンスとユーザーエクスペリエンスを向上させる強力なツールです。適切に実装することで、以下のメリットが得られます：

- コンポーネントの状態保持
- パフォーマンスの向上
- ユーザーエクスペリエンスの改善
- ネットワークリクエストの削減

ただし、メモリ管理やセキュリティに注意し、適切にクリーンアップを行うことが重要です。
