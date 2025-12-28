# ルーティングのテスト (Routing Testing)

## 学習内容

- RouterTestingModuleとprovideRouterを使用したルーティングのテスト環境構築
- ナビゲーションのテスト手法とモック戦略
- ガード、リゾルバー、パラメータのユニットテスト
- 統合テストとE2Eテストでのルーティング検証
- Signalベースのルーティング状態のテスト

## セクションの説明

Angularアプリケーションにおいて、ルーティングは重要な機能の一つです。適切なテストを書くことで、ナビゲーションの動作、ガードの認証ロジック、リゾルバーのデータ取得などが期待通りに動作することを保証できます。

このセクションでは、Angular 18の最新機能を活用したルーティングテストの包括的な手法を学びます。Standalone Components、関数型guards、Signalなどの新機能を使用したテストパターンを詳しく解説します。

## 実装例

### 例1: 基本的なナビゲーションテスト（Standalone Components）

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UserDetailComponent } from './user/user-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '**', redirectTo: '' }
];
```

```typescript
// home.component.ts
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
      <h1>ホーム</h1>
      <p>訪問回数: {{ visitCount() }}</p>
      <button (click)="navigateToAbout()">About へ移動</button>
      <button (click)="navigateToUser(123)">ユーザー詳細へ移動</button>
    </div>
  `
})
export class HomeComponent {
  visitCount = signal(0);

  constructor(private router: Router) {
    this.visitCount.update(v => v + 1);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToUser(id: number): void {
    this.router.navigate(['/user', id]);
  }
}
```

```typescript
// home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { routes } from '../app.routes';

describe('HomeComponent - ナビゲーションテスト', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter(routes)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('訪問回数が1から始まること', () => {
    expect(component.visitCount()).toBe(1);
  });

  it('navigateToAboutが/aboutへナビゲートすること', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToAbout();
    expect(navigateSpy).toHaveBeenCalledWith(['/about']);
  });

  it('navigateToUserが正しいIDでナビゲートすること', async () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateToUser(123);
    expect(navigateSpy).toHaveBeenCalledWith(['/user', 123]);
  });

  it('ボタンクリックでナビゲーションが実行されること', () => {
    const navigateSpy = spyOn(component, 'navigateToAbout');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
```

### 例2: 関数型Guardのテスト

```typescript
// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  isAuthenticated = signal(false);

  login(username: string, password: string): Observable<boolean> {
    // 実際のAPIコールをシミュレート
    return of(true).pipe(
      delay(100),
      tap(() => {
        this.currentUserSignal.set({
          id: 1,
          name: username,
          role: 'user'
        });
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    return user?.role === role;
  }

  checkPermission(permission: string): Observable<boolean> {
    // 実際の権限チェックをシミュレート
    return of(this.isAuthenticated()).pipe(delay(50));
  }
}
```

```typescript
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // ログイン後に元のURLに戻れるようにクエリパラメータを設定
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const roleGuard: (role: string) => CanActivateFn = (role: string) => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(role)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
```

```typescript
// guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { authGuard, roleGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: {} as any },
          { path: 'unauthorized', component: {} as any }
        ]),
        AuthService
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('認証済みユーザーはtrueを返すこと', () => {
      authService.isAuthenticated.set(true);

      const result = TestBed.runInInjectionContext(() =>
        authGuard(
          { routeConfig: {} } as any,
          { url: '/protected' } as any
        )
      );

      expect(result).toBe(true);
    });

    it('未認証ユーザーはログインページへリダイレクトすること', () => {
      authService.isAuthenticated.set(false);

      const result = TestBed.runInInjectionContext(() =>
        authGuard(
          { routeConfig: {} } as any,
          { url: '/protected' } as any
        )
      ) as UrlTree;

      expect(result).toBeInstanceOf(UrlTree);
      expect(result.toString()).toContain('/login');
      expect(result.queryParams['returnUrl']).toBe('/protected');
    });
  });

  describe('roleGuard', () => {
    it('適切なロールを持つユーザーはtrueを返すこと', () => {
      authService['currentUserSignal'].set({
        id: 1,
        name: 'Admin User',
        role: 'admin'
      });

      const guard = roleGuard('admin');
      const result = TestBed.runInInjectionContext(() =>
        guard(
          { routeConfig: {} } as any,
          { url: '/admin' } as any
        )
      );

      expect(result).toBe(true);
    });

    it('不適切なロールのユーザーはunauthorizedへリダイレクトすること', () => {
      authService['currentUserSignal'].set({
        id: 1,
        name: 'Regular User',
        role: 'user'
      });

      const guard = roleGuard('admin');
      const result = TestBed.runInInjectionContext(() =>
        guard(
          { routeConfig: {} } as any,
          { url: '/admin' } as any
        )
      ) as UrlTree;

      expect(result).toBeInstanceOf(UrlTree);
      expect(result.toString()).toBe('/unauthorized');
    });
  });
});
```

### 例3: Resolverのテスト

```typescript
// services/user.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCache = signal<Map<number, UserProfile>>(new Map());

  getUserById(id: number): Observable<UserProfile> {
    // キャッシュチェック
    const cached = this.usersCache().get(id);
    if (cached) {
      return of(cached);
    }

    // APIコールをシミュレート
    if (id <= 0) {
      return throwError(() => new Error('Invalid user ID'));
    }

    const user: UserProfile = {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      bio: `Biography for user ${id}`
    };

    return of(user).pipe(
      delay(100),
      tap(u => {
        this.usersCache.update(cache => {
          const newCache = new Map(cache);
          newCache.set(id, u);
          return newCache;
        });
      })
    );
  }

  clearCache(): void {
    this.usersCache.set(new Map());
  }
}
```

