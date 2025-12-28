# 複雑なガードの組み合わせ (Complex Guards)

## 学習内容

- 複数のガードを組み合わせた高度な認証・認可戦略
- 関数型guardsを使用した合成可能なガードパターン
- 非同期ガードとエラーハンドリング
- コンテキスト依存のガード実装
- パフォーマンスを考慮したガードの最適化

## セクションの説明

実際のアプリケーションでは、単純な認証チェックだけでなく、複数の条件を組み合わせた複雑な認可ロジックが必要になります。例えば、「ログインしているか」「適切なロールを持っているか」「特定のリソースへのアクセス権限があるか」「時間帯や場所の制限」など、様々な条件を組み合わせる必要があります。

このセクションでは、Angular 18の関数型guardsを活用し、再利用可能で組み合わせ可能な複雑なガードシステムを構築する方法を学びます。

## 実装例

### 例1: 基本的なガードの合成

```typescript
// auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  emailVerified: boolean;
  accountLocked: boolean;
  lastLogin: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  isEmailVerified = computed(() => {
    const user = this.currentUserSignal();
    return user?.emailVerified ?? false;
  });

  isAccountActive = computed(() => {
    const user = this.currentUserSignal();
    return !(user?.accountLocked ?? true);
  });

  setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    return user?.roles.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSignal();
    return user?.permissions.includes(permission) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }
}
```

```typescript
// guards/basic-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * 認証チェックガード
 */
export const isAuthenticatedGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * メール認証済みチェックガード
 */
export const isEmailVerifiedGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEmailVerified()) {
    return true;
  }

  return router.createUrlTree(['/verify-email'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * アカウントアクティブチェックガード
 */
export const isAccountActiveGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAccountActive()) {
    return true;
  }

  return router.createUrlTree(['/account-locked']);
};

/**
 * ロールチェックガード（ファクトリ関数）
 */
export const hasRole = (role: string): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(role)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};

/**
 * 複数ロールチェック（いずれかを持つ）
 */
export const hasAnyRole = (roles: string[]): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasAnyRole(roles)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};

/**
 * 権限チェックガード
 */
export const hasPermission = (permission: string): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasPermission(permission)) {
      return true;
    }

    return router.createUrlTree(['/forbidden']);
  };
};
```

```typescript
// guards/composed-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ガードコンポーザー: 複数のガードをAND条件で結合
 */
export const composeGuards = (...guards: CanActivateFn[]): CanActivateFn => {
  return async (route, state) => {
    for (const guard of guards) {
      const result = await Promise.resolve(guard(route, state));

      if (result !== true) {
        return result; // false または UrlTree
      }
    }
    return true;
  };
};

/**
 * ガードコンポーザー: 複数のガードをOR条件で結合
 */
export const anyGuard = (...guards: CanActivateFn[]): CanActivateFn => {
  return async (route, state) => {
    const results = await Promise.all(
      guards.map(guard => Promise.resolve(guard(route, state)))
    );

    // いずれかのガードがtrueを返せばOK
    const hasTrue = results.some(result => result === true);
    if (hasTrue) {
      return true;
    }

    // すべてのガードが失敗した場合、最後のリダイレクト先を使用
    const lastResult = results[results.length - 1];
    return lastResult !== true ? lastResult : false;
  };
};

/**
 * 認証済み + メール認証済みガード
 */
export const fullyAuthenticatedGuard: CanActivateFn = composeGuards(
  isAuthenticatedGuard,
  isEmailVerifiedGuard,
  isAccountActiveGuard
);

/**
 * 管理者ガード（認証 + 管理者ロール）
 */
export const adminGuard: CanActivateFn = composeGuards(
  fullyAuthenticatedGuard,
  hasRole('admin')
);

/**
 * スーパー管理者ガード（認証 + スーパー管理者ロール）
 */
export const superAdminGuard: CanActivateFn = composeGuards(
  fullyAuthenticatedGuard,
  hasRole('super-admin')
);

/**
 * コンテンツ編集者ガード（認証 + 編集権限）
 */
export const contentEditorGuard: CanActivateFn = composeGuards(
  fullyAuthenticatedGuard,
  hasAnyRole(['editor', 'admin']),
  hasPermission('content.edit')
);
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { EditorComponent } from './editor/editor.component';
import {
  fullyAuthenticatedGuard,
  adminGuard,
  contentEditorGuard
} from './guards/composed-guards';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [fullyAuthenticatedGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'editor',
    component: EditorComponent,
    canActivate: [contentEditorGuard]
  }
];
```

