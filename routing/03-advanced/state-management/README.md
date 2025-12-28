# State Management (状態管理との統合)

## 概要

State Managementは、Angularルーターと状態管理ライブラリ（NgRx、Signal Store、Akitaなど）を統合し、アプリケーション全体の状態とルーティングを同期させる技術です。URLと状態を双方向に同期することで、ブックマーク可能で、共有可能な、予測可能なアプリケーションを構築できます。

適切な状態管理とルーティングの統合により、複雑なアプリケーションでも状態の一貫性を保ち、優れたユーザーエクスペリエンスを提供できます。

## 学習内容

- ルーターとNgRxの統合
- URLと状態の双方向同期
- Signal Storeとルーティングの連携
- ルーターステートのシリアライズ
- タイムトラベルデバッグとルーティング

## 詳細な説明

### なぜルーターと状態管理の統合が重要か

1. **状態の永続化**: URLに状態を保存してブックマーク可能に
2. **共有性**: URLを共有することで同じ状態を再現
3. **予測可能性**: 状態とURLが常に同期している
4. **デバッグ容易性**: 状態の変遷を追跡しやすい
5. **SEO対応**: 状態がURLに反映されるため検索エンジンに優しい

### 統合のアプローチ

1. **Router Store**: ルーター状態をStoreに保存
2. **Route Params**: パラメータを状態と同期
3. **Query Params**: クエリパラメータでフィルター等を管理
4. **Route Data**: ルートデータと状態を連携
5. **Navigation Effects**: ナビゲーションに応じたエフェクト

### 状態管理ライブラリ

1. **NgRx Store**: Redux inspired state management
2. **Signal Store**: Reactive state management with Signals
3. **Akita**: Simple state management
4. **Elf**: Modular state management
5. **RxAngular**: Reactive state management

## 実装例

### 例1: NgRxとルーターの基本統合

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { routes } from './app.routes';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      router: routerReducer,
      app: appReducer
    }),
    provideRouterStore(),
    provideEffects([AppEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
```

```typescript
// store/router.selectors.ts
import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';

export const selectRouter = createFeatureSelector<RouterReducerState>('router');

export const {
  selectCurrentRoute,   // 現在のルート
  selectFragment,       // フラグメント
  selectQueryParams,    // クエリパラメータ
  selectQueryParam,     // 特定のクエリパラメータ
  selectRouteParams,    // ルートパラメータ
  selectRouteParam,     // 特定のルートパラメータ
  selectRouteData,      // ルートデータ
  selectUrl,            // URL
} = getRouterSelectors(selectRouter);
```

```typescript
// features/products/store/products.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { selectQueryParams } from '../../../store/router.selectors';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // ルート変更時に製品をロード
  loadProductsOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: RouterNavigatedAction) => action.payload.routerState),
      filter(state => state.url.startsWith('/products')),
      withLatestFrom(this.store.select(selectQueryParams)),
      map(([routerState, queryParams]) => {
        return ProductsActions.loadProducts({
          filters: {
            category: queryParams['category'] || null,
            sortBy: queryParams['sort'] || 'name',
            page: parseInt(queryParams['page'] || '1', 10)
          }
        });
      })
    )
  );

  // 製品詳細ページへのナビゲーション
  loadProductDetailOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: RouterNavigatedAction) => action.payload.routerState),
      filter(state => {
        const match = state.url.match(/^\/products\/(\d+)$/);
        return match !== null;
      }),
      map(state => {
        const match = state.url.match(/^\/products\/(\d+)$/)!;
        const productId = parseInt(match[1], 10);
        return ProductsActions.loadProductDetail({ productId });
      })
    )
  );
}
```

### 例2: クエリパラメータと状態の双方向同期

```typescript
// features/products/store/products.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';