```typescript
// resolvers/user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserProfile, UserService } from '../services/user.service';
import { catchError, of } from 'rxjs';

export const userResolver: ResolveFn<UserProfile | null> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (isNaN(id)) {
    router.navigate(['/not-found']);
    return of(null);
  }

  return userService.getUserById(id).pipe(
    catchError(error => {
      console.error('Error loading user:', error);
      router.navigate(['/error'], {
        state: { message: error.message }
      });
      return of(null);
    })
  );
};
```

```typescript
// resolvers/user.resolver.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { userResolver } from './user.resolver';
import { UserService, UserProfile } from '../services/user.service';

describe('userResolver', () => {
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('有効なIDでユーザーを解決すること', (done) => {
    const mockUser: UserProfile = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'avatar.png',
      bio: 'Test bio'
    };

    userService.getUserById.and.returnValue(of(mockUser));

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '1' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = userResolver(route, {} as any);

      result$.subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(userService.getUserById).toHaveBeenCalledWith(1);
        done();
      });
    });
  });

  it('無効なIDの場合not-foundへリダイレクトすること', (done) => {
    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? 'invalid' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = userResolver(route, {} as any);

      result$.subscribe(user => {
        expect(user).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
        done();
      });
    });
  });

  it('エラー時にerrorページへリダイレクトすること', (done) => {
    const errorMessage = 'User not found';
    userService.getUserById.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '999' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = userResolver(route, {} as any);

      result$.subscribe(user => {
        expect(user).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(
          ['/error'],
          { state: { message: errorMessage } }
        );
        done();
      });
    });
  });
});
```

### 例4: ルートパラメータとクエリパラメータのテスト

```typescript
// search.component.ts
import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
  page: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="search-page">
      <h1>検索</h1>

      <div class="search-form">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="updateSearch()"
          placeholder="検索キーワード"
        />

        <select [(ngModel)]="category" (change)="updateSearch()">
          <option value="">すべてのカテゴリ</option>
          <option value="electronics">電化製品</option>
          <option value="books">書籍</option>
          <option value="clothing">衣料品</option>
        </select>

        <select [(ngModel)]="sortBy" (change)="updateSearch()">
          <option value="relevance">関連性</option>
          <option value="price-asc">価格: 安い順</option>
          <option value="price-desc">価格: 高い順</option>
          <option value="date">新着順</option>
        </select>
      </div>

      <div class="results">
        <p>検索クエリ: {{ filters().query }}</p>
        <p>カテゴリ: {{ filters().category || 'すべて' }}</p>
        <p>ソート: {{ filters().sortBy }}</p>
        <p>ページ: {{ filters().page }}</p>
      </div>

      <div class="pagination">
        <button (click)="changePage(filters().page - 1)" [disabled]="filters().page <= 1">
          前へ
        </button>
        <span>ページ {{ filters().page }}</span>
        <button (click)="changePage(filters().page + 1)">
          次へ
        </button>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  category = '';
  sortBy = 'relevance';

  // ルートパラメータとクエリパラメータをSignalで管理
  queryParams = toSignal(
    this.route.queryParams,
    { initialValue: {} }
  );

  filters = computed<SearchFilters>(() => {
    const params = this.queryParams();
    return {
      query: params['q'] || '',
      category: params['category'] || '',
      sortBy: params['sort'] || 'relevance',
      page: parseInt(params['page'] || '1', 10)
    };
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // クエリパラメータが変更されたらフォームを更新
    effect(() => {
      const filters = this.filters();
      this.searchQuery = filters.query;
      this.category = filters.category;
      this.sortBy = filters.sortBy;
    });
  }

  ngOnInit(): void {}

  updateSearch(): void {
    this.router.navigate(['/search'], {
      queryParams: {
        q: this.searchQuery || undefined,
        category: this.category || undefined,
        sort: this.sortBy !== 'relevance' ? this.sortBy : undefined,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  changePage(page: number): void {
    if (page < 1) return;

    this.router.navigate(['/search'], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
}
```

```typescript
// search.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { SearchComponent } from './search.component';
import { of, BehaviorSubject } from 'rxjs';

describe('SearchComponent - パラメータテスト', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject({
      q: 'laptop',
      category: 'electronics',
      sort: 'price-asc',
      page: '2'
    });

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        provideRouter([
          { path: 'search', component: SearchComponent }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
            snapshot: {
              queryParams: queryParamsSubject.value
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  it('初期クエリパラメータから正しくフィルタを設定すること', () => {
    fixture.detectChanges();

    expect(component.filters().query).toBe('laptop');
    expect(component.filters().category).toBe('electronics');
    expect(component.filters().sortBy).toBe('price-asc');
    expect(component.filters().page).toBe(2);
  });

  it('フォーム値がクエリパラメータから設定されること', () => {
    fixture.detectChanges();

    expect(component.searchQuery).toBe('laptop');
    expect(component.category).toBe('electronics');
    expect(component.sortBy).toBe('price-asc');
  });

  it('updateSearchがクエリパラメータを更新すること', () => {
    fixture.detectChanges();
    const navigateSpy = spyOn(router, 'navigate');

    component.searchQuery = 'smartphone';
    component.category = 'electronics';
    component.sortBy = 'price-desc';
    component.updateSearch();

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: {
        q: 'smartphone',
        category: 'electronics',
        sort: 'price-desc',
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  });

  it('changePageがページ番号を更新すること', () => {
    fixture.detectChanges();
    const navigateSpy = spyOn(router, 'navigate');

    component.changePage(3);

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { page: 3 },
      queryParamsHandling: 'merge'
    });
  });

  it('ページ1未満には移動しないこと', () => {
    fixture.detectChanges();
    const navigateSpy = spyOn(router, 'navigate');

    component.changePage(0);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('クエリパラメータ変更でフィルタが更新されること', () => {
    fixture.detectChanges();

    queryParamsSubject.next({
      q: 'tablet',
      category: 'electronics',
      sort: 'date',
      page: '1'
    });

    fixture.detectChanges();

    expect(component.filters().query).toBe('tablet');
    expect(component.filters().sortBy).toBe('date');
    expect(component.filters().page).toBe(1);
  });

  it('空のクエリパラメータでデフォルト値を使用すること', () => {
    queryParamsSubject.next({});
    fixture.detectChanges();

    expect(component.filters().query).toBe('');
    expect(component.filters().category).toBe('');
    expect(component.filters().sortBy).toBe('relevance');
    expect(component.filters().page).toBe(1);
  });
});
```

