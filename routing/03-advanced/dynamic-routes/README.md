# 動的ルート生成 (Dynamic Routes)

## 学習内容

- 実行時の動的ルート登録と設定変更
- データベースやAPIから取得した情報に基づくルート生成
- マルチテナント対応のルーティング戦略
- プラグイン/モジュール式アーキテクチャでのルート管理
- パフォーマンスを考慮した動的ルートの最適化

## セクションの説明

従来の静的なルート定義では、すべてのルートをコンパイル時に決定する必要がありました。しかし、現代のWebアプリケーションでは、ユーザーの権限、テナント情報、プラグインシステムなどに応じて動的にルートを生成する必要があります。

このセクションでは、Angular 18の最新機能を活用し、実行時にルートを動的に生成・管理する高度な手法を学びます。Standalone Components、関数型guards、Signalを使用した最新のパターンを詳しく解説します。

## 実装例

### 例1: 基本的な動的ルート登録

```typescript
// dynamic-route.service.ts
import { Injectable, signal } from '@angular/core';
import { Router, Routes, Route } from '@angular/router';
import { Type } from '@angular/core';

export interface DynamicRouteConfig {
  path: string;
  component: Type<any>;
  title?: string;
  data?: any;
  canActivate?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DynamicRouteService {
  private registeredRoutes = signal<Map<string, DynamicRouteConfig>>(new Map());
  routes = this.registeredRoutes.asReadonly();

  constructor(private router: Router) {}

  /**
   * 新しいルートを動的に登録
   */
  registerRoute(config: DynamicRouteConfig): void {
    const currentRoutes = this.router.config;
    const newRoute: Route = {
      path: config.path,
      component: config.component,
      title: config.title,
      data: config.data,
      canActivate: config.canActivate
    };

    // ワイルドカードルートの前に挿入
    const wildcardIndex = currentRoutes.findIndex(r => r.path === '**');
    if (wildcardIndex !== -1) {
      currentRoutes.splice(wildcardIndex, 0, newRoute);
    } else {
      currentRoutes.push(newRoute);
    }

    this.router.resetConfig(currentRoutes);

    // 登録済みルートを記録
    this.registeredRoutes.update(routes => {
      const updated = new Map(routes);
      updated.set(config.path, config);
      return updated;
    });

    console.log(`Route registered: ${config.path}`);
  }

  /**
   * 複数のルートを一括登録
   */
  registerRoutes(configs: DynamicRouteConfig[]): void {
    configs.forEach(config => this.registerRoute(config));
  }

  /**
   * ルートを削除
   */
  unregisterRoute(path: string): void {
    const currentRoutes = this.router.config.filter(r => r.path !== path);
    this.router.resetConfig(currentRoutes);

    this.registeredRoutes.update(routes => {
      const updated = new Map(routes);
      updated.delete(path);
      return updated;
    });

    console.log(`Route unregistered: ${path}`);
  }

  /**
   * ルートが登録されているか確認
   */
  isRouteRegistered(path: string): boolean {
    return this.registeredRoutes().has(path);
  }

  /**
   * すべての動的ルートを取得
   */
  getAllDynamicRoutes(): DynamicRouteConfig[] {
    return Array.from(this.registeredRoutes().values());
  }
}
```

```typescript
// plugin.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plugin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plugin-container">
      <h2>{{ pluginName }}</h2>
      <p>{{ description }}</p>
      <div class="plugin-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .plugin-container {
      padding: 20px;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      margin: 10px;
    }
  `]
})
export class PluginComponent {
  @Input() pluginName = 'Plugin';
  @Input() description = 'A dynamic plugin component';
}
```

```typescript
// app.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { DynamicRouteService, DynamicRouteConfig } from './dynamic-route.service';
import { PluginComponent } from './plugin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <nav>
        <h3>動的ルート</h3>
        <a routerLink="/">ホーム</a>
        <a *ngFor="let route of dynamicRoutes()" [routerLink]="'/' + route.path">
          {{ route.title || route.path }}
        </a>
      </nav>

      <div class="controls">
        <button (click)="addDynamicRoute()">新しいルートを追加</button>
        <button (click)="removeDynamicRoute()">最後のルートを削除</button>
      </div>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    nav {
      background: #333;
      padding: 1rem;
      display: flex;
      gap: 1rem;
    }
    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    nav a:hover {
      background: #555;
    }
    .controls {
      padding: 1rem;
      background: #f5f5f5;
      display: flex;
      gap: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  dynamicRoutes = signal<DynamicRouteConfig[]>([]);
  routeCounter = 0;

  constructor(private dynamicRouteService: DynamicRouteService) {}

  ngOnInit(): void {
    this.updateDynamicRoutes();
  }

  addDynamicRoute(): void {
    this.routeCounter++;
    const config: DynamicRouteConfig = {
      path: `plugin-${this.routeCounter}`,
      component: PluginComponent,
      title: `Plugin ${this.routeCounter}`,
      data: {
        pluginName: `Dynamic Plugin ${this.routeCounter}`,
        description: `This is dynamically registered plugin #${this.routeCounter}`
      }
    };

    this.dynamicRouteService.registerRoute(config);
    this.updateDynamicRoutes();
  }

  removeDynamicRoute(): void {
    const routes = this.dynamicRouteService.getAllDynamicRoutes();
    if (routes.length > 0) {
      const lastRoute = routes[routes.length - 1];
      this.dynamicRouteService.unregisterRoute(lastRoute.path);
      this.updateDynamicRoutes();
    }
  }

  private updateDynamicRoutes(): void {
    this.dynamicRoutes.set(this.dynamicRouteService.getAllDynamicRoutes());
  }
}
```

### 例2: APIベースの動的ルート生成

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface PageConfig {
  id: string;
  path: string;
  title: string;
  componentType: 'article' | 'gallery' | 'form' | 'dashboard';
  data: any;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private mockPages: PageConfig[] = [
    {
      id: '1',
      path: 'dynamic-article',
      title: '動的記事',
      componentType: 'article',
      data: {
        content: 'これはAPIから取得した動的コンテンツです。',
        author: 'Admin'
      }
    },
    {
      id: '2',
      path: 'dynamic-gallery',
      title: '動的ギャラリー',
      componentType: 'gallery',
      data: {
        images: [
          'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+1',
          'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Image+2',
          'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Image+3'
        ]
      }
    },
    {
      id: '3',
      path: 'admin-dashboard',
      title: '管理ダッシュボード',
      componentType: 'dashboard',
      data: {
        widgets: ['users', 'stats', 'reports']
      },
      permissions: ['admin']
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * サーバーからページ設定を取得（モック）
   */
  getPageConfigs(): Observable<PageConfig[]> {
    // 実際の実装ではHTTPリクエストを使用
    // return this.http.get<PageConfig[]>('/api/pages');

    // モック実装
    return of(this.mockPages).pipe(delay(500));
  }

  /**
   * 特定のページ設定を取得
   */
  getPageConfig(id: string): Observable<PageConfig | undefined> {
    const page = this.mockPages.find(p => p.id === id);
    return of(page).pipe(delay(200));
  }

  /**
   * 新しいページを作成
   */
  createPage(config: Omit<PageConfig, 'id'>): Observable<PageConfig> {
    const newPage: PageConfig = {
      ...config,
      id: Date.now().toString()
    };
    this.mockPages.push(newPage);
    return of(newPage).pipe(delay(300));
  }

  /**
   * ページを削除
   */
  deletePage(id: string): Observable<boolean> {
    const index = this.mockPages.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPages.splice(index, 1);
      return of(true).pipe(delay(200));
    }
    return of(false).pipe(delay(200));
  }
}
```