### 例2: データ依存のガード

```typescript
// services/resource.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

export interface Resource {
  id: string;
  ownerId: string;
  title: string;
  visibility: 'public' | 'private' | 'shared';
  sharedWith: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private resources = signal<Resource[]>([
    {
      id: '1',
      ownerId: 'user-1',
      title: 'Private Document',
      visibility: 'private',
      sharedWith: []
    },
    {
      id: '2',
      ownerId: 'user-2',
      title: 'Shared Document',
      visibility: 'shared',
      sharedWith: ['user-1', 'user-3']
    }
  ]);

  getResource(id: string): Observable<Resource | undefined> {
    const resource = this.resources().find(r => r.id === id);
    return resource
      ? of(resource).pipe(delay(100))
      : throwError(() => new Error('Resource not found'));
  }

  canAccessResource(resourceId: string, userId: string): Observable<boolean> {
    return new Observable(observer => {
      this.getResource(resourceId).subscribe({
        next: (resource) => {
          if (!resource) {
            observer.next(false);
            observer.complete();
            return;
          }

          // オーナーはアクセス可能
          if (resource.ownerId === userId) {
            observer.next(true);
            observer.complete();
            return;
          }

          // 公開リソースはすべて可能
          if (resource.visibility === 'public') {
            observer.next(true);
            observer.complete();
            return;
          }

          // 共有されているか確認
          if (resource.visibility === 'shared' && resource.sharedWith.includes(userId)) {
            observer.next(true);
            observer.complete();
            return;
          }

          observer.next(false);
          observer.complete();
        },
        error: (error) => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
```

```typescript
// guards/resource-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ResourceService } from '../services/resource.service';

/**
 * リソースアクセス権限ガード
 */
export const canAccessResourceGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const resourceService = inject(ResourceService);
  const router = inject(Router);

  const resourceId = route.paramMap.get('id');
  const currentUser = authService.currentUser();

  if (!resourceId || !currentUser) {
    return router.createUrlTree(['/not-found']);
  }

  return resourceService.canAccessResource(resourceId, currentUser.id).pipe(
    map(canAccess => {
      if (canAccess) {
        return true;
      }
      return router.createUrlTree(['/forbidden'], {
        state: { message: 'このリソースへのアクセス権限がありません' }
      });
    }),
    catchError(() => {
      return of(router.createUrlTree(['/not-found']));
    })
  );
};

/**
 * リソースオーナーチェックガード
 */
export const isResourceOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const resourceService = inject(ResourceService);
  const router = inject(Router);

  const resourceId = route.paramMap.get('id');
  const currentUser = authService.currentUser();

  if (!resourceId || !currentUser) {
    return router.createUrlTree(['/not-found']);
  }

  return resourceService.getResource(resourceId).pipe(
    map(resource => {
      if (resource && resource.ownerId === currentUser.id) {
        return true;
      }
      return router.createUrlTree(['/forbidden']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/not-found']));
    })
  );
};

/**
 * 複合ガード: リソース編集権限
 * （認証済み && (オーナー || 管理者)）
 */
export const canEditResourceGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const resourceService = inject(ResourceService);
  const router = inject(Router);

  // まず認証チェック
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const currentUser = authService.currentUser();
  const resourceId = route.paramMap.get('id');

  if (!resourceId || !currentUser) {
    return router.createUrlTree(['/not-found']);
  }

  // 管理者は常に編集可能
  if (authService.hasRole('admin')) {
    return true;
  }

  // オーナーチェック
  return resourceService.getResource(resourceId).pipe(
    map(resource => {
      if (resource && resource.ownerId === currentUser.id) {
        return true;
      }
      return router.createUrlTree(['/forbidden'], {
        state: { message: 'このリソースを編集する権限がありません' }
      });
    }),
    catchError(() => {
      return of(router.createUrlTree(['/not-found']));
    })
  );
};
```

### 例3: 時間ベースのガード