export interface ProductsState {
  products: Product[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category: string | null;
  sortBy: 'name' | 'price' | 'date';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
  searchQuery: string;
}

const initialState: ProductsState = {
  products: [],
  filters: {
    category: null,
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    pageSize: 20,
    searchQuery: ''
  },
  loading: false,
  error: null
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  })),
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```

```typescript
// features/products/products.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProductsActions from './store/products.actions';
import * as ProductsSelectors from './store/products.selectors';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products-container">
      <div class="filters">
        <select
          [value]="(filters$ | async)?.category || ''"
          (change)="onCategoryChange($event)">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>

        <select
          [value]="(filters$ | async)?.sortBy || 'name'"
          (change)="onSortChange($event)">
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="date">Date</option>
        </select>

        <input
          type="text"
          [value]="(filters$ | async)?.searchQuery || ''"
          (input)="onSearchChange($event)"
          placeholder="Search...">
      </div>

      <div class="products-grid">
        <div
          *ngFor="let product of products$ | async"
          class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency }}</p>
        </div>
      </div>

      <div class="pagination">
        <button
          (click)="previousPage()"
          [disabled]="(filters$ | async)?.page === 1">
          Previous
        </button>
        <span>Page {{ (filters$ | async)?.page }}</span>
        <button (click)="nextPage()">Next</button>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  products$ = this.store.select(ProductsSelectors.selectAllProducts);
  filters$ = this.store.select(ProductsSelectors.selectFilters);

  ngOnInit(): void {
    // 初期状態はルーターパラメータから復元される（Effectで処理）
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement).value;
    this.updateFiltersAndUrl({ category: category || null, page: 1 });
  }

  onSortChange(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value as any;
    this.updateFiltersAndUrl({ sortBy, page: 1 });
  }

  onSearchChange(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.updateFiltersAndUrl({ searchQuery, page: 1 });
  }

  previousPage(): void {
    this.filters$.subscribe(filters => {
      if (filters.page > 1) {
        this.updateFiltersAndUrl({ page: filters.page - 1 });
      }
    }).unsubscribe();
  }

  nextPage(): void {
    this.filters$.subscribe(filters => {
      this.updateFiltersAndUrl({ page: filters.page + 1 });
    }).unsubscribe();
  }

  private updateFiltersAndUrl(filters: Partial<ProductFilters>): void {
    // Storeを更新
    this.store.dispatch(ProductsActions.updateFilters({ filters }));

    // URLを更新（クエリパラメータ）
    this.router.navigate([], {
      queryParams: this.buildQueryParams(filters),
      queryParamsHandling: 'merge'
    });
  }

  private buildQueryParams(filters: Partial<ProductFilters>): any {
    const params: any = {};

    if (filters.category) params.category = filters.category;
    if (filters.sortBy && filters.sortBy !== 'name') params.sort = filters.sortBy;
    if (filters.searchQuery) params.q = filters.searchQuery;
    if (filters.page && filters.page !== 1) params.page = filters.page;

    return params;
  }
}
```

### 例3: Signal Storeとルーティングの統合

```typescript
// features/products/products.store.ts
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';
import { ProductService } from './products.service';

export interface ProductsState {
  products: Product[];
  selectedProductId: number | null;
  filters: ProductFilters;
  loading: boolean;
}