### 例5: 統合テストとLocation Testing

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        ホーム
      </a>
      <a routerLink="/about" routerLinkActive="active">
        About
      </a>
      <a routerLink="/products" routerLinkActive="active">
        商品一覧
      </a>
      <a routerLink="/admin" routerLinkActive="active">
        管理画面
      </a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductListComponent } from './products/product-list.component';
import { ProductDetailComponent } from './products/product-detail.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard, roleGuard } from './guards/auth.guard';
import { productResolver } from './resolvers/product.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: { product: productResolver }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard('admin')]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

```typescript
// app.component.integration.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

describe('App Integration Tests - Navigation', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService);

    fixture.detectChanges();
  });

  it('初期URLが/であること', () => {
    expect(location.path()).toBe('');
  });

  it('/aboutへのナビゲーションが成功すること', fakeAsync(() => {
    router.navigate(['/about']);
    tick();

    expect(location.path()).toBe('/about');
  }));

  it('/productsへのナビゲーションが成功すること', fakeAsync(() => {
    router.navigate(['/products']);
    tick();

    expect(location.path()).toBe('/products');
  }));

  it('パラメータ付きナビゲーションが成功すること', fakeAsync(() => {
    router.navigate(['/products', '123']);
    tick();

    expect(location.path()).toBe('/products/123');
  }));

  it('未認証時に/adminへアクセスするとリダイレクトされること', fakeAsync(() => {
    authService.isAuthenticated.set(false);

    router.navigate(['/admin']);
    tick();

    expect(location.path()).not.toBe('/admin');
    expect(location.path()).toContain('login');
  }));

  it('認証済みadminユーザーは/adminへアクセスできること', fakeAsync(() => {
    authService.isAuthenticated.set(true);
    authService['currentUserSignal'].set({
      id: 1,
      name: 'Admin',
      role: 'admin'
    });

    router.navigate(['/admin']);
    tick();

    expect(location.path()).toBe('/admin');
  }));

  it('存在しないパスは/へリダイレクトされること', fakeAsync(() => {
    router.navigate(['/non-existent-page']);
    tick();

    expect(location.path()).toBe('/');
  }));

  it('クエリパラメータ付きナビゲーションが機能すること', fakeAsync(() => {
    router.navigate(['/products'], { queryParams: { category: 'electronics', page: '2' } });
    tick();

    expect(location.path()).toBe('/products?category=electronics&page=2');
  }));

  it('フラグメント付きナビゲーションが機能すること', fakeAsync(() => {
    router.navigate(['/about'], { fragment: 'section-2' });
    tick();

    expect(location.path()).toBe('/about#section-2');
  }));

  it('連続的なナビゲーションが正しく機能すること', fakeAsync(() => {
    router.navigate(['/about']);
    tick();
    expect(location.path()).toBe('/about');

    router.navigate(['/products']);
    tick();
    expect(location.path()).toBe('/products');

    router.navigate(['/']);
    tick();
    expect(location.path()).toBe('');
  }));
});
```

## ベストプラクティス

### 1. テスト環境の適切な構成

```typescript
// 推奨: provideRouterを使用したStandalone設定
await TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [
    provideRouter(routes),
    // 必要に応じてサービスをモック
    { provide: MyService, useValue: mockService }
  ]
}).compileComponents();

// 非推奨: RouterTestingModuleの使用（レガシー）
// Angular 18ではprovideRouterを推奨
```

### 2. Signalベースの状態テスト

```typescript
it('Signalの値を正しくテストする', () => {
  // Signalは関数として呼び出す
  expect(component.count()).toBe(0);

  // Signalの更新をテスト
  component.increment();
  expect(component.count()).toBe(1);

  // Computed Signalのテスト
  expect(component.doubleCount()).toBe(2);
});
```

### 3. 非同期ナビゲーションのテスト

```typescript
it('非同期ナビゲーションをテスト', fakeAsync(() => {
  // fakeAsyncとtickを使用
  router.navigate(['/some-path']);
  tick(); // 非同期処理を完了

  expect(location.path()).toBe('/some-path');
}));

// または async/await
it('非同期ナビゲーションをテスト', async () => {
  await router.navigate(['/some-path']);
  expect(location.path()).toBe('/some-path');
});
```

### 4. ガードのテストにrunInInjectionContextを使用

```typescript
it('関数型ガードをテスト', () => {
  const result = TestBed.runInInjectionContext(() =>
    myGuard(mockRoute, mockState)
  );

  expect(result).toBe(true);
});
```

### 5. モックとスパイの適切な使用