```typescript
// services/business-hours.service.ts
import { Injectable, signal } from '@angular/core';

export interface BusinessHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
}

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {
  private businessHours: BusinessHours[] = [
    { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' }, // Monday
    { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' }, // Tuesday
    { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' }, // Wednesday
    { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' }, // Thursday
    { dayOfWeek: 5, openTime: '09:00', closeTime: '17:00' }, // Friday
  ];

  private maintenanceMode = signal(false);
  isMaintenanceMode = this.maintenanceMode.asReadonly();

  setMaintenanceMode(enabled: boolean): void {
    this.maintenanceMode.set(enabled);
  }

  isBusinessHours(date: Date = new Date()): boolean {
    if (this.maintenanceMode()) {
      return false;
    }

    const dayOfWeek = date.getDay();
    const hours = this.businessHours.find(h => h.dayOfWeek === dayOfWeek);

    if (!hours) {
      return false; // 休業日
    }

    const currentTime = this.formatTime(date);
    return currentTime >= hours.openTime && currentTime <= hours.closeTime;
  }

  getNextBusinessHours(): Date | null {
    const now = new Date();
    const currentDay = now.getDay();

    // 最大7日先まで検索
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + i);
      const checkDay = checkDate.getDay();

      const hours = this.businessHours.find(h => h.dayOfWeek === checkDay);
      if (hours) {
        const [openHour, openMinute] = hours.openTime.split(':').map(Number);
        const nextOpen = new Date(checkDate);
        nextOpen.setHours(openHour, openMinute, 0, 0);

        if (nextOpen > now) {
          return nextOpen;
        }
      }
    }

    return null;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
```

```typescript
// guards/time-based-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BusinessHoursService } from '../services/business-hours.service';

/**
 * 営業時間内チェックガード
 */
export const duringBusinessHoursGuard: CanActivateFn = (route, state) => {
  const businessHoursService = inject(BusinessHoursService);
  const router = inject(Router);

  if (businessHoursService.isBusinessHours()) {
    return true;
  }

  const nextOpen = businessHoursService.getNextBusinessHours();
  return router.createUrlTree(['/outside-business-hours'], {
    state: { nextOpen }
  });
};

/**
 * メンテナンスモードチェック
 */
export const notInMaintenanceGuard: CanActivateFn = (route, state) => {
  const businessHoursService = inject(BusinessHoursService);
  const router = inject(Router);

  if (!businessHoursService.isMaintenanceMode()) {
    return true;
  }

  return router.createUrlTree(['/maintenance']);
};

/**
 * 時間帯別アクセス制限ガード
 */
export const timeWindowGuard = (startHour: number, endHour: number): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= startHour && currentHour < endHour) {
      return true;
    }

    return router.createUrlTree(['/time-restricted'], {
      state: {
        message: `このページは${startHour}:00〜${endHour}:00の間のみアクセス可能です`
      }
    });
  };
};

/**
 * 平日のみアクセス可能ガード
 */
export const weekdaysOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const dayOfWeek = new Date().getDay();

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return true;
  }

  return router.createUrlTree(['/weekends-only'], {
    state: { message: 'このページは平日のみアクセス可能です' }
  });
};
```

### 例4: 段階的な認証ガード

```typescript
// services/multi-factor-auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export type AuthLevel = 'none' | 'basic' | 'mfa' | 'biometric';

export interface AuthState {
  level: AuthLevel;
  userId: string | null;
  mfaVerified: boolean;
  biometricVerified: boolean;
  lastVerification: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class MultiFactorAuthService {
  private authStateSignal = signal<AuthState>({
    level: 'none',
    userId: null,
    mfaVerified: false,
    biometricVerified: false,
    lastVerification: null
  });

  authState = this.authStateSignal.asReadonly();

  /**
   * 基本認証
   */
  basicLogin(username: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(200),
      map(success => {
        if (success) {
          this.authStateSignal.update(state => ({
            ...state,
            level: 'basic',
            userId: username,
            lastVerification: new Date()
          }));
        }
        return success;
      })
    );
  }

  /**
   * 多要素認証
   */
  verifyMFA(code: string): Observable<boolean> {
    return of(code.length === 6).pipe(
      delay(300),
      map(success => {
        if (success) {
          this.authStateSignal.update(state => ({
            ...state,
            level: 'mfa',
            mfaVerified: true,
            lastVerification: new Date()
          }));
        }
        return success;
      })
    );
  }

  /**
   * 生体認証
   */
  verifyBiometric(): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(success => {
        if (success) {
          this.authStateSignal.update(state => ({
            ...state,
            level: 'biometric',
            biometricVerified: true,
            lastVerification: new Date()
          }));
        }
        return success;
      })
    );
  }

  /**
   * 認証レベルチェック
   */
  hasAuthLevel(requiredLevel: AuthLevel): boolean {
    const levels: AuthLevel[] = ['none', 'basic', 'mfa', 'biometric'];
    const currentIndex = levels.indexOf(this.authStateSignal().level);
    const requiredIndex = levels.indexOf(requiredLevel);

    return currentIndex >= requiredIndex;
  }

  /**
   * 認証の有効期限チェック
   */
  isAuthExpired(maxAge: number = 30 * 60 * 1000): boolean {
    const lastVerification = this.authStateSignal().lastVerification;
    if (!lastVerification) return true;

    const now = Date.now();
    const age = now - lastVerification.getTime();
    return age > maxAge;
  }

  logout(): void {
    this.authStateSignal.set({
      level: 'none',
      userId: null,
      mfaVerified: false,
      biometricVerified: false,
      lastVerification: null
    });
  }
}
```