const initialState: ProductsState = {
  products: [],
  selectedProductId: null,
  filters: {
    category: null,
    sortBy: 'name',
    page: 1
  },
  loading: false
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // フィルター済み商品
    filteredProducts: computed(() => {
      const products = store.products();
      const filters = store.filters();

      let filtered = [...products];

      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      // ソート
      filtered.sort((a, b) => {
        if (filters.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (filters.sortBy === 'price') {
          return a.price - b.price;
        }
        return 0;
      });

      return filtered;
    }),

    // 選択された商品
    selectedProduct: computed(() => {
      const products = store.products();
      const selectedId = store.selectedProductId();

      if (!selectedId) return null;

      return products.find(p => p.id === selectedId) || null;
    })
  })),

  withMethods((store) => {
    const router = inject(Router);
    const productService = inject(ProductService);

    return {
      // フィルターを更新してURLに反映
      updateFilters(filters: Partial<ProductFilters>): void {
        store.patchState((state) => ({
          filters: { ...state.filters, ...filters }
        }));

        // URLを更新
        const queryParams: any = {};
        const currentFilters = store.filters();

        if (currentFilters.category) {
          queryParams.category = currentFilters.category;
        }
        if (currentFilters.sortBy !== 'name') {
          queryParams.sort = currentFilters.sortBy;
        }
        if (currentFilters.page !== 1) {
          queryParams.page = currentFilters.page;
        }

        router.navigate([], {
          queryParams,
          queryParamsHandling: 'merge'
        });
      },

      // URLから状態を復元
      restoreFromUrl(queryParams: any): void {
        const filters: Partial<ProductFilters> = {};

        if (queryParams.category) {
          filters.category = queryParams.category;
        }
        if (queryParams.sort) {
          filters.sortBy = queryParams.sort;
        }
        if (queryParams.page) {
          filters.page = parseInt(queryParams.page, 10);
        }

        if (Object.keys(filters).length > 0) {
          store.patchState((state) => ({
            filters: { ...state.filters, ...filters }
          }));
        }
      },

      // 商品をロード
      loadProducts: rxMethod<void>(
        pipe(
          tap(() => store.patchState({ loading: true })),
          switchMap(() => productService.getProducts()),
          tap(products => {
            store.patchState({
              products,
              loading: false
            });
          })
        )
      ),

      // 商品を選択
      selectProduct(productId: number): void {
        store.patchState({ selectedProductId: productId });

        // URLを更新
        router.navigate(['/products', productId]);
      }
    };
  })
);
```

```typescript
// features/products/products.component.ts
import { Component, OnInit, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsStore } from './products.store';

@Component({
  selector: 'app-products',
  standalone: true,
  template: `
    <div class="products-container">
      <div class="filters">
        <select
          [value]="store.filters().category || ''"
          (change)="onCategoryChange($event)">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>

        <select
          [value]="store.filters().sortBy"
          (change)="onSortChange($event)">
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div class="products-grid">
        @for (product of store.filteredProducts(); track product.id) {
          <div class="product-card" (click)="selectProduct(product.id)">
            <h3>{{ product.name }}</h3>
            <p>{{ product.price | currency }}</p>
          </div>
        }
      </div>

      @if (store.loading()) {
        <div class="loading">Loading...</div>
      }
    </div>
  `
})
export class ProductsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly store = inject(ProductsStore);

  constructor() {
    // クエリパラメータの変更を監視
    effect(() => {
      this.route.queryParams.subscribe(params => {
        this.store.restoreFromUrl(params);
      });
    });
  }

  ngOnInit(): void {
    // 初期ロード
    this.store.loadProducts();
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement).value;
    this.store.updateFilters({ category: category || null, page: 1 });
  }

  onSortChange(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value as any;
    this.store.updateFilters({ sortBy, page: 1 });
  }

  selectProduct(productId: number): void {
    this.store.selectProduct(productId);
  }
}
```

### 例4: ルーターステートのシリアライズ

```typescript
// store/custom-router-serializer.ts
import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface CustomRouterState {
  url: string;
  params: any;
  queryParams: any;
  fragment: string | null;
  data: any;
}

export class CustomRouterSerializer implements RouterStateSerializer<CustomRouterState> {
  serialize(routerState: RouterStateSnapshot): CustomRouterState {
    let route = routerState.root;

    // 最も深い子ルートを探す
    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params, data, fragment } = route;