```typescript
// Jasmineスパイを使用してサービスメソッドをモック
const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
userServiceSpy.getUser.and.returnValue(of(mockUser));

TestBed.configureTestingModule({
  providers: [
    { provide: UserService, useValue: userServiceSpy }
  ]
});
```

### 6. ルートデータとメタデータのテスト

```typescript
it('ルートデータを検証', () => {
  const route = router.config.find(r => r.path === 'admin');
  expect(route?.data?.['requiresAuth']).toBe(true);
  expect(route?.data?.['roles']).toContain('admin');
});
```

### 7. エラーハンドリングのテスト

```typescript
it('ナビゲーションエラーを処理', fakeAsync(() => {
  const errorSpy = jasmine.createSpy('errorHandler');

  router.events.subscribe(event => {
    if (event instanceof NavigationError) {
      errorSpy(event.error);
    }
  });

  router.navigate(['/invalid']);
  tick();

  expect(errorSpy).toHaveBeenCalled();
}));
```

### 8. テストの分離と独立性

```typescript
beforeEach(() => {
  // 各テストで新しいコンポーネントインスタンスを作成
  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;

  // ルーターをリセット
  router.resetConfig(routes);
});

afterEach(() => {
  // クリーンアップ
  fixture.destroy();
});
```

### 9. リゾルバーのテストパターン

```typescript
it('リゾルバーが正しくデータを解決', (done) => {
  const mockData = { id: 1, name: 'Test' };
  service.getData.and.returnValue(of(mockData));

  TestBed.runInInjectionContext(() => {
    const result$ = myResolver(mockRoute, mockState);

    result$.subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
  });
});
```

### 10. E2Eテストとの組み合わせ

```typescript
// Protractor/Cypressと組み合わせて包括的なテストを実施
// ユニットテスト: ガード、リゾルバー、個別コンポーネント
// 統合テスト: ナビゲーションフロー、ルート設定
// E2Eテスト: ユーザージャーニー全体
```

## よくある間違い

### 1. RouterTestingModuleの不適切な使用

```typescript
// ❌ 間違い: レガシーなRouterTestingModule
import { RouterTestingModule } from '@angular/router/testing';

TestBed.configureTestingModule({
  imports: [RouterTestingModule]
});

// ✅ 正しい: provideRouterを使用
import { provideRouter } from '@angular/router';

TestBed.configureTestingModule({
  providers: [provideRouter(routes)]
});
```

### 2. 非同期処理の待機忘れ

```typescript
// ❌ 間違い: 非同期処理を待たない
it('ナビゲーションテスト', () => {
  router.navigate(['/test']);
  expect(location.path()).toBe('/test'); // まだ完了していない可能性
});

// ✅ 正しい: fakeAsyncとtickを使用
it('ナビゲーションテスト', fakeAsync(() => {
  router.navigate(['/test']);
  tick();
  expect(location.path()).toBe('/test');
}));
```

### 3. Signalの誤った呼び出し

```typescript
// ❌ 間違い: Signalをプロパティとしてアクセス
expect(component.count).toBe(0);

// ✅ 正しい: Signalは関数として呼び出す
expect(component.count()).toBe(0);
```

### 4. ガードのインジェクションコンテキスト不足

```typescript
// ❌ 間違い: runInInjectionContext無しで関数型ガードを呼び出す
const result = authGuard(mockRoute, mockState); // エラー

// ✅ 正しい: runInInjectionContextを使用
const result = TestBed.runInInjectionContext(() =>
  authGuard(mockRoute, mockState)
);
```

### 5. モックの不完全な設定

```typescript
// ❌ 間違い: 必要なメソッドをモックしていない
const mockService = { someMethod: () => {} };

// ✅ 正しい: すべての必要なメソッドとプロパティをモック
const mockService = jasmine.createSpyObj('Service', [
  'method1', 'method2'
], {
  property1: signal(value)
});
```

### 6. ルート設定の不一致

```typescript
// ❌ 間違い: テストと本番で異なるルート設定
TestBed.configureTestingModule({
  providers: [
    provideRouter([
      { path: 'test', component: TestComponent }
      // 実際のルートと異なる
    ])
  ]
});

// ✅ 正しい: 実際のルート設定を使用
import { routes } from './app.routes';

TestBed.configureTestingModule({
  providers: [provideRouter(routes)]
});
```

### 7. クエリパラメータのテスト不足

```typescript
// ❌ 間違い: パスのみをテスト
expect(location.path()).toBe('/search');

// ✅ 正しい: クエリパラメータも検証
expect(location.path()).toBe('/search?q=test&page=1');
// または
expect(route.snapshot.queryParams['q']).toBe('test');
```

### 8. NavigationイベントのSubscription漏れ

```typescript
// ❌ 間違い: Subscriptionを管理しない
component.ngOnInit();
// テスト終了時にunsubscribeされない

// ✅ 正しい: テスト後にクリーンアップ
let subscription: Subscription;

beforeEach(() => {
  subscription = router.events.subscribe(...);
});

afterEach(() => {
  subscription?.unsubscribe();
});
```

### 9. CanDeactivateガードのテスト不足

```typescript
// ❌ 間違い: ユーザーインタラクションをテストしない
it('ガードがfalseを返す', () => {
  expect(guard.canDeactivate(component, ...)).toBe(false);
});

// ✅ 正しい: 実際のユーザーシナリオをテスト
it('未保存の変更がある場合に確認を求める', () => {
  component.form.markAsDirty();
  spyOn(window, 'confirm').and.returnValue(false);

  expect(guard.canDeactivate(component, ...)).toBe(false);
});
```