```typescript
// guards/multi-factor-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MultiFactorAuthService, AuthLevel } from '../services/multi-factor-auth.service';

/**
 * 認証レベル要求ガード（ファクトリ）
 */
export const requireAuthLevel = (level: AuthLevel): CanActivateFn => {
  return (route, state) => {
    const mfaService = inject(MultiFactorAuthService);
    const router = inject(Router);

    if (mfaService.hasAuthLevel(level)) {
      return true;
    }

    // 必要な認証レベルに応じてリダイレクト
    switch (level) {
      case 'basic':
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      case 'mfa':
        return router.createUrlTree(['/verify-mfa'], {
          queryParams: { returnUrl: state.url }
        });
      case 'biometric':
        return router.createUrlTree(['/verify-biometric'], {
          queryParams: { returnUrl: state.url }
        });
      default:
        return router.createUrlTree(['/login']);
    }
  };
};

/**
 * 認証有効期限チェックガード
 */
export const authNotExpiredGuard = (maxAge?: number): CanActivateFn => {
  return (route, state) => {
    const mfaService = inject(MultiFactorAuthService);
    const router = inject(Router);

    if (!mfaService.isAuthExpired(maxAge)) {
      return true;
    }

    return router.createUrlTree(['/session-expired'], {
      queryParams: { returnUrl: state.url }
    });
  };
};

/**
 * 高セキュリティガード（MFA + 有効期限チェック）
 */
export const highSecurityGuard: CanActivateFn = composeGuards(
  requireAuthLevel('mfa'),
  authNotExpiredGuard(15 * 60 * 1000) // 15分
);

/**
 * 最高セキュリティガード（生体認証 + 短い有効期限）
 */
export const maximumSecurityGuard: CanActivateFn = composeGuards(
  requireAuthLevel('biometric'),
  authNotExpiredGuard(5 * 60 * 1000) // 5分
);
```

```typescript
// app.routes.ts - セキュリティレベル別ルート
import { Routes } from '@angular/router';
import { requireAuthLevel, highSecurityGuard, maximumSecurityGuard } from './guards/multi-factor-guards';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canActivate: [requireAuthLevel('basic')]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component'),
    canActivate: [highSecurityGuard]
  },
  {
    path: 'financial',
    loadComponent: () => import('./financial/financial.component'),
    canActivate: [maximumSecurityGuard]
  }
];
```

### 例5: 条件付きガードとルートデータ