```typescript
// dynamic-components.ts
import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dynamic-article',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="article">
      <h1>{{ data().title || 'Article' }}</h1>
      <p class="author">作成者: {{ data().author }}</p>
      <div class="content">{{ data().content }}</div>
    </article>
  `,
  styles: [`
    .article {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .author {
      color: #666;
      font-style: italic;
    }
    .content {
      line-height: 1.6;
      margin-top: 2rem;
    }
  `]
})
export class DynamicArticleComponent implements OnInit {
  data = signal<any>({});

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.data.set(routeData['pageData'] || {});
  }
}

@Component({
  selector: 'app-dynamic-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery">
      <h1>{{ data().title || 'Gallery' }}</h1>
      <div class="images">
        <img *ngFor="let image of data().images"
             [src]="image"
             [alt]="'Gallery image'"
             class="gallery-image" />
      </div>
    </div>
  `,
  styles: [`
    .gallery {
      padding: 2rem;
    }
    .images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .gallery-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
  `]
})
export class DynamicGalleryComponent implements OnInit {
  data = signal<any>({});

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.data.set(routeData['pageData'] || {});
  }
}

@Component({
  selector: 'app-dynamic-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>{{ data().title || 'Dashboard' }}</h1>
      <div class="widgets">
        <div *ngFor="let widget of data().widgets" class="widget">
          <h3>{{ widget }}</h3>
          <p>Widget content for {{ widget }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    .widgets {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .widget {
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class DynamicDashboardComponent implements OnInit {
  data = signal<any>({});

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.data.set(routeData['pageData'] || {});
  }
}
```

```typescript
// api-route-loader.service.ts
import { Injectable, Type } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, PageConfig } from './api.service';
import { DynamicArticleComponent } from './dynamic-components';
import { DynamicGalleryComponent } from './dynamic-components';
import { DynamicDashboardComponent } from './dynamic-components';
import { authGuard, roleGuard } from './guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class ApiRouteLoaderService {
  private componentMap: { [key: string]: Type<any> } = {
    'article': DynamicArticleComponent,
    'gallery': DynamicGalleryComponent,
    'dashboard': DynamicDashboardComponent
  };

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  /**
   * APIからルート設定を読み込んで登録
   */
  async loadRoutesFromApi(): Promise<void> {
    try {
      const pageConfigs = await this.apiService.getPageConfigs().toPromise();

      if (!pageConfigs) return;

      const currentRoutes = this.router.config;
      const wildcardIndex = currentRoutes.findIndex(r => r.path === '**');

      pageConfigs.forEach(config => {
        const component = this.componentMap[config.componentType];
        if (!component) {
          console.warn(`Unknown component type: ${config.componentType}`);
          return;
        }

        const guards = [];
        if (config.permissions && config.permissions.length > 0) {
          guards.push(authGuard);
          config.permissions.forEach(permission => {
            guards.push(roleGuard(permission));
          });
        }

        const newRoute = {
          path: config.path,
          component: component,
          title: config.title,
          data: {
            pageData: config.data,
            pageId: config.id
          },
          canActivate: guards.length > 0 ? guards : undefined
        };

        if (wildcardIndex !== -1) {
          currentRoutes.splice(wildcardIndex, 0, newRoute);
        } else {
          currentRoutes.push(newRoute);
        }
      });

      this.router.resetConfig(currentRoutes);
      console.log('Dynamic routes loaded from API:', pageConfigs.length);
    } catch (error) {
      console.error('Failed to load routes from API:', error);
    }
  }

  /**
   * 特定のページを動的に追加
   */
  async addPageRoute(config: PageConfig): Promise<boolean> {
    const component = this.componentMap[config.componentType];
    if (!component) {
      console.error(`Unknown component type: ${config.componentType}`);
      return false;
    }

    const currentRoutes = this.router.config;
    const newRoute = {
      path: config.path,
      component: component,
      title: config.title,
      data: {
        pageData: config.data,
        pageId: config.id
      }
    };

    const wildcardIndex = currentRoutes.findIndex(r => r.path === '**');
    if (wildcardIndex !== -1) {
      currentRoutes.splice(wildcardIndex, 0, newRoute);
    } else {
      currentRoutes.push(newRoute);
    }

    this.router.resetConfig(currentRoutes);
    return true;
  }

  /**
   * ページルートを削除
   */
  removePageRoute(path: string): void {
    const currentRoutes = this.router.config.filter(r => r.path !== path);
    this.router.resetConfig(currentRoutes);
  }
}
```

```typescript
// app.config.ts
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { ApiRouteLoaderService } from './api-route-loader.service';

/**
 * アプリケーション起動時にAPIからルートを読み込む
 */
function initializeRoutes(routeLoader: ApiRouteLoaderService) {
  return () => routeLoader.loadRoutesFromApi();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRoutes,
      deps: [ApiRouteLoaderService],
      multi: true
    }
  ]
};
```

### 例3: マルチテナント対応の動的ルーティング

```typescript
// tenant.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  features: string[];
  routes: TenantRoute[];
}

export interface TenantRoute {
  path: string;
  title: string;
  componentType: string;
  enabled: boolean;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenantSignal = signal<Tenant | null>(null);
  currentTenant = this.currentTenantSignal.asReadonly();

  // テナントが持つ有効な機能
  enabledFeatures = computed(() => {
    const tenant = this.currentTenantSignal();
    return tenant?.features || [];
  });

  // テナント固有のルート
  tenantRoutes = computed(() => {
    const tenant = this.currentTenantSignal();
    return tenant?.routes.filter(r => r.enabled) || [];
  });

  private mockTenants: Map<string, Tenant> = new Map([
    ['tenant-a', {
      id: 'tenant-a',
      name: 'Tenant A Corporation',
      subdomain: 'tenant-a',
      theme: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#4ECDC4'
      },
      features: ['analytics', 'reports', 'export'],
      routes: [
        {
          path: 'analytics',
          title: 'アナリティクス',
          componentType: 'analytics',
          enabled: true
        },
        {
          path: 'reports',
          title: 'レポート',
          componentType: 'reports',
          enabled: true
        },
        {
          path: 'export',
          title: 'エクスポート',
          componentType: 'export',
          enabled: true
        }
      ]
    }],
    ['tenant-b', {
      id: 'tenant-b',
      name: 'Tenant B Industries',
      subdomain: 'tenant-b',
      theme: {
        primaryColor: '#45B7D1',
        secondaryColor: '#96CEB4'
      },
      features: ['billing', 'invoices'],
      routes: [
        {
          path: 'billing',
          title: '請求',
          componentType: 'billing',
          enabled: true
        },
        {
          path: 'invoices',
          title: '請求書',
          componentType: 'invoices',
          enabled: true
        },
        {
          path: 'analytics',
          title: 'アナリティクス',
          componentType: 'analytics',
          enabled: false // Tenant Bでは無効
        }
      ]
    }]
  ]);

  /**
   * サブドメインからテナントを特定
   */
  identifyTenantFromSubdomain(hostname: string): Observable<Tenant | null> {
    // 例: tenant-a.example.com -> tenant-a
    const subdomain = hostname.split('.')[0];
    const tenant = this.mockTenants.get(subdomain);
    return of(tenant || null).pipe(delay(200));
  }

  /**
   * テナントIDからテナント情報を取得
   */
  getTenantById(tenantId: string): Observable<Tenant | null> {
    const tenant = this.mockTenants.get(tenantId);
    return of(tenant || null).pipe(delay(100));
  }

  /**
   * 現在のテナントを設定
   */
  setCurrentTenant(tenant: Tenant): void {
    this.currentTenantSignal.set(tenant);
    this.applyTenantTheme(tenant.theme);
  }

  /**
   * テナントのテーマを適用
   */
  private applyTenantTheme(theme: Tenant['theme']): void {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }

  /**
   * 特定の機能が有効か確認
   */
  hasFeature(feature: string): boolean {
    return this.enabledFeatures().includes(feature);
  }
}
```

```typescript
// tenant-route-loader.service.ts
import { Injectable, Type } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService, TenantRoute } from './tenant.service';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// テナント固有のコンポーネント
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>アナリティクス</h1>
      <p>テナント: {{ tenantName() }}</p>
      <div class="charts">
        <div class="chart">訪問者数チャート</div>
        <div class="chart">コンバージョン率</div>
      </div>
    </div>
  `
})
export class AnalyticsComponent {
  tenantName = signal('');

  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService
  ) {
    const tenant = this.tenantService.currentTenant();
    this.tenantName.set(tenant?.name || 'Unknown');
  }
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>レポート</h1>
      <p>テナント: {{ tenantName() }}</p>
      <ul>
        <li>月次レポート</li>
        <li>年次レポート</li>
        <li>カスタムレポート</li>
      </ul>
    </div>
  `
})
export class ReportsComponent {
  tenantName = signal('');

  constructor(private tenantService: TenantService) {
    const tenant = this.tenantService.currentTenant();
    this.tenantName.set(tenant?.name || 'Unknown');
  }
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>請求管理</h1>
      <p>テナント: {{ tenantName() }}</p>
      <div class="billing-info">
        <p>現在のプラン: Premium</p>
        <p>次回請求日: 2025-02-01</p>
      </div>
    </div>
  `
})
export class BillingComponent {
  tenantName = signal('');