### 10. E2Eテストへの過度な依存

```typescript
// ❌ 間違い: すべてをE2Eでテスト（遅い、脆弱）

// ✅ 正しい: テストピラミッドに従う
// - 多くのユニットテスト（ガード、リゾルバー）
// - 適度な統合テスト（ナビゲーションフロー）
// - 少数のE2Eテスト（クリティカルなユーザーフロー）
```

## 演習問題

### 初級

#### 演習1: 基本的なナビゲーションテストの作成

以下の要件を満たすコンポーネントとテストを作成してください：

1. 3つのルート（Home, About, Contact）を持つアプリケーション
2. 各ルートへのナビゲーションをテスト
3. 存在しないパスへのリダイレクトをテスト

```typescript
// あなたのコード:
// 1. app.routes.tsを作成
// 2. ナビゲーションコンポーネントを作成
// 3. テストを作成
```

<details>
<summary>解答例</summary>

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];

// nav.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
      <a routerLink="/contact">Contact</a>
    </nav>
  `
})
export class NavComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

// nav.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';
import { routes } from './app.routes';

describe('NavComponent - Exercise 1', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('/へナビゲートできること', fakeAsync(() => {
    component.navigateTo('/');
    tick();
    expect(location.path()).toBe('');
  }));

  it('/aboutへナビゲートできること', fakeAsync(() => {
    component.navigateTo('/about');
    tick();
    expect(location.path()).toBe('/about');
  }));

  it('/contactへナビゲートできること', fakeAsync(() => {
    component.navigateTo('/contact');
    tick();
    expect(location.path()).toBe('/contact');
  }));

  it('存在しないパスは/へリダイレクトされること', fakeAsync(() => {
    component.navigateTo('/non-existent');
    tick();
    expect(location.path()).toBe('');
  }));
});
```
</details>

#### 演習2: ルートパラメータのテスト

ユーザーIDをルートパラメータとして受け取り、表示するコンポーネントのテストを作成してください。

```typescript
// あなたのコード:
// 1. UserDetailComponentを作成（IDをパラメータから取得）
// 2. IDが変更されたときの動作をテスト
// 3. 無効なIDの処理をテスト
```

<details>
<summary>解答例</summary>

```typescript
// user-detail.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="userId() > 0; else invalid">
      <h2>ユーザー詳細</h2>
      <p>ユーザーID: {{ userId() }}</p>
      <p>状態: {{ isValid() ? '有効' : '無効' }}</p>
    </div>
    <ng-template #invalid>
      <p>無効なユーザーIDです</p>
    </ng-template>
  `
})
export class UserDetailComponent implements OnInit {
  userId = toSignal(
    this.route.params.pipe(
      map(params => parseInt(params['id'], 10))
    ),
    { initialValue: 0 }
  );

  isValid = signal(false);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // ユーザーIDの妥当性チェック
    if (this.userId() > 0) {
      this.isValid.set(true);
    }
  }
}

// user-detail.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';
import { of } from 'rxjs';

describe('UserDetailComponent - Exercise 2', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  function createComponent(id: string) {
    TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('有効なIDを正しく表示すること', () => {
    createComponent('123');
    expect(component.userId()).toBe(123);
    expect(component.isValid()).toBe(true);
  });

  it('IDが0の場合は無効とすること', () => {
    createComponent('0');
    expect(component.userId()).toBe(0);
    expect(component.isValid()).toBe(false);
  });

  it('負のIDの場合は無効とすること', () => {
    createComponent('-5');
    expect(component.userId()).toBe(-5);
    expect(component.isValid()).toBe(false);
  });

  it('無効なID文字列の場合はNaNになること', () => {
    createComponent('invalid');
    expect(isNaN(component.userId())).toBe(true);
  });
});
```
</details>

### 中級

#### 演習3: 認証ガードの包括的テスト

以下の機能を持つ認証ガードをテストしてください：

1. 未認証ユーザーはログインページへリダイレクト
2. returnUrlパラメータが正しく設定される
3. トークンの有効期限チェック
4. リフレッシュトークンの処理

```typescript
// あなたのコード:
// 1. 高度な認証サービスを作成
// 2. トークン管理を含むガードを作成
// 3. 様々なシナリオをテスト
```

<details>
<summary>解答例</summary>

```typescript
// advanced-auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedAuthService {
  private tokenSignal = signal<Token | null>(null);
  token = this.tokenSignal.asReadonly();

  isAuthenticated = signal(false);

  setToken(token: Token): void {
    this.tokenSignal.set(token);
    this.isAuthenticated.set(true);
  }

  clearToken(): void {
    this.tokenSignal.set(null);
    this.isAuthenticated.set(false);
  }

  isTokenExpired(): boolean {
    const token = this.tokenSignal();
    if (!token) return true;
    return Date.now() >= token.expiresAt;
  }

  refreshToken(): Observable<boolean> {
    const token = this.tokenSignal();
    if (!token?.refreshToken) {
      return of(false);
    }

    // リフレッシュトークンのシミュレーション
    const newToken: Token = {
      accessToken: 'new-access-token',
      refreshToken: token.refreshToken,
      expiresAt: Date.now() + 3600000 // 1時間後
    };

    this.setToken(newToken);
    return of(true);
  }
}

// advanced-auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdvancedAuthService } from './advanced-auth.service';
import { map } from 'rxjs/operators';

export const advancedAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AdvancedAuthService);
  const router = inject(Router);

  // 認証されていない場合
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // トークンが期限切れの場合
  if (authService.isTokenExpired()) {
    // リフレッシュを試みる
    return authService.refreshToken().pipe(
      map(success => {
        if (success) {
          return true;
        }
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url, reason: 'expired' }
        });
      })
    );
  }

  return true;
};