```typescript
// guards/conditional-guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ルートデータに基づく条件付きガード
 */
export const conditionalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ルートデータから要件を取得
  const routeData = route.data;

  // 認証チェック
  if (routeData['requiresAuth'] && !authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // ロールチェック
  if (routeData['roles']) {
    const requiredRoles = routeData['roles'] as string[];
    if (!authService.hasAnyRole(requiredRoles)) {
      return router.createUrlTree(['/unauthorized']);
    }
  }

  // 権限チェック
  if (routeData['permissions']) {
    const requiredPermissions = routeData['permissions'] as string[];
    const requireAll = routeData['requireAllPermissions'] ?? false;

    const hasPermission = requireAll
      ? authService.hasAllPermissions(requiredPermissions)
      : authService.hasAnyPermission(requiredPermissions);

    if (!hasPermission) {
      return router.createUrlTree(['/forbidden']);
    }
  }

  // メール認証チェック
  if (routeData['requiresEmailVerification'] && !authService.isEmailVerified()) {
    return router.createUrlTree(['/verify-email']);
  }

  return true;
};

/**
 * 機能フラグガード
 */
export const featureFlagGuard = (featureName: string): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const featureFlags = inject(FeatureFlagService);

    if (featureFlags.isEnabled(featureName)) {
      return true;
    }

    return router.createUrlTree(['/feature-not-available'], {
      state: { feature: featureName }
    });
  };
};

/**
 * 環境別ガード
 */
export const environmentGuard = (allowedEnvs: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const currentEnv = inject(ENVIRONMENT).name;

    if (allowedEnvs.includes(currentEnv)) {
      return true;
    }

    return router.createUrlTree(['/not-available']);
  };
};
```

```typescript
// app.routes.ts - 条件付きルート設定
export const routes: Routes = [
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [conditionalGuard],
    data: {
      requiresAuth: true,
      roles: ['admin', 'super-admin'],
      permissions: ['users.read', 'users.write'],
      requireAllPermissions: true,
      requiresEmailVerification: true
    }
  },
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canActivate: [
      conditionalGuard,
      featureFlagGuard('beta-features')
    ],
    data: {
      requiresAuth: true
    }
  },
  {
    path: 'dev-tools',
    component: DevToolsComponent,
    canActivate: [
      environmentGuard(['development', 'staging'])
    ]
  }
];
```

## ベストプラクティス

### 1. ガードの合成と再利用

```typescript
// ✅ 推奨: 小さなガードを組み合わせる
export const adminGuard = composeGuards(
  isAuthenticatedGuard,
  isEmailVerifiedGuard,
  hasRole('admin')
);

// ❌ 非推奨: 巨大な単一ガード
export const adminGuard: CanActivateFn = (route, state) => {
  // 認証チェック
  // メール認証チェック
  // ロールチェック
  // ... 100行のコード
};
```

### 2. エラーハンドリング

```typescript
// ✅ 推奨: 適切なエラーハンドリング
export const dataGuard: CanActivateFn = (route, state) => {
  return dataService.checkAccess(id).pipe(
    catchError(error => {
      console.error('Guard error:', error);
      return of(router.createUrlTree(['/error']));
    })
  );
};

// ❌ 非推奨: エラーを無視
export const dataGuard: CanActivateFn = (route, state) => {
  return dataService.checkAccess(id); // エラー時にクラッシュ
};
```

### 3. パフォーマンス最適化

```typescript
// ✅ 推奨: キャッシングと早期リターン
export const expensiveGuard: CanActivateFn = (route, state) => {
  const cache = inject(CacheService);
  const cached = cache.get(route.url.toString());

  if (cached !== undefined) {
    return cached; // キャッシュヒット
  }

  // 重い処理
  return performExpensiveCheck().pipe(
    tap(result => cache.set(route.url.toString(), result))
  );
};
```

### 4. 型安全性

```typescript
// ✅ 推奨: 厳密な型定義
interface GuardResult {
  canActivate: boolean;
  redirectUrl?: string;
  message?: string;
}

// ❌ 非推奨: any型の使用
const checkPermission = (user: any): any => {
  // ...
};
```

### 5. テスタビリティ

```typescript
// ✅ 推奨: テスト可能な設計
export const testableGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.check(); // モック可能
};

// テスト
TestBed.runInInjectionContext(() => {
  const result = testableGuard(mockRoute, mockState);
  expect(result).toBe(true);
});
```

### 6. ドキュメンテーション

```typescript
/**
 * 高セキュリティページ用ガード
 *
 * @remarks
 * - MFA認証が必要
 * - セッション有効期限: 15分
 * - 失敗時は /verify-mfa へリダイレクト
 *
 * @example
 * ```typescript
 * {
 *   path: 'secure',
 *   component: SecureComponent,
 *   canActivate: [highSecurityGuard]
 * }
 * ```
 */
export const highSecurityGuard: CanActivateFn = ...
```

### 7. 一貫性のあるリダイレクト戦略