    return {
      url,
      params,
      queryParams,
      fragment,
      data
    };
  }
}
```

```typescript
// app.config.ts（カスタムシリアライザを使用）
import { provideRouterStore } from '@ngrx/router-store';
import { CustomRouterSerializer } from './store/custom-router-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideRouterStore({
      serializer: CustomRouterSerializer
    })
  ]
};
```

### 例5: ルーター状態に基づくエフェクト

```typescript
// store/app.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { selectRouteParams, selectQueryParams } from './router.selectors';
import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // 検索ページへのナビゲーション
  searchPageNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectQueryParams)),
      filter(([_, queryParams]) => !!queryParams['q']),
      map(([_, queryParams]) => {
        return AppActions.performSearch({ query: queryParams['q'] });
      })
    )
  );

  // ユーザープロフィールページへのナビゲーション
  userProfileNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectRouteParams)),
      filter(([action, params]: any) => {
        return action.payload.routerState.url.startsWith('/users/');
      }),
      map(([_, params]) => {
        return AppActions.loadUserProfile({ userId: params['id'] });
      })
    )
  );

  // タブ切り替え
  tabNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(this.store.select(selectFragment)),
      filter(([_, fragment]) => fragment !== null),
      map(([_, fragment]) => {
        return AppActions.switchTab({ tabId: fragment || 'overview' });
      })
    )
  );
}
```

### 例6: ディープリンクと状態の復元

```typescript
// services/state-persistence.service.ts
import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface PersistedState {
  url: string;
  state: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatePersistenceService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  /**
   * 現在の状態をURLにエンコード
   */
  encodeStateToUrl(state: any): string {
    // 状態をBase64エンコード
    const encoded = btoa(JSON.stringify(state));

    // 現在のURLに状態を追加
    const currentUrl = this.router.url.split('?')[0];

    return `${currentUrl}?state=${encoded}`;
  }

  /**
   * URLから状態をデコード
   */
  decodeStateFromUrl(): Observable<any | null> {
    return this.route.queryParams.pipe(
      map(params => {
        if (!params['state']) {
          return null;
        }

        try {
          const decoded = atob(params['state']);
          return JSON.parse(decoded);
        } catch (error) {
          console.error('Failed to decode state from URL:', error);
          return null;
        }
      }),
      take(1)
    );
  }

  /**
   * 状態をローカルストレージに保存
   */
  saveStateToStorage(key: string, state: any): void {
    const persisted: PersistedState = {
      url: this.router.url,
      state,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(key, JSON.stringify(persisted));
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  /**
   * ローカルストレージから状態を復元
   */
  restoreStateFromStorage(key: string, maxAge: number = 24 * 60 * 60 * 1000): PersistedState | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const persisted: PersistedState = JSON.parse(stored);

      // 有効期限をチェック
      const age = Date.now() - persisted.timestamp;
      if (age > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return persisted;
    } catch (error) {
      console.error('Failed to restore state from storage:', error);
      return null;
    }
  }

  /**
   * 共有可能なリンクを生成
   */
  generateShareableLink(state: any): string {
    const baseUrl = window.location.origin;
    const relativePath = this.encodeStateToUrl(state);

    return `${baseUrl}${relativePath}`;
  }

  /**
   * 現在の状態をクエリパラメータに変換
   */
  stateToQueryParams(state: any): any {
    const params: any = {};

    // ネストされたオブジェクトをフラット化
    this.flattenObject(state, '', params);

    return params;
  }

  /**
   * オブジェクトをフラット化
   */
  private flattenObject(obj: any, prefix: string, result: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          this.flattenObject(value, newKey, result);
        } else {
          result[newKey] = value;
        }
      }
    }
  }
}
```

```typescript
// features/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatePersistenceService } from '../../services/state-persistence.service';
import * as DashboardActions from './store/dashboard.actions';
import * as DashboardSelectors from './store/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <button (click)="share()">Share Dashboard</button>

      <div class="widgets">
        <!-- ダッシュボードコンテンツ -->
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private statePersistence = inject(StatePersistenceService);

  ngOnInit(): void {
    // URLから状態を復元
    this.statePersistence.decodeStateFromUrl().subscribe(state => {
      if (state) {
        this.store.dispatch(DashboardActions.restoreState({ state }));
      }
    });

    // ローカルストレージから復元
    const persisted = this.statePersistence.restoreStateFromStorage('dashboard-state');
    if (persisted) {
      this.store.dispatch(DashboardActions.restoreState({ state: persisted.state }));
    }
  }

  share(): void {
    // 現在の状態を取得
    this.store.select(DashboardSelectors.selectDashboardState)
      .pipe(take(1))
      .subscribe(state => {
        const link = this.statePersistence.generateShareableLink(state);

        // クリップボードにコピー
        navigator.clipboard.writeText(link).then(() => {
          alert('Link copied to clipboard!');
        });
      });
  }
}
```

### 例7: タイムトラベルデバッグ

```typescript
// services/time-travel.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