// advanced-auth.guard.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { advancedAuthGuard } from './advanced-auth.guard';
import { AdvancedAuthService } from './advanced-auth.service';

describe('advancedAuthGuard - Exercise 3', () => {
  let authService: AdvancedAuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: {} as any }
        ]),
        AdvancedAuthService
      ]
    });

    authService = TestBed.inject(AdvancedAuthService);
    router = TestBed.inject(Router);
  });

  it('未認証ユーザーはログインへリダイレクト', (done) => {
    authService.isAuthenticated.set(false);

    TestBed.runInInjectionContext(() => {
      const result = advancedAuthGuard(
        { routeConfig: {} } as any,
        { url: '/protected' } as any
      ) as UrlTree;

      expect(result.toString()).toContain('/login');
      expect(result.queryParams['returnUrl']).toBe('/protected');
      done();
    });
  });

  it('有効なトークンを持つユーザーはアクセス可能', (done) => {
    authService.setToken({
      accessToken: 'valid-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 3600000
    });

    TestBed.runInInjectionContext(() => {
      const result = advancedAuthGuard(
        { routeConfig: {} } as any,
        { url: '/protected' } as any
      );

      expect(result).toBe(true);
      done();
    });
  });

  it('期限切れトークンはリフレッシュを試みる', fakeAsync(() => {
    authService.setToken({
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() - 1000 // 期限切れ
    });

    spyOn(authService, 'refreshToken').and.callThrough();

    TestBed.runInInjectionContext(() => {
      const result$ = advancedAuthGuard(
        { routeConfig: {} } as any,
        { url: '/protected' } as any
      );

      if (typeof result$ === 'object' && 'subscribe' in result$) {
        result$.subscribe(result => {
          expect(authService.refreshToken).toHaveBeenCalled();
          expect(result).toBe(true);
        });
      }
    });

    tick();
  }));

  it('リフレッシュ失敗時はログインへリダイレクト', fakeAsync(() => {
    authService.setToken({
      accessToken: 'expired-token',
      refreshToken: '',
      expiresAt: Date.now() - 1000
    });

    TestBed.runInInjectionContext(() => {
      const result$ = advancedAuthGuard(
        { routeConfig: {} } as any,
        { url: '/protected' } as any
      );

      if (typeof result$ === 'object' && 'subscribe' in result$) {
        result$.subscribe(result => {
          if (result instanceof UrlTree) {
            expect(result.toString()).toContain('/login');
            expect(result.queryParams['reason']).toBe('expired');
          }
        });
      }
    });

    tick();
  }));
});
```
</details>

#### 演習4: 複雑なリゾルバーのテスト

以下の要件を満たすリゾルバーをテストしてください：

1. データのキャッシング
2. エラーハンドリング
3. リトライロジック
4. ローディング状態の管理

<details>
<summary>解答例</summary>

```typescript
// data.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, retryWhen, mergeMap, finalize } from 'rxjs/operators';

export interface DataItem {
  id: number;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = signal<Map<number, DataItem>>(new Map());
  isLoading = signal(false);
  errorCount = signal(0);

  getData(id: number, forceRefresh = false): Observable<DataItem> {
    // キャッシュチェック
    if (!forceRefresh) {
      const cached = this.cache().get(id);
      if (cached) {
        return of(cached);
      }
    }

    this.isLoading.set(true);

    // API呼び出しのシミュレーション
    return this.simulateApiCall(id).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index >= 2) {
              return throwError(() => error);
            }
            this.errorCount.update(c => c + 1);
            return timer(1000 * (index + 1));
          })
        )
      ),
      map(data => {
        this.cache.update(cache => {
          const newCache = new Map(cache);
          newCache.set(id, data);
          return newCache;
        });
        return data;
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  private simulateApiCall(id: number): Observable<DataItem> {
    if (id < 0) {
      return throwError(() => new Error('Invalid ID'));
    }

    return of({
      id,
      title: `Item ${id}`,
      content: `Content for item ${id}`
    });
  }

  clearCache(): void {
    this.cache.set(new Map());
  }
}

// data.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { DataItem, DataService } from './data.service';
import { catchError, of } from 'rxjs';

export const dataResolver: ResolveFn<DataItem | null> = (route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (isNaN(id) || id < 0) {
    router.navigate(['/error'], {
      state: { message: 'Invalid ID' }
    });
    return of(null);
  }

  return dataService.getData(id).pipe(
    catchError(error => {
      console.error('Resolver error:', error);
      router.navigate(['/error'], {
        state: { message: error.message }
      });
      return of(null);
    })
  );
};

// data.resolver.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { dataResolver } from './data.resolver';
import { DataService, DataItem } from './data.service';

describe('dataResolver - Exercise 4', () => {
  let dataService: DataService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        DataService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    dataService = TestBed.inject(DataService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('有効なIDでデータを解決すること', fakeAsync(() => {
    const mockData: DataItem = {
      id: 1,
      title: 'Test Item',
      content: 'Test Content'
    };

    spyOn(dataService, 'getData').and.returnValue(of(mockData));

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '1' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = dataResolver(route, {} as any);

      result$.subscribe(data => {
        expect(data).toEqual(mockData);
        expect(dataService.getData).toHaveBeenCalledWith(1);
      });
    });

    tick();
  }));

  it('キャッシュされたデータを返すこと', fakeAsync(() => {
    const cachedData: DataItem = {
      id: 2,
      title: 'Cached Item',
      content: 'Cached Content'
    };

    // キャッシュを設定
    dataService['cache'].update(cache => {
      const newCache = new Map(cache);
      newCache.set(2, cachedData);
      return newCache;
    });

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '2' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = dataResolver(route, {} as any);

      result$.subscribe(data => {
        expect(data).toEqual(cachedData);
      });
    });

    tick();
  }));

  it('無効なIDでエラーページへリダイレクト', fakeAsync(() => {
    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? 'invalid' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = dataResolver(route, {} as any);

      result$.subscribe(data => {
        expect(data).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(
          ['/error'],
          { state: { message: 'Invalid ID' } }
        );
      });
    });

    tick();
  }));

  it('データ取得エラー時にエラーページへリダイレクト', fakeAsync(() => {
    const errorMessage = 'Network error';
    spyOn(dataService, 'getData').and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '1' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = dataResolver(route, {} as any);

      result$.subscribe(data => {
        expect(data).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(
          ['/error'],
          { state: { message: errorMessage } }
        );
      });
    });

    tick();
  }));

  it('ローディング状態が正しく管理されること', fakeAsync(() => {
    const mockData: DataItem = {
      id: 3,
      title: 'Loading Test',
      content: 'Content'
    };

    spyOn(dataService, 'getData').and.returnValue(of(mockData));

    expect(dataService.isLoading()).toBe(false);

    const route = {
      paramMap: {
        get: (key: string) => key === 'id' ? '3' : null
      }
    } as any;

    TestBed.runInInjectionContext(() => {
      const result$ = dataResolver(route, {} as any);
      result$.subscribe();
    });

    tick();
    expect(dataService.isLoading()).toBe(false);
  }));
});
```
</details>

### 上級

#### 演習5: E2Eスタイルの統合テスト

複数のコンポーネント、ガード、リゾルバーを組み合わせた完全なユーザーフローをテストしてください：

1. ログイン → 商品一覧 → 商品詳細 → カート追加
2. 各ステップでの認証チェック
3. データの永続化
4. エラー処理

<details>
<summary>解答例</summary>

```typescript
// e2e-integration.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// サービスの定義
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
class E2EAuthService {
  isAuthenticated = signal(false);
  currentUser = signal<{ username: string } | null>(null);