  constructor(private tenantService: TenantService) {
    const tenant = this.tenantService.currentTenant();
    this.tenantName.set(tenant?.name || 'Unknown');
  }
}

@Injectable({
  providedIn: 'root'
})
export class TenantRouteLoaderService {
  private componentMap: { [key: string]: Type<any> } = {
    'analytics': AnalyticsComponent,
    'reports': ReportsComponent,
    'billing': BillingComponent,
    'invoices': ReportsComponent, // 同じコンポーネントを再利用
    'export': ReportsComponent
  };

  constructor(
    private router: Router,
    private tenantService: TenantService
  ) {}

  /**
   * テナント固有のルートを読み込む
   */
  loadTenantRoutes(tenantId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.tenantService.getTenantById(tenantId).subscribe({
        next: (tenant) => {
          if (!tenant) {
            reject(new Error('Tenant not found'));
            return;
          }

          this.tenantService.setCurrentTenant(tenant);

          const currentRoutes = this.router.config;
          const baseIndex = currentRoutes.findIndex(r => r.path === 'dashboard');

          // 既存のテナント固有ルートを削除
          const filteredRoutes = currentRoutes.filter(r =>
            !r.data?.['isTenantRoute']
          );

          // 新しいテナントルートを追加
          tenant.routes
            .filter(route => route.enabled)
            .forEach((route, index) => {
              const component = this.componentMap[route.componentType];
              if (!component) {
                console.warn(`Unknown component type: ${route.componentType}`);
                return;
              }

              const newRoute = {
                path: route.path,
                component: component,
                title: `${tenant.name} - ${route.title}`,
                data: {
                  isTenantRoute: true,
                  tenantId: tenant.id,
                  permissions: route.permissions
                }
              };

              filteredRoutes.splice(baseIndex + 1 + index, 0, newRoute);
            });

          this.router.resetConfig(filteredRoutes);
          console.log(`Loaded ${tenant.routes.length} routes for tenant: ${tenant.name}`);
          resolve(true);
        },
        error: (error) => {
          console.error('Failed to load tenant:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * テナント切り替え
   */
  async switchTenant(tenantId: string): Promise<void> {
    await this.loadTenantRoutes(tenantId);
    // ダッシュボードにリダイレクト
    this.router.navigate(['/dashboard']);
  }
}
```

```typescript
// tenant-selector.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantRouteLoaderService } from './tenant-route-loader.service';
import { TenantService } from './tenant.service';

@Component({
  selector: 'app-tenant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tenant-selector">
      <h2>テナント選択</h2>
      <select [(ngModel)]="selectedTenant" (change)="onTenantChange()">
        <option value="">テナントを選択...</option>
        <option value="tenant-a">Tenant A Corporation</option>
        <option value="tenant-b">Tenant B Industries</option>
      </select>

      <div *ngIf="currentTenant()" class="tenant-info">
        <h3>現在のテナント: {{ currentTenant()!.name }}</h3>
        <p>有効な機能:</p>
        <ul>
          <li *ngFor="let feature of currentTenant()!.features">{{ feature }}</li>
        </ul>
      </div>

      <div *ngIf="loading()" class="loading">
        読み込み中...
      </div>
    </div>
  `,
  styles: [`
    .tenant-selector {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    select {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
      margin: 1rem 0;
    }
    .tenant-info {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class TenantSelectorComponent {
  selectedTenant = '';
  loading = signal(false);
  currentTenant = this.tenantService.currentTenant;

  constructor(
    private tenantRouteLoader: TenantRouteLoaderService,
    private tenantService: TenantService
  ) {}

  async onTenantChange(): Promise<void> {
    if (!this.selectedTenant) return;

    this.loading.set(true);
    try {
      await this.tenantRouteLoader.switchTenant(this.selectedTenant);
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      alert('テナントの切り替えに失敗しました');
    } finally {
      this.loading.set(false);
    }
  }
}
```

### 例4: 遅延読み込みと動的ルートの組み合わせ

```typescript
// lazy-dynamic-routes.service.ts
import { Injectable, Type, signal } from '@angular/core';
import { Router, Route, loadChildren } from '@angular/router';

export interface LazyRouteConfig {
  path: string;
  loadComponent: () => Promise<Type<any>>;
  title?: string;
  preload?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LazyDynamicRoutesService {
  private preloadedComponents = signal<Map<string, Type<any>>>(new Map());

  constructor(private router: Router) {}

  /**
   * 遅延読み込み可能なルートを動的に登録
   */
  registerLazyRoute(config: LazyRouteConfig): void {
    const currentRoutes = this.router.config;

    const newRoute: Route = {
      path: config.path,
      loadComponent: config.loadComponent,
      title: config.title
    };

    const wildcardIndex = currentRoutes.findIndex(r => r.path === '**');
    if (wildcardIndex !== -1) {
      currentRoutes.splice(wildcardIndex, 0, newRoute);
    } else {
      currentRoutes.push(newRoute);
    }

    this.router.resetConfig(currentRoutes);

    // プリロードが指定されている場合
    if (config.preload) {
      this.preloadComponent(config);
    }
  }

  /**
   * コンポーネントを事前読み込み
   */
  private async preloadComponent(config: LazyRouteConfig): Promise<void> {
    try {
      const component = await config.loadComponent();
      this.preloadedComponents.update(map => {
        const updated = new Map(map);
        updated.set(config.path, component);
        return updated;
      });
      console.log(`Preloaded component for route: ${config.path}`);
    } catch (error) {
      console.error(`Failed to preload component for ${config.path}:`, error);
    }
  }

  /**
   * 複数の遅延ルートを登録
   */
  registerLazyRoutes(configs: LazyRouteConfig[]): void {
    configs.forEach(config => this.registerLazyRoute(config));
  }

  /**
   * プリロード済みコンポーネントを取得
   */
  getPreloadedComponent(path: string): Type<any> | undefined {
    return this.preloadedComponents().get(path);
  }
}
```

```typescript
// dynamic-module-loader.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyDynamicRoutesService, LazyRouteConfig } from './lazy-dynamic-routes.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-module-loader',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="module-loader">
      <h2>動的モジュールローダー</h2>

      <div class="modules">
        <div *ngFor="let module of availableModules()" class="module-card">
          <h3>{{ module.name }}</h3>
          <p>{{ module.description }}</p>
          <button
            (click)="loadModule(module)"
            [disabled]="module.loaded"
            [class.loaded]="module.loaded">
            {{ module.loaded ? '読み込み済み' : '読み込む' }}
          </button>
          <a *ngIf="module.loaded"
             [routerLink]="'/' + module.path"
             class="view-link">
            表示
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .module-loader {
      padding: 2rem;
    }
    .modules {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .module-card {
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }
    .module-card h3 {
      margin-top: 0;
    }
    button {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      cursor: pointer;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    button.loaded {
      background: #2196F3;
    }
    .view-link {
      padding: 0.5rem 1rem;
      background: #FF9800;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    }
  `]
})
export class ModuleLoaderComponent implements OnInit {
  availableModules = signal([
    {
      id: 'charts',
      name: 'チャートモジュール',
      description: '高度なチャート表示機能',
      path: 'charts',
      loaded: false,
      preload: true
    },
    {
      id: 'calendar',
      name: 'カレンダーモジュール',
      description: 'カレンダーとスケジュール管理',
      path: 'calendar',
      loaded: false,
      preload: false
    },
    {
      id: 'editor',
      name: 'エディタモジュール',
      description: 'リッチテキストエディタ',
      path: 'editor',
      loaded: false,
      preload: false
    }
  ]);

  constructor(private lazyRouteService: LazyDynamicRoutesService) {}

  ngOnInit(): void {
    // 重要なモジュールをプリロード
    this.availableModules()
      .filter(m => m.preload)
      .forEach(m => this.loadModule(m));
  }

  async loadModule(module: any): Promise<void> {
    if (module.loaded) return;

    const config: LazyRouteConfig = {
      path: module.path,
      loadComponent: () => this.getModuleComponent(module.id),
      title: module.name,
      preload: module.preload
    };

    this.lazyRouteService.registerLazyRoute(config);

    // モジュールを読み込み済みとしてマーク
    this.availableModules.update(modules =>
      modules.map(m =>
        m.id === module.id ? { ...m, loaded: true } : m
      )
    );

    console.log(`Module loaded: ${module.name}`);
  }

  private async getModuleComponent(moduleId: string): Promise<any> {
    // 実際の実装では、各モジュールを別ファイルから読み込む
    switch (moduleId) {
      case 'charts':
        return import('./modules/charts.component').then(m => m.ChartsComponent);
      case 'calendar':
        return import('./modules/calendar.component').then(m => m.CalendarComponent);
      case 'editor':
        return import('./modules/editor.component').then(m => m.EditorComponent);
      default:
        throw new Error(`Unknown module: ${moduleId}`);
    }
  }
}
```

```typescript
// modules/charts.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="charts-module">
      <h1>チャートモジュール</h1>
      <p>このモジュールは動的に読み込まれました。</p>
      <div class="chart-placeholder">
        <p>チャートがここに表示されます</p>
      </div>
    </div>
  `,
  styles: [`
    .charts-module {
      padding: 2rem;
    }
    .chart-placeholder {
      margin-top: 2rem;
      padding: 4rem;
      border: 2px dashed #ccc;
      text-align: center;
      background: #f9f9f9;
    }
  `]
})
export class ChartsComponent {}
```

```typescript
// modules/calendar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-module">
      <h1>カレンダーモジュール</h1>
      <p>このモジュールは動的に読み込まれました。</p>
      <div class="calendar-placeholder">
        <p>カレンダーがここに表示されます</p>
      </div>
    </div>
  `,
  styles: [`
    .calendar-module {
      padding: 2rem;
    }
    .calendar-placeholder {
      margin-top: 2rem;
      padding: 4rem;
      border: 2px dashed #4CAF50;
      text-align: center;
      background: #f1f8f4;
    }
  `]
})
export class CalendarComponent {}
```

### 例5: 権限ベースの動的ルート生成

```typescript
// permission.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  private rolesMap = new Map<string, Role>([
    ['admin', {
      id: 'admin',
      name: '管理者',
      permissions: ['users.read', 'users.write', 'reports.read', 'reports.write', 'settings.write']
    }],
    ['editor', {
      id: 'editor',
      name: '編集者',
      permissions: ['reports.read', 'reports.write']
    }],
    ['viewer', {
      id: 'viewer',
      name: '閲覧者',
      permissions: ['reports.read']
    }]
  ]);

  // ユーザーの全権限を計算
  userPermissions = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return [];

    const permissions = new Set<string>();
    user.roles.forEach(roleId => {
      const role = this.rolesMap.get(roleId);
      role?.permissions.forEach(p => permissions.add(p));
    });

    return Array.from(permissions);
  });

  setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  hasRole(roleId: string): boolean {
    const user = this.currentUserSignal();
    return user?.roles.includes(roleId) || false;
  }
}
```

```typescript
// permission-based-routes.service.ts
import { Injectable, Type } from '@angular/core';
import { Router, Route } from '@angular/router';
import { PermissionService } from './permission.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 権限別コンポーネント
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>ユーザー管理</h1>
      <p>権限: users.read, users.write</p>
      <p>管理者のみアクセス可能</p>
    </div>
  `
})
export class UserManagementComponent {}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>レポート</h1>
      <p>権限: reports.read</p>
      <p>編集者と管理者がアクセス可能</p>
    </div>
  `
})
export class ReportsComponent {}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>設定</h1>
      <p>権限: settings.write</p>
      <p>管理者のみアクセス可能</p>
    </div>
  `
})
export class SettingsComponent {}

export interface PermissionRoute {
  path: string;
  component: Type<any>;
  title: string;
  requiredPermissions: string[];
  requireAll?: boolean; // true: すべての権限が必要, false: いずれかの権限があればOK
}

@Injectable({
  providedIn: 'root'
})
export class PermissionBasedRoutesService {
  private availableRoutes: PermissionRoute[] = [
    {
      path: 'users',
      component: UserManagementComponent,
      title: 'ユーザー管理',
      requiredPermissions: ['users.read', 'users.write'],
      requireAll: true
    },
    {
      path: 'reports',
      component: ReportsComponent,
      title: 'レポート',
      requiredPermissions: ['reports.read'],
      requireAll: false
    },
    {
      path: 'settings',
      component: SettingsComponent,
      title: '設定',
      requiredPermissions: ['settings.write'],
      requireAll: false
    }
  ];

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  /**
   * ユーザーの権限に基づいてルートを生成
   */
  generateRoutesForCurrentUser(): void {
    const currentRoutes = this.router.config;

    // 既存の権限ベースルートを削除
    const filteredRoutes = currentRoutes.filter(r =>
      !r.data?.['isPermissionRoute']
    );

    // ユーザーがアクセス可能なルートのみ追加
    this.availableRoutes.forEach(routeConfig => {
      if (this.canAccessRoute(routeConfig)) {
        const newRoute: Route = {
          path: routeConfig.path,
          component: routeConfig.component,
          title: routeConfig.title,
          data: {
            isPermissionRoute: true,
            permissions: routeConfig.requiredPermissions
          }
        };

        const wildcardIndex = filteredRoutes.findIndex(r => r.path === '**');
        if (wildcardIndex !== -1) {
          filteredRoutes.splice(wildcardIndex, 0, newRoute);
        } else {
          filteredRoutes.push(newRoute);
        }
      }
    });

    this.router.resetConfig(filteredRoutes);
    console.log('Routes generated based on user permissions');
  }

  /**
   * ユーザーが特定のルートにアクセス可能か確認
   */
  private canAccessRoute(routeConfig: PermissionRoute): boolean {
    if (routeConfig.requireAll) {
      return this.permissionService.hasAllPermissions(routeConfig.requiredPermissions);
    } else {
      return this.permissionService.hasAnyPermission(routeConfig.requiredPermissions);
    }
  }

  /**
   * 現在のユーザーがアクセス可能なルートのリストを取得
   */
  getAccessibleRoutes(): PermissionRoute[] {
    return this.availableRoutes.filter(route => this.canAccessRoute(route));
  }
}
```

```typescript
// permission-demo.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PermissionService, User } from './permission.service';
import { PermissionBasedRoutesService } from './permission-based-routes.service';

@Component({
  selector: 'app-permission-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="permission-demo">
      <h2>権限ベース動的ルーティング</h2>

      <div class="user-selector">
        <h3>ユーザーを選択</h3>
        <select [(ngModel)]="selectedUser" (change)="onUserChange()">
          <option value="">ユーザーを選択...</option>
          <option value="admin">管理者（すべての権限）</option>
          <option value="editor">編集者（レポート編集）</option>
          <option value="viewer">閲覧者（レポート閲覧のみ）</option>
        </select>
      </div>

      <div *ngIf="currentUser()" class="user-info">
        <h3>現在のユーザー</h3>
        <p><strong>名前:</strong> {{ currentUser()!.name }}</p>
        <p><strong>ロール:</strong> {{ currentUser()!.roles.join(', ') }}</p>

        <h4>権限:</h4>
        <ul>
          <li *ngFor="let permission of userPermissions()">{{ permission }}</li>
        </ul>

        <h4>アクセス可能なページ:</h4>
        <ul>
          <li *ngFor="let route of accessibleRoutes()">
            <a [routerLink]="'/' + route.path">{{ route.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .permission-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .user-selector {
      margin: 2rem 0;
    }
    select {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    .user-info {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    h4 {
      margin-top: 1.5rem;
    }
    ul {
      margin: 0.5rem 0;
    }
    a {
      color: #2196F3;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class PermissionDemoComponent implements OnInit {
  selectedUser = '';
  currentUser = this.permissionService.currentUser;
  userPermissions = this.permissionService.userPermissions;
  accessibleRoutes = signal<any[]>([]);

  private mockUsers = new Map<string, User>([
    ['admin', {
      id: '1',
      name: '管理者ユーザー',
      email: 'admin@example.com',
      roles: ['admin']
    }],
    ['editor', {
      id: '2',
      name: '編集者ユーザー',
      email: 'editor@example.com',
      roles: ['editor']
    }],
    ['viewer', {
      id: '3',
      name: '閲覧者ユーザー',
      email: 'viewer@example.com',
      roles: ['viewer']
    }]
  ]);

  constructor(
    private permissionService: PermissionService,
    private permissionRoutesService: PermissionBasedRoutesService
  ) {}

  ngOnInit(): void {}

  onUserChange(): void {
    if (!this.selectedUser) return;

    const user = this.mockUsers.get(this.selectedUser);
    if (user) {
      this.permissionService.setCurrentUser(user);
      this.permissionRoutesService.generateRoutesForCurrentUser();
      this.accessibleRoutes.set(
        this.permissionRoutesService.getAccessibleRoutes()
      );
    }
  }
}
```

## ベストプラクティス

### 1. ルート登録のタイミング

```typescript
// ✅ 推奨: APP_INITIALIZERを使用してアプリ起動時に登録
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(baseRoutes),
    {
      provide: APP_INITIALIZER,
      useFactory: (routeLoader: DynamicRouteService) => {
        return () => routeLoader.loadInitialRoutes();
      },
      deps: [DynamicRouteService],
      multi: true
    }
  ]
};

// ❌ 非推奨: コンポーネント内で無秩序に登録
// ngOnInit() {
//   this.dynamicRouteService.registerRoute(...);
// }
```

### 2. ルート設定のバリデーション

```typescript
registerRoute(config: DynamicRouteConfig): boolean {
  // パスの検証
  if (!config.path || config.path.includes('//')) {
    console.error('Invalid route path:', config.path);
    return false;
  }

  // 重複チェック
  if (this.isRouteRegistered(config.path)) {
    console.warn('Route already registered:', config.path);
    return false;
  }

  // コンポーネントの検証
  if (!config.component) {
    console.error('Component is required for route:', config.path);
    return false;
  }

  // 実際の登録処理
  // ...
  return true;
}
```

### 3. メモリ管理とクリーンアップ

```typescript
export class DynamicRouteService implements OnDestroy {
  private routeSubscriptions = new Map<string, Subscription>();

  ngOnDestroy(): void {
    // すべてのサブスクリプションをクリーンアップ
    this.routeSubscriptions.forEach(sub => sub.unsubscribe());
    this.routeSubscriptions.clear();
  }

  unregisterRoute(path: string): void {
    // ルートを削除
    const currentRoutes = this.router.config.filter(r => r.path !== path);
    this.router.resetConfig(currentRoutes);

    // 関連するサブスクリプションをクリーンアップ
    const subscription = this.routeSubscriptions.get(path);
    if (subscription) {
      subscription.unsubscribe();
      this.routeSubscriptions.delete(path);
    }
  }
}
```

### 4. エラーハンドリング

```typescript
async loadRoutesFromApi(): Promise<void> {
  try {
    const configs = await firstValueFrom(this.apiService.getRouteConfigs());

    configs.forEach(config => {
      try {
        this.registerRoute(config);
      } catch (error) {
        console.error(`Failed to register route ${config.path}:`, error);
        // 個別のルート登録失敗でも続行
      }
    });
  } catch (error) {
    console.error('Failed to load routes from API:', error);
    // フォールバック: デフォルトルートを使用
    this.loadDefaultRoutes();
  }
}
```

### 5. パフォーマンス最適化

```typescript
// 遅延読み込みを活用
registerLazyRoute(config: LazyRouteConfig): void {
  const newRoute: Route = {
    path: config.path,
    loadComponent: () => config.loadComponent(),
    // loadChildrenも同様に使用可能
  };

  this.updateRouterConfig(newRoute);
}

// プリロード戦略の実装
preloadCriticalRoutes(): void {
  const criticalPaths = ['dashboard', 'profile'];

  criticalPaths.forEach(async path => {
    const config = this.getRouteConfig(path);
    if (config?.loadComponent) {
      await config.loadComponent();
    }
  });
}
```

### 6. 型安全性の確保

```typescript
// 厳密な型定義
interface TypedRouteConfig<T = any> {
  path: string;
  component: Type<T>;
  data?: Record<string, unknown>;
  guards?: Array<CanActivateFn>;
}

// ジェネリクスを使用した型安全な登録
registerTypedRoute<T>(config: TypedRouteConfig<T>): void {
  // TypeScriptが型をチェック
  const route: Route = {
    path: config.path,
    component: config.component,
    data: config.data,
    canActivate: config.guards
  };

  this.updateRouterConfig(route);
}
```

### 7. テスタビリティ

```typescript
// テスト可能な設計
export class DynamicRouteService {
  constructor(
    private router: Router,
    @Inject(ROUTE_CONFIG) private config: RouteConfiguration
  ) {}

  // 依存性注入を活用してモック可能に
}

// テスト
describe('DynamicRouteService', () => {
  let service: DynamicRouteService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['resetConfig']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ROUTE_CONFIG, useValue: testConfig }
      ]
    });

    service = TestBed.inject(DynamicRouteService);
  });
});
```

### 8. ドキュメンテーション

```typescript
/**
 * 動的ルート登録サービス
 *
 * @example
 * ```typescript
 * dynamicRouteService.registerRoute({
 *   path: 'my-page',
 *   component: MyPageComponent,
 *   title: 'My Page',
 *   data: { requiresAuth: true }
 * });
 * ```
 *
 * @remarks
 * - ワイルドカードルート(**)の前に新しいルートを挿入します
 * - 既存のルートと同じパスは登録できません
 * - ルート登録後、router.navigateで即座に使用可能です
 */
export class DynamicRouteService {
  // ...
}
```

### 9. セキュリティ考慮事項

```typescript
// XSS対策: パスのサニタイズ
private sanitizePath(path: string): string {
  // 危険な文字を除去
  return path.replace(/[<>\"']/g, '');
}

// 権限チェック
registerSecureRoute(config: DynamicRouteConfig, userPermissions: string[]): boolean {
  if (!this.hasRequiredPermissions(config, userPermissions)) {
    console.warn('Insufficient permissions to register route:', config.path);
    return false;
  }

  return this.registerRoute(config);
}
```

### 10. デバッグとログ

```typescript
export class DynamicRouteService {
  private enableDebugMode = inject(IS_DEV_MODE);

  registerRoute(config: DynamicRouteConfig): void {
    if (this.enableDebugMode) {
      console.group(`Registering route: ${config.path}`);
      console.log('Config:', config);
      console.log('Current routes:', this.router.config.length);
    }

    // 登録処理
    this.performRegistration(config);

    if (this.enableDebugMode) {
      console.log('New routes count:', this.router.config.length);
      console.groupEnd();
    }
  }
}
```

## よくある間違い

### 1. ワイルドカードルートの扱い

```typescript
// ❌ 間違い: ワイルドカードルートの後に追加
const routes = this.router.config;
routes.push(newRoute); // **の後に追加されてしまう

// ✅ 正しい: ワイルドカードルートの前に挿入
const wildcardIndex = routes.findIndex(r => r.path === '**');
if (wildcardIndex !== -1) {
  routes.splice(wildcardIndex, 0, newRoute);
} else {
  routes.push(newRoute);
}
```

### 2. resetConfigの呼び忘れ

```typescript
// ❌ 間違い: 配列を変更しただけでは反映されない
const routes = this.router.config;
routes.push(newRoute);
// ルートが追加されない!

// ✅ 正しい: resetConfigを呼び出す
const routes = this.router.config;
routes.push(newRoute);
this.router.resetConfig(routes);
```

### 3. 非同期処理の適切な待機

```typescript
// ❌ 間違い: Promiseを待たない
loadAndNavigate(path: string): void {
  this.loadRouteFromApi(path); // Promiseを無視
  this.router.navigate([path]); // ルートがまだ登録されていない
}

// ✅ 正しい: 非同期処理を待つ
async loadAndNavigate(path: string): Promise<void> {
  await this.loadRouteFromApi(path);
  await this.router.navigate([path]);
}
```

### 4. メモリリーク

```typescript
// ❌ 間違い: Observableをunsubscribeしない
ngOnInit(): void {
  this.apiService.getRoutes().subscribe(routes => {
    this.registerRoutes(routes);
  }); // メモリリーク!
}

// ✅ 正しい: takeUntilDestroyedを使用
private destroyRef = inject(DestroyRef);

ngOnInit(): void {
  this.apiService.getRoutes()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(routes => {
      this.registerRoutes(routes);
    });
}
```

### 5. ルートの重複登録

```typescript
// ❌ 間違い: 既存ルートをチェックしない
registerRoute(config: DynamicRouteConfig): void {
  const routes = this.router.config;
  routes.push({ path: config.path, ... }); // 重複する可能性
  this.router.resetConfig(routes);
}

// ✅ 正しい: 重複チェックを実装
registerRoute(config: DynamicRouteConfig): void {
  const routes = this.router.config;

  // 既存ルートをチェック
  const existingIndex = routes.findIndex(r => r.path === config.path);
  if (existingIndex !== -1) {
    console.warn(`Route ${config.path} already exists`);
    return;
  }

  routes.push({ path: config.path, ... });
  this.router.resetConfig(routes);
}
```

### 6. 循環依存

```typescript
// ❌ 間違い: サービス間で循環依存
// dynamic-route.service.ts
constructor(private apiService: ApiService) {}

// api.service.ts
constructor(private dynamicRouteService: DynamicRouteService) {} // 循環!

// ✅ 正しい: イベントベースの通信を使用
// dynamic-route.service.ts
private routeRegistered = new Subject<string>();
routeRegistered$ = this.routeRegistered.asObservable();

registerRoute(config: DynamicRouteConfig): void {
  // ...
  this.routeRegistered.next(config.path);
}
```

### 7. ガードの動的追加

```typescript
// ❌ 間違い: ガードを文字列で指定
const newRoute = {
  path: 'admin',
  component: AdminComponent,
  canActivate: ['AuthGuard'] // 動作しない!
};

// ✅ 正しい: 実際のガード関数を使用
const newRoute = {
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard('admin')]
};
```

### 8. データの不変性違反

```typescript
// ❌ 間違い: 元の配列を直接変更
const routes = this.router.config;
routes.push(newRoute);
routes[0].data = { ...routes[0].data, modified: true }; // 副作用!

// ✅ 正しい: 新しい配列を作成
const routes = [...this.router.config];
routes.push(newRoute);
this.router.resetConfig(routes);
```

### 9. コンポーネントの型の不一致

```typescript
// ❌ 間違い: any型を使用
const component: any = getDynamicComponent(); // 型安全性がない

// ✅ 正しい: Type<any>を使用
const component: Type<any> = getDynamicComponent();
```

### 10. エラーハンドリングの欠如

```typescript
// ❌ 間違い: エラーを無視
async loadRoutes(): Promise<void> {
  const routes = await this.apiService.getRoutes().toPromise();
  routes.forEach(r => this.registerRoute(r));
}

// ✅ 正しい: 適切なエラーハンドリング
async loadRoutes(): Promise<void> {
  try {
    const routes = await firstValueFrom(this.apiService.getRoutes());

    routes.forEach(r => {
      try {
        this.registerRoute(r);
      } catch (error) {
        console.error(`Failed to register route ${r.path}:`, error);
      }
    });
  } catch (error) {
    console.error('Failed to load routes:', error);
    this.loadFallbackRoutes();
  }
}
```

## 演習問題

### 初級

#### 演習1: 基本的な動的ルート登録

動的にルートを追加・削除できるシンプルなアプリケーションを作成してください。

要件:
1. "Add Route"ボタンでルートを追加
2. "Remove Route"ボタンで最後のルートを削除
3. ナビゲーションメニューに動的ルートを表示
4. 各ルートに簡単なコンテンツを表示

<details>
<summary>ヒント</summary>

- DynamicRouteServiceを作成
- router.resetConfig()を使用
- Signalでルートリストを管理
- *ngForでナビゲーションリンクを生成

</details>

#### 演習2: クエリパラメータから動的ルートを生成

URLのクエリパラメータに基づいて動的にルートを生成してください。

例: `/admin?modules=users,reports,settings`

要件:
1. クエリパラメータからモジュール名を取得
2. 各モジュールに対応するルートを動的に登録
3. 無効なモジュール名をフィルタリング

<details>
<summary>ヒント</summary>

- ActivatedRouteでクエリパラメータを取得
- split()で配列に変換
- Map<string, Component>でモジュール名とコンポーネントをマッピング
- APP_INITIALIZERで初期化

</details>

### 中級

#### 演習3: APIベースの動的ページシステム

サーバーから取得したページ設定に基づいて動的にルートを生成するシステムを実装してください。

要件:
1. APIからページ設定を取得（モックでOK）
2. ページタイプに応じて異なるコンポーネントを使用
3. ページデータをコンポーネントに渡す
4. エラーハンドリング
5. ローディング状態の表示

<details>
<summary>解答例の要点</summary>

```typescript
// 1. ページ設定のインターフェース定義
interface PageConfig {
  id: string;
  path: string;
  type: 'article' | 'gallery' | 'form';
  data: any;
}

// 2. コンポーネントマップ
private componentMap = {
  'article': ArticleComponent,
  'gallery': GalleryComponent,
  'form': FormComponent
};

// 3. ルート生成
async loadPages() {
  const pages = await this.api.getPages().toPromise();
  pages.forEach(page => {
    const component = this.componentMap[page.type];
    this.registerRoute({
      path: page.path,
      component,
      data: { pageData: page.data }
    });
  });
}
```

</details>

#### 演習4: ユーザー権限に基づく動的メニュー

ユーザーの権限に応じて動的にナビゲーションメニューとルートを生成してください。

要件:
1. ユーザーロールに基づいて利用可能なページを決定
2. 権限のないページへのルートは登録しない
3. ナビゲーションメニューも権限に応じて表示
4. ロール切り替え機能
5. 権限のないページへの直接アクセスを防ぐ

<details>
<summary>解答例の要点</summary>

```typescript
// 1. 権限定義
const routePermissions = {
  'admin/users': ['admin'],
  'admin/settings': ['admin'],
  'reports': ['admin', 'editor'],
  'dashboard': ['admin', 'editor', 'viewer']
};

// 2. ユーザー権限チェック
hasAccess(route: string, userRoles: string[]): boolean {
  const required = routePermissions[route];
  return userRoles.some(role => required.includes(role));
}

// 3. 動的ルート生成
generateRoutesForUser(user: User): void {
  Object.entries(routePermissions).forEach(([path, roles]) => {
    if (this.hasAccess(path, user.roles)) {
      this.registerRoute({
        path,
        component: this.getComponent(path),
        canActivate: [roleGuard(roles)]
      });
    }
  });
}
```

</details>

### 上級

#### 演習5: プラグインシステムの実装

外部からプラグインを読み込んで動的にルートと機能を追加できるシステムを実装してください。

要件:
1. プラグインマニフェスト（JSON）の定義
2. 動的なコンポーネント読み込み（import()）
3. プラグイン間の依存関係管理
4. プラグインの有効化/無効化
5. プラグインのホットリロード
6. プラグインごとの設定画面

<details>
<summary>解答例の骨格</summary>

```typescript
// plugin.manifest.json
{
  "id": "analytics-plugin",
  "name": "Analytics Plugin",
  "version": "1.0.0",
  "routes": [
    {
      "path": "analytics/dashboard",
      "component": "./dashboard.component"
    }
  ],
  "dependencies": [],
  "permissions": ["analytics.read"]
}

// plugin-loader.service.ts
export class PluginLoaderService {
  async loadPlugin(manifestUrl: string): Promise<Plugin> {
    const manifest = await this.http.get<PluginManifest>(manifestUrl).toPromise();

    // 依存関係チェック
    await this.checkDependencies(manifest.dependencies);

    // コンポーネント読み込み
    const components = await Promise.all(
      manifest.routes.map(r => this.loadComponent(r.component))
    );

    // ルート登録
    this.registerPluginRoutes(manifest, components);

    return {
      manifest,
      enabled: true,
      components
    };
  }

  private async loadComponent(path: string): Promise<Type<any>> {
    const module = await import(path);
    return module.default || Object.values(module)[0];
  }
}
```

</details>

#### 演習6: マルチテナントSaaSアプリケーション

複数のテナントが異なる機能セットを持つSaaSアプリケーションのルーティングシステムを実装してください。

要件:
1. サブドメインからテナントを識別
2. テナントごとに異なる機能とルート
3. テナントのテーマ（色、ロゴ）を動的に適用
4. テナントごとの利用可能機能の制御
5. テナント設定のキャッシング
6. テナント切り替え時のスムーズな遷移

<details>
<summary>解答例の骨格</summary>

```typescript
// tenant-config.interface.ts
interface TenantConfig {
  id: string;
  subdomain: string;
  name: string;
  features: Feature[];
  theme: Theme;
  routes: RouteConfig[];
}

// tenant-initializer.service.ts
export class TenantInitializerService {
  async initialize(): Promise<void> {
    const hostname = window.location.hostname;
    const tenant = await this.identifyTenant(hostname);

    if (!tenant) {
      this.router.navigate(['/tenant-not-found']);
      return;
    }

    // テーマ適用
    this.applyTheme(tenant.theme);

    // ルート生成
    await this.generateTenantRoutes(tenant);

    // 機能フラグ設定
    this.featureFlagService.setFeatures(tenant.features);
  }

  private async generateTenantRoutes(tenant: TenantConfig): Promise<void> {
    tenant.routes.forEach(routeConfig => {
      if (this.isFeatureEnabled(routeConfig.feature)) {
        this.dynamicRouteService.registerRoute({
          path: routeConfig.path,
          loadComponent: () => import(routeConfig.componentPath),
          data: { tenant: tenant.id }
        });
      }
    });
  }
}

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: TenantInitializerService) => {
        return () => initializer.initialize();
      },
      deps: [TenantInitializerService],
      multi: true
    }
  ]
};
```

</details>

## 次のステップへのリンク

動的ルート生成をマスターしたら、次のトピックに進みましょう：

- [complex-guards](../complex-guards/README.md) - 動的ルートと組み合わせた複雑なガード戦略
- [route-reuse](../route-reuse/README.md) - 動的ルートの再利用戦略
- [state-management](../state-management/README.md) - 動的ルートと状態管理の統合
- [performance](../performance/README.md) - 動的ルートのパフォーマンス最適化
- [testing](../testing/README.md) - 動的ルートのテスト手法

## まとめ

このセクションでは、Angular 18の最新機能を活用した動的ルート生成の手法を学びました：

1. **実行時ルート登録**: router.resetConfig()を使用した動的なルート追加・削除
2. **APIベースルート生成**: サーバーから取得した設定に基づくルート生成
3. **マルチテナント対応**: テナントごとに異なるルートと機能の提供
4. **遅延読み込み統合**: 動的ルートと遅延読み込みの組み合わせ
5. **権限ベースルーティング**: ユーザー権限に応じた動的なルート制御

動的ルート生成は、柔軟で拡張可能なアプリケーション構築の鍵となる技術です。このセクションで学んだパターンを活用して、ユーザーのニーズに応じて適応できるAngularアプリケーションを構築してください。