```typescript
// ✅ 推奨: 統一されたリダイレクト処理
const REDIRECT_PATHS = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '/not-found'
} as const;

export const createRedirect = (
  path: keyof typeof REDIRECT_PATHS,
  options?: { returnUrl?: string; message?: string }
) => {
  const router = inject(Router);
  return router.createUrlTree([REDIRECT_PATHS[path]], {
    queryParams: options?.returnUrl ? { returnUrl: options.returnUrl } : undefined,
    state: options?.message ? { message: options.message } : undefined
  });
};
```

### 8. ガードの実行順序を考慮

```typescript
// ✅ 推奨: 軽いチェックから順に実行
export const optimizedGuard = composeGuards(
  isAuthenticatedGuard,      // 軽い（メモリチェック）
  isEmailVerifiedGuard,       // 軽い（メモリチェック）
  canAccessResourceGuard,     // 重い（API呼び出し）
  hasComplexPermissionGuard   // 非常に重い（複数API）
);
```

### 9. デバッグ支援

```typescript
// 開発環境でのガードデバッグ
export const debugGuard = (guardName: string, guard: CanActivateFn): CanActivateFn => {
  return async (route, state) => {
    console.group(`Guard: ${guardName}`);
    console.log('Route:', route);
    console.log('State:', state);

    const startTime = performance.now();
    const result = await Promise.resolve(guard(route, state));
    const endTime = performance.now();

    console.log('Result:', result);
    console.log('Execution time:', `${(endTime - startTime).toFixed(2)}ms`);
    console.groupEnd();

    return result;
  };
};
```

### 10. セキュリティベストプラクティス

```typescript
// ✅ 推奨: サーバーサイドでも検証
// フロントエンドのガードは UX 向上のため
// セキュリティは必ずバックエンドで実施

// ✅ 推奨: センシティブな情報をルートに含めない
// ❌ /admin?secret=12345
// ✅ /admin (セッション/トークンで認証)

// ✅ 推奨: タイミング攻撃対策
export const secureGuard: CanActivateFn = async (route, state) => {
  const result = await checkPermission();
  // 常に一定時間待機してタイミング攻撃を防ぐ
  await delay(Math.random() * 100);
  return result;
};
```

## よくある間違い

### 1. ガードの戻り値の型ミス

```typescript
// ❌ 間違い: booleanのみ返す（リダイレクト不可）
export const badGuard: CanActivateFn = () => {
  return false; // ユーザーはどこにも行けない
};

// ✅ 正しい: UrlTreeでリダイレクト
export const goodGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return router.createUrlTree(['/login']);
};
```

### 2. 非同期処理の誤った扱い

```typescript
// ❌ 間違い: Promiseを待たない
export const asyncGuard: CanActivateFn = (route, state) => {
  checkPermission(); // Promiseを無視
  return true; // 常にtrueを返してしまう
};

// ✅ 正しい: Observableまたはasync/awaitを使用
export const asyncGuard: CanActivateFn = (route, state) => {
  return from(checkPermission());
};
```

### 3. 循環依存

```typescript
// ❌ 間違い: サービス間で循環依存
// auth.service.ts
constructor(private router: Router) {}

// router.config.ts
const guard = () => inject(AuthService);

// ✅ 正しい: 適切な依存関係の設計
```

### 4. メモリリーク

```typescript
// ❌ 間違い: Subscriptionをクリーンアップしない
export const leakyGuard: CanActivateFn = (route, state) => {
  const service = inject(SomeService);
  service.data$.subscribe(data => {
    // これはメモリリーク!
  });
  return true;
};

// ✅ 正しい: Observableを直接返す
export const cleanGuard: CanActivateFn = (route, state) => {
  const service = inject(SomeService);
  return service.data$.pipe(
    map(data => /* check */ true)
  );
};
```

### 5. ガードのテスト不足

```typescript
// ❌ 間違い: テストなし
export const untestedGuard: CanActivateFn = (route, state) => {
  // 複雑なロジック...
};

// ✅ 正しい: 包括的なテスト
describe('myGuard', () => {
  it('should allow access when authenticated', () => {
    // テスト
  });

  it('should redirect to login when not authenticated', () => {
    // テスト
  });

  it('should handle errors gracefully', () => {
    // テスト
  });
});
```

### 6. ルートデータの型安全性欠如

```typescript
// ❌ 間違い: any型でデータアクセス
const roles = route.data['roles'] as any;

// ✅ 正しい: 型定義を使用
interface RouteData {
  roles?: string[];
  permissions?: string[];
  requiresAuth?: boolean;
}

const roles = (route.data as RouteData).roles;
```