  login(username: string, password: string): Observable<boolean> {
    if (username && password) {
      return of(true).pipe(
        delay(100),
        tap(() => {
          this.isAuthenticated.set(true);
          this.currentUser.set({ username });
        })
      );
    }
    return of(false);
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}

@Injectable({ providedIn: 'root' })
class E2EProductService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Mouse', price: 20 },
    { id: 3, name: 'Keyboard', price: 50 }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(50));
  }

  getProduct(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return product
      ? of(product).pipe(delay(50))
      : throwError(() => new Error('Product not found'));
  }
}

@Injectable({ providedIn: 'root' })
class E2ECartService {
  private items = signal<CartItem[]>([]);
  cartItems = this.items.asReadonly();

  addToCart(product: Product, quantity: number): void {
    this.items.update(items => {
      const existing = items.find(item => item.product.id === product.id);
      if (existing) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { product, quantity }];
    });
  }

  clearCart(): void {
    this.items.set([]);
  }

  getTotalItems(): number {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  }
}

// ガードの定義
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

const e2eAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(E2EAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// リゾルバーの定義
import { ResolveFn } from '@angular/router';

const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(E2EProductService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (isNaN(id)) {
    router.navigate(['/products']);
    return of(null);
  }

  return productService.getProduct(id).pipe(
    catchError(() => {
      router.navigate(['/products']);
      return of(null);
    })
  );
};

// コンポーネントの定義
@Component({
  selector: 'app-e2e-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login">
      <h2>ログイン</h2>
      <input [(ngModel)]="username" placeholder="ユーザー名" />
      <input [(ngModel)]="password" type="password" placeholder="パスワード" />
      <button (click)="login()">ログイン</button>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `
})
class E2ELoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: E2EAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
          this.router.navigate([returnUrl]);
        } else {
          this.error = 'ログインに失敗しました';
        }
      },
      error: () => {
        this.error = 'エラーが発生しました';
      }
    });
  }
}

@Component({
  selector: 'app-e2e-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="products">
      <h2>商品一覧</h2>
      <div class="cart-summary">カート: {{ cartService.getTotalItems() }}個</div>
      <div *ngFor="let product of products()" class="product-item">
        <h3>{{ product.name }}</h3>
        <p>¥{{ product.price }}</p>
        <a [routerLink]="['/products', product.id]">詳細を見る</a>
      </div>
    </div>
  `
})
class E2EProductListComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(
    private productService: E2EProductService,
    public cartService: E2ECartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products)
    });
  }
}