export interface StateSnapshot {
  state: any;
  url: string;
  timestamp: number;
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimeTravelService {
  private snapshots: StateSnapshot[] = [];
  private currentIndex = -1;
  private readonly MAX_SNAPSHOTS = 50;

  constructor(
    private router: Router,
    private store: Store
  ) {}

  /**
   * スナップショットを記録
   */
  recordSnapshot(state: any, action: string): void {
    // 現在位置より後のスナップショットを削除
    if (this.currentIndex < this.snapshots.length - 1) {
      this.snapshots = this.snapshots.slice(0, this.currentIndex + 1);
    }

    // 新しいスナップショットを追加
    this.snapshots.push({
      state,
      url: this.router.url,
      timestamp: Date.now(),
      action
    });

    // 最大数を超えたら古いものを削除
    if (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * 1つ前の状態に戻る
   */
  undo(): void {
    if (this.canUndo()) {
      this.currentIndex--;
      this.restoreSnapshot(this.snapshots[this.currentIndex]);
    }
  }

  /**
   * 1つ先の状態に進む
   */
  redo(): void {
    if (this.canRedo()) {
      this.currentIndex++;
      this.restoreSnapshot(this.snapshots[this.currentIndex]);
    }
  }

  /**
   * Undoが可能か
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Redoが可能か
   */
  canRedo(): boolean {
    return this.currentIndex < this.snapshots.length - 1;
  }

  /**
   * スナップショットを復元
   */
  private restoreSnapshot(snapshot: StateSnapshot): void {
    // ルーターを復元
    this.router.navigateByUrl(snapshot.url);

    // 状態を復元（Storeのアクションを発行）
    // store.dispatch(restoreStateAction({ state: snapshot.state }));
  }

  /**
   * すべてのスナップショットを取得
   */
  getSnapshots(): StateSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * 現在のインデックスを取得
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * スナップショットをクリア
   */
  clear(): void {
    this.snapshots = [];
    this.currentIndex = -1;
  }
}
```

## ベストプラクティス

### 1. URLと状態の一貫性

URLと状態を常に同期させます。

```typescript
// Storeを更新したらURLも更新
this.store.dispatch(updateFilters({ filters }));
this.router.navigate([], { queryParams: this.buildQueryParams(filters) });
```

### 2. Router Storeの使用

NgRx Router Storeを使用してルーター状態をStoreに統合します。

```typescript
provideRouterStore()
```

### 3. セレクターの活用

ルーター状態にアクセスする際はセレクターを使用します。

```typescript
this.store.select(selectQueryParams)
this.store.select(selectRouteParams)
```

### 4. エフェクトでナビゲーションを処理

ナビゲーションに応じたサイドエフェクトはEffectsで処理します。

```typescript
loadDataOnNavigation$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ROUTER_NAVIGATED),
    // ...
  )
);
```

### 5. 状態の永続化

重要な状態はローカルストレージに保存します。

```typescript
this.statePersistence.saveStateToStorage('app-state', state);
```

### 6. ディープリンクのサポート

アプリケーションの状態をURLで完全に表現します。

```typescript
const shareableLink = this.statePersistence.generateShareableLink(state);
```

### 7. カスタムルーターシリアライザ

必要な情報のみをシリアライズしてパフォーマンスを向上させます。

```typescript
export class CustomRouterSerializer implements RouterStateSerializer<CustomRouterState> {
  serialize(routerState: RouterStateSnapshot): CustomRouterState {
    // 必要な情報のみを抽出
  }
}
```

### 8. Signal Storeでの同期

Signal Storeでもルーターとの同期を実装します。

```typescript
effect(() => {
  this.route.queryParams.subscribe(params => {
    this.store.restoreFromUrl(params);
  });
});
```

### 9. エラーハンドリング

状態の復元時のエラーを適切に処理します。

```typescript
try {
  const state = JSON.parse(decodedState);
  this.store.dispatch(restoreState({ state }));
} catch (error) {
  console.error('Failed to restore state:', error);
  // デフォルト状態にフォールバック
}
```

### 10. パフォーマンスの考慮

大きな状態をURLにエンコードする際は圧縮を検討します。

```typescript
// LZ-stringなどで圧縮
import LZString from 'lz-string';
const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
```

## よくある間違い

### 1. URLと状態の不一致

Storeを更新してもURLを更新しない。

```typescript
// 悪い例
this.store.dispatch(updateFilters({ filters }));
// URLは古いまま