### 7. エラーメッセージの不足

```typescript
// ❌ 間違い: エラー情報なし
return router.createUrlTree(['/forbidden']);

// ✅ 正しい: 詳細なエラー情報を提供
return router.createUrlTree(['/forbidden'], {
  state: {
    message: '管理者権限が必要です',
    requiredRole: 'admin',
    currentRole: userRole
  }
});
```

### 8. ガードの順序ミス

```typescript
// ❌ 間違い: 重い処理を最初に実行
canActivate: [
  expensiveApiCallGuard,  // 重い
  isAuthenticatedGuard    // 軽い
]

// ✅ 正しい: 軽い処理から実行
canActivate: [
  isAuthenticatedGuard,   // 軽い
  expensiveApiCallGuard   // 重い
]
```

### 9. グローバル状態への依存

```typescript
// ❌ 間違い: グローバル変数に依存
let currentUser: User | null = null;

export const globalGuard: CanActivateFn = () => {
  return currentUser !== null;
};

// ✅ 正しい: サービスを使用
export const serviceGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

### 10. 過度に複雑なガード

```typescript
// ❌ 間違い: 一つのガードで全てをチェック
export const monolithicGuard: CanActivateFn = (route, state) => {
  // 100行以上の複雑なロジック
};

// ✅ 正しい: 小さなガードを組み合わせる
export const composedGuard = composeGuards(
  simpleGuard1,
  simpleGuard2,
  simpleGuard3
);
```

## 演習問題

### 初級

#### 演習1: 基本的なガード合成

以下の3つのガードを作成し、それらを組み合わせた複合ガードを実装してください：

1. ログインチェックガード
2. メール認証チェックガード
3. プロフィール完成チェックガード

<details>
<summary>ヒント</summary>

- composeGuards関数を作成
- 各ガードは独立して機能する
- リダイレクト先を適切に設定

</details>

#### 演習2: ルートデータベースのガード

ルートデータから必要な権限を読み取り、動的にチェックするガードを作成してください。

要件:
- `route.data['permissions']` から権限リストを取得
- `route.data['requireAll']` でAND/OR条件を切り替え

<details>
<summary>解答例のポイント</summary>

```typescript
export const dynamicPermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const permissions = route.data['permissions'] as string[];
  const requireAll = route.data['requireAll'] ?? false;

  const hasPermission = requireAll
    ? authService.hasAllPermissions(permissions)
    : authService.hasAnyPermission(permissions);

  return hasPermission || router.createUrlTree(['/forbidden']);
};
```

</details>

### 中級

#### 演習3: 時間ベースのアクセス制御

営業時間とメンテナンス時間を考慮したアクセス制御システムを実装してください。

要件:
1. 営業時間内のみアクセス可能なページ
2. 週末のみアクセス可能なページ
3. メンテナンス中は管理者のみアクセス可能

<details>
<summary>解答の骨格</summary>

```typescript
// business-hours.guard.ts
export const businessHoursGuard: CanActivateFn = (route, state) => {
  const businessHours = inject(BusinessHoursService);

  if (businessHours.isOpen()) {
    return true;
  }

  const nextOpen = businessHours.getNextOpenTime();
  return router.createUrlTree(['/closed'], {
    state: { nextOpen }
  });
};