@Component({
  selector: 'app-e2e-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-detail" *ngIf="product()">
      <h2>{{ product()!.name }}</h2>
      <p>価格: ¥{{ product()!.price }}</p>
      <input type="number" [(ngModel)]="quantity" min="1" />
      <button (click)="addToCart()">カートに追加</button>
      <p *ngIf="added()" class="success">カートに追加しました！</p>
      <button (click)="goBack()">商品一覧に戻る</button>
    </div>
  `
})
class E2EProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  quantity = 1;
  added = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: E2ECartService
  ) {}

  ngOnInit(): void {
    const product = this.route.snapshot.data['product'];
    if (product) {
      this.product.set(product);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity);
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2000);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

// ルート設定
import { Routes } from '@angular/router';

const e2eRoutes: Routes = [
  { path: 'login', component: E2ELoginComponent },
  {
    path: 'products',
    component: E2EProductListComponent,
    canActivate: [e2eAuthGuard]
  },
  {
    path: 'products/:id',
    component: E2EProductDetailComponent,
    canActivate: [e2eAuthGuard],
    resolve: { product: productResolver }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

// 統合テスト
describe('E2E Integration Test - Exercise 5', () => {
  let router: Router;
  let location: Location;
  let authService: E2EAuthService;
  let productService: E2EProductService;
  let cartService: E2ECartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        E2ELoginComponent,
        E2EProductListComponent,
        E2EProductDetailComponent
      ],
      providers: [
        provideRouter(e2eRoutes),
        E2EAuthService,
        E2EProductService,
        E2ECartService
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(E2EAuthService);
    productService = TestBed.inject(E2EProductService);
    cartService = TestBed.inject(E2ECartService);
  });

  afterEach(() => {
    authService.logout();
    cartService.clearCart();
  });

  it('完全なユーザーフロー: ログイン → 商品一覧 → 商品詳細 → カート追加', fakeAsync(() => {
    // Step 1: 初期状態（ログインページへリダイレクト）
    router.navigate(['/products']);
    tick();
    expect(location.path()).toContain('/login');

    // Step 2: ログイン
    const loginFixture = TestBed.createComponent(E2ELoginComponent);
    loginFixture.detectChanges();
    const loginComponent = loginFixture.componentInstance;

    loginComponent.username = 'testuser';
    loginComponent.password = 'password';
    loginComponent.login();
    tick(150); // ログイン処理の待機

    expect(authService.isAuthenticated()).toBe(true);
    expect(location.path()).toBe('/products');

    // Step 3: 商品一覧表示
    const productsFixture = TestBed.createComponent(E2EProductListComponent);
    productsFixture.detectChanges();
    tick(100); // 商品読み込みの待機

    const productsComponent = productsFixture.componentInstance;
    expect(productsComponent.products().length).toBe(3);

    // Step 4: 商品詳細へナビゲート
    router.navigate(['/products', 1]);
    tick(100); // リゾルバーの待機

    expect(location.path()).toBe('/products/1');

    // Step 5: 商品詳細表示とカート追加
    const detailFixture = TestBed.createComponent(E2EProductDetailComponent);
    detailFixture.detectChanges();
    const detailComponent = detailFixture.componentInstance;

    expect(detailComponent.product()?.id).toBe(1);
    expect(detailComponent.product()?.name).toBe('Laptop');

    detailComponent.quantity = 2;
    detailComponent.addToCart();
    tick();

    expect(cartService.getTotalItems()).toBe(2);
    expect(detailComponent.added()).toBe(true);

    // Step 6: 2つ目の商品を追加
    router.navigate(['/products', 2]);
    tick(100);

    const detail2Fixture = TestBed.createComponent(E2EProductDetailComponent);
    detail2Fixture.detectChanges();
    const detail2Component = detail2Fixture.componentInstance;

    detail2Component.quantity = 1;
    detail2Component.addToCart();
    tick();

    expect(cartService.getTotalItems()).toBe(3);

    // Step 7: カートの内容を検証
    const cartItems = cartService.cartItems();
    expect(cartItems.length).toBe(2);
    expect(cartItems[0].product.name).toBe('Laptop');
    expect(cartItems[0].quantity).toBe(2);
    expect(cartItems[1].product.name).toBe('Mouse');
    expect(cartItems[1].quantity).toBe(1);

    flush();
  }));

  it('未認証時に保護されたページへのアクセスをブロック', fakeAsync(() => {
    authService.logout();

    router.navigate(['/products']);
    tick();

    expect(location.path()).toContain('/login');
    expect(location.path()).toContain('returnUrl=%2Fproducts');
  }));

  it('無効な商品IDでリダイレクト', fakeAsync(() => {
    authService.isAuthenticated.set(true);

    router.navigate(['/products', 'invalid']);
    tick(150);

    expect(location.path()).toBe('/products');
  }));

  it('ログアウト後に保護されたページにアクセスできない', fakeAsync(() => {
    // ログイン
    authService.isAuthenticated.set(true);
    router.navigate(['/products']);
    tick();
    expect(location.path()).toBe('/products');

    // ログアウト
    authService.logout();

    // 保護されたページへアクセス試行
    router.navigate(['/products', 1]);
    tick();

    expect(location.path()).toContain('/login');
  }));
});
```
</details>

## 次のステップへのリンク

ルーティングのテストをマスターしたら、次のトピックに進みましょう：

- [dynamic-routes](../dynamic-routes/README.md) - 動的ルート生成のテスト手法
- [complex-guards](../complex-guards/README.md) - 複雑なガードの組み合わせテスト
- [route-reuse](../route-reuse/README.md) - ルート再利用戦略のテスト
- [error-handling](../error-handling/README.md) - エラーハンドリングの包括的テスト
- [performance](../performance/README.md) - パフォーマンステストとベンチマーク

## まとめ

このセクションでは、Angular 18の最新機能を使用したルーティングのテスト手法を学びました：

1. **Standalone Components対応**: provideRouterを使用した最新のテスト構成
2. **関数型Guards**: runInInjectionContextを使用したテスト
3. **Signalベース**: Signal状態のテストパターン
4. **統合テスト**: Location APIを使用した実際のナビゲーションテスト
5. **包括的カバレッジ**: ガード、リゾルバー、パラメータ、エラー処理の全側面

テストは、アプリケーションの品質を保証し、リファクタリングの安全性を高める重要な要素です。このセクションで学んだパターンを活用して、堅牢なAngularアプリケーションを構築してください。