// 良い例
this.store.dispatch(updateFilters({ filters }));
this.router.navigate([], { queryParams: ... });
```

### 2. Router Storeの未使用

ルーター状態を手動で管理してしまう。

```typescript
// 悪い例
this.router.events.subscribe(...);

// 良い例
provideRouterStore()
this.store.select(selectQueryParams)
```

### 3. 状態の過剰なシリアライズ

不要な情報までURLに含めてしまう。

```typescript
// 悪い例：すべてをエンコード
const encoded = btoa(JSON.stringify(entireAppState));

// 良い例：必要な部分のみ
const encoded = btoa(JSON.stringify({
  filters: state.filters,
  selectedIds: state.selectedIds
}));
```

### 4. エフェクトの無限ループ

エフェクト内でナビゲーションを発生させて無限ループになる。

```typescript
// 悪い例
loadData$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ROUTER_NAVIGATED),
    map(() => {
      this.router.navigate(['/data']); // 無限ループ!
      return loadData();
    })
  )
);

// 良い例：条件付きナビゲーション
```

### 5. 状態復元のタイミング

コンポーネント初期化前に状態を復元しない。

```typescript
// 悪い例：ngAfterViewInitで復元

// 良い例：ngOnInitまたはConstructorで復元
ngOnInit() {
  this.restoreStateFromUrl();
}
```

### 6. メモリリークの発生

Subscriptionの解除を忘れる。

```typescript
// 悪い例
ngOnInit() {
  this.store.select(selectData).subscribe(...);
}