// maintenance.guard.ts
export const maintenanceGuard: CanActivateFn = (route, state) => {
  const maintenance = inject(MaintenanceService);
  const auth = inject(AuthService);

  if (!maintenance.isActive()) {
    return true;
  }

  if (auth.hasRole('admin')) {
    return true; // 管理者は常にアクセス可能
  }

  return router.createUrlTree(['/maintenance']);
};
```

</details>

#### 演習4: リソースベースの権限制御

特定のリソースに対する権限をチェックするガードシステムを実装してください。

要件:
1. リソースIDをルートパラメータから取得
2. APIでリソースのアクセス権限を確認
3. オーナー、共有ユーザー、管理者のアクセスレベルを区別
4. エラーハンドリング

<details>
<summary>解答の骨格</summary>

```typescript
export const resourceAccessGuard: CanActivateFn = (route, state) => {
  const resourceService = inject(ResourceService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const resourceId = route.paramMap.get('id');
  const user = authService.currentUser();

  if (!resourceId || !user) {
    return router.createUrlTree(['/not-found']);
  }

  return resourceService.checkAccess(resourceId, user.id).pipe(
    map(access => {
      if (access.canRead) {
        return true;
      }
      return router.createUrlTree(['/forbidden'], {
        state: { reason: access.reason }
      });
    }),
    catchError(() => {
      return of(router.createUrlTree(['/error']));
    })
  );
};
```

</details>

### 上級

#### 演習5: 多段階認証フロー

段階的なセキュリティレベルを持つ認証システムを実装してください。

要件:
1. レベル1: 基本認証（ユーザー名/パスワード）
2. レベル2: 2要素認証（OTP）
3. レベル3: 生体認証
4. セッションタイムアウト管理
5. 各レベルに応じたページアクセス制御

<details>
<summary>解答例のアーキテクチャ</summary>

```typescript
// 認証レベルの定義
type AuthLevel = 1 | 2 | 3;

// レベル別ガード
export const requireLevel = (level: AuthLevel): CanActivateFn => {
  return (route, state) => {
    const mfa = inject(MFAService);

    if (mfa.getCurrentLevel() >= level) {
      // セッションタイムアウトチェック
      if (!mfa.isSessionValid(level)) {
        return router.createUrlTree([`/auth/level-${level}`], {
          queryParams: { returnUrl: state.url }
        });
      }
      return true;
    }

    return router.createUrlTree([`/auth/level-${level}`]);
  };
};

// ルート設定
const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [requireLevel(1)]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [requireLevel(2)]
  },
  {
    path: 'financial',
    component: FinancialComponent,
    canActivate: [requireLevel(3)]
  }
];
```

</details>

#### 演習6: A/Bテストとガード

A/Bテストのバリアントに基づいてルーティングを制御するシステムを実装してください。

要件:
1. ユーザーをランダムにグループA/Bに分類
2. グループごとに異なるコンポーネントを表示
3. ユーザーの選択を永続化
4. 管理者は強制的にバリアントを選択可能
5. アナリティクス統合

<details>
<summary>解答例の骨格</summary>

```typescript
@Injectable({ providedIn: 'root' })
export class ABTestService {
  private variantSignal = signal<'A' | 'B' | null>(null);

  getVariant(testName: string): 'A' | 'B' {
    const stored = localStorage.getItem(`ab-test-${testName}`);
    if (stored) {
      return stored as 'A' | 'B';
    }

    const variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(`ab-test-${testName}`, variant);
    this.trackVariant(testName, variant);
    return variant;
  }

  private trackVariant(testName: string, variant: 'A' | 'B'): void {
    // アナリティクスに送信
  }
}

export const abTestGuard = (testName: string): CanActivateFn => {
  return (route, state) => {
    const abTest = inject(ABTestService);
    const router = inject(Router);

    const variant = abTest.getVariant(testName);

    // バリアントに応じてルートを変更
    if (variant === 'B') {
      return router.createUrlTree([`${route.url}-v2`]);
    }

    return true;
  };
};
```

</details>

## 次のステップへのリンク

複雑なガードの組み合わせをマスターしたら、次のトピックに進みましょう：

- [testing](../testing/README.md) - ガードの包括的なテスト手法
- [dynamic-routes](../dynamic-routes/README.md) - 動的ルートとガードの統合
- [state-management](../state-management/README.md) - 状態管理との組み合わせ
- [error-handling](../error-handling/README.md) - ガードエラーの高度な処理
- [performance](../performance/README.md) - ガードのパフォーマンス最適化

## まとめ

このセクションでは、Angular 18の関数型guardsを活用した複雑なガードシステムの構築方法を学びました：

1. **ガードの合成**: 小さなガードを組み合わせた再利用可能なパターン
2. **データ依存ガード**: APIやリソースベースの動的な権限チェック
3. **時間ベースガード**: 営業時間やメンテナンス時間を考慮したアクセス制御
4. **多段階認証**: セキュリティレベルに応じた段階的な認証フロー
5. **条件付きガード**: ルートデータや機能フラグに基づく柔軟な制御

複雑なガードの組み合わせは、エンタープライズアプリケーションのセキュリティと柔軟性を高める重要な技術です。このセクションで学んだパターンを活用して、堅牢で保守性の高いAngularアプリケーションを構築してください。