// 良い例
ngOnInit() {
  this.store.select(selectData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(...);
}
```

### 7. エラー処理の欠如

状態の復元失敗を処理していない。

```typescript
// 良い例
try {
  const state = this.decodeStateFromUrl();
  this.store.dispatch(restoreState({ state }));
} catch (error) {
  // フォールバック処理
  this.store.dispatch(loadDefaultState());
}
```

### 8. パフォーマンスの未考慮

大きな状態をURLに頻繁にエンコードしてしまう。

```typescript
// 悪い例：毎回エンコード
onFilterChange() {
  const encoded = this.encodeState(this.largeState);
}

// 良い例：デバウンスしてエンコード
onFilterChange = debounce(() => {
  const encoded = this.encodeState(this.largeState);
}, 500);
```

### 9. セキュリティの未考慮

機密情報をURLにエンコードしてしまう。

```typescript
// 悪い例
const state = {
  userId: user.id,
  authToken: user.token  // 機密情報！
};

// 良い例：公開情報のみ
const state = {
  filters: this.filters,
  page: this.currentPage
};
```

### 10. ブラウザ履歴の汚染

状態変更のたびにブラウザ履歴に追加してしまう。

```typescript
// 悪い例
this.router.navigate(['/products'], { queryParams });

// 良い例：replaceUrlを使用
this.router.navigate(['/products'], {
  queryParams,
  replaceUrl: true
});
```

## 演習問題

### 初級

#### 演習1: NgRx Router Storeの基本設定

タスク：
1. NgRx Router Storeをセットアップ
2. ルーターセレクターを作成
3. コンポーネントでクエリパラメータを取得
4. DevToolsで確認

期待される動作：
- ルーター状態がStoreに保存される
- セレクターでクエリパラメータが取得できる
- DevToolsでルーターアクションが表示される

#### 演習2: フィルターとURLの同期

タスク：
1. 製品一覧ページを作成
2. カテゴリとソートのフィルターを実装
3. フィルター変更時にURLを更新
4. URLからフィルターを復元

期待される動作：
- フィルター変更がURLに反映される
- URLを共有すると同じフィルター状態が再現される
- ブラウザの戻る/進むで状態が復元される

### 中級

#### 演習1: Signal Storeとルーターの統合

タスク：
1. Signal Storeを作成
2. クエリパラメータと状態を双方向同期
3. 状態変更時にURLを更新
4. URLから状態を復元

期待される動作：
- Signal Storeの状態とURLが常に同期
- 状態変更が即座にURLに反映される
- ページリロード後も状態が保持される

#### 演習2: ディープリンクと状態共有

タスク：
1. アプリケーション状態をURLにエンコード
2. 共有可能なリンクを生成
3. リンクから状態を完全に復元
4. エラーハンドリングを実装

期待される動作：
- 共有リンクで完全に同じ状態が再現される
- エンコード/デコードが正しく動作する
- 不正なURLでもエラーにならない

### 上級

#### 演習1: 包括的な状態管理とルーティングの統合

タスク：
1. NgRx Store、Router Store、Effectsを完全に統合
2. すべての状態をURLと同期
3. ローカルストレージによる永続化
4. タイムトラベルデバッグを実装
5. パフォーマンスを最適化

期待される動作：
- 状態とURLが完全に同期している
- ページリロード後も状態が完全に復元される
- Undo/Redo機能が動作する
- 大きな状態でもパフォーマンスが良い

実装のヒント：
```typescript
interface AppState {
  router: RouterReducerState;
  products: ProductsState;
  cart: CartState;
  user: UserState;
}

// すべての状態をURLと同期
// ローカルストレージに永続化
// タイムトラベル用のスナップショット記録
```

#### 演習2: マルチタブ状態同期

タスク：
1. BroadcastChannel APIを使用
2. 複数のタブ間で状態を同期
3. タブ間でナビゲーションを同期
4. コンフリクト解決を実装

期待される動作：
- あるタブでの状態変更が他のタブに反映される
- ナビゲーションも同期される
- 同時変更時に適切に処理される
- パフォーマンスへの影響が最小限

実装のヒント：
```typescript
class MultiTabSyncService {
  private channel = new BroadcastChannel('app-sync');

  broadcastState(state: any): void {
    this.channel.postMessage({ type: 'STATE_UPDATE', state });
  }

  listenToOtherTabs(): Observable<any> {
    return fromEvent(this.channel, 'message');
  }
}
```

## 次のステップへのリンク

State Managementの基礎を学んだら、次のトピックを探索しましょう：

- [Route Reuse](../route-reuse/README.md) - ルート再利用戦略
- [Performance](../performance/README.md) - パフォーマンス最適化
- [Error Handling](../error-handling/README.md) - エラーハンドリング
- [Deep Linking](../deep-linking/README.md) - 深いリンクとフラグメント

## 参考リンク

- [NgRx Store](https://ngrx.io/guide/store)
- [NgRx Router Store](https://ngrx.io/guide/router-store)
- [NgRx Effects](https://ngrx.io/guide/effects)
- [Signal Store](https://ngrx.io/guide/signals)
- [Angular Router](https://angular.dev/guide/routing)

## まとめ

State Managementとルーティングの統合は、複雑なAngularアプリケーションを構築する上で不可欠です。適切な統合により、以下のメリットが得られます：

- 状態とURLの一貫性
- ブックマーク可能なアプリケーション
- 共有可能な状態
- 予測可能な動作
- デバッグの容易性
- SEO対応

NgRx Store、Router Store、Signal Storeを適切に組み合わせて、保守性が高く、拡張性のあるアプリケーションを構築しましょう。状態の永続化、ディープリンク、タイムトラベルデバッグなどの高度な機能も活用してください。
