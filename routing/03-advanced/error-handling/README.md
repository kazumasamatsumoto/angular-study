# Error Handling (エラーハンドリング)

## 概要

Error Handlingは、ルーティングとナビゲーションの過程で発生する様々なエラーを適切に処理し、ユーザーに分かりやすいフィードバックを提供する機能です。404エラー、認証エラー、ネットワークエラーなどを適切にハンドリングすることで、優れたユーザーエクスペリエンスを実現できます。

包括的なエラーハンドリング戦略により、ユーザーは問題が発生しても適切なガイダンスを受け、アプリケーションの信頼性が向上します。

## 学習内容

- 404ページとワイルドカードルートの実装
- エラーロギングとモニタリング
- ナビゲーションエラーのハンドリング
- リトライとフォールバック戦略
- グローバルエラーハンドラーの実装

## 詳細な説明

### エラーハンドリングの重要性

Webアプリケーションでは様々な種類のエラーが発生します：

1. **ルーティングエラー**: 存在しないパス、ガード失敗
2. **データロードエラー**: APIエラー、ネットワーク障害
3. **認証/認可エラー**: 未認証、権限不足
4. **バリデーションエラー**: 不正な入力、制約違反
5. **システムエラー**: サーバーエラー、タイムアウト

### エラーの種類

1. **404 Not Found**: ページが存在しない
2. **403 Forbidden**: アクセス権限がない
3. **401 Unauthorized**: 認証が必要
4. **500 Server Error**: サーバー側のエラー
5. **Network Error**: ネットワーク接続の問題

### エラーハンドリング戦略

1. **予防的**: エラーを事前に防ぐ
2. **検出的**: エラーを早期に検出
3. **回復的**: エラーから回復する
4. **通知的**: ユーザーに適切に通知
5. **ログ記録**: エラーを記録して分析

## 実装例

### 例1: 404ページの実装

```typescript
// pages/not-found/not-found.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>

        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p class="error-message">
          The page you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>

        <div class="suggestions">
          <h3>Suggestions:</h3>
          <ul>
            <li>Check the URL for typos</li>
            <li>Go back to the previous page</li>
            <li>Visit our home page</li>
            <li>Use the search feature</li>
          </ul>
        </div>

        <div class="actions">
          <button (click)="goBack()" class="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Go Back
          </button>

          <a routerLink="/" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Go Home
          </a>
        </div>

        <div class="search-section">
          <p>Or search for what you need:</p>
          <div class="search-box">
            <input
              type="text"
              placeholder="Search..."
              (keyup.enter)="search($event)"
              #searchInput>
            <button (click)="search(searchInput)" class="search-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="popular-pages">
          <h3>Popular Pages:</h3>
          <div class="page-links">
            <a routerLink="/products">Products</a>
            <a routerLink="/about">About Us</a>
            <a routerLink="/contact">Contact</a>
            <a routerLink="/faq">FAQ</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .error-content {
      max-width: 600px;
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }

    .error-icon {
      margin: 0 auto 24px;
      width: 80px;
      height: 80px;
      color: #f44336;
    }

    .error-icon svg {
      width: 100%;
      height: 100%;
      stroke-width: 2;
    }

    h1 {
      font-size: 96px;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      font-size: 32px;
      font-weight: 600;
      margin: 16px 0;
      color: #333;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .suggestions {
      text-align: left;
      background: #f9f9f9;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 32px;
    }

    .suggestions h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #333;
    }

    .suggestions ul {
      margin: 0;
      padding-left: 24px;
      color: #666;
    }

    .suggestions li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 32px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    .search-section {
      margin-bottom: 32px;
    }

    .search-section p {
      margin-bottom: 12px;
      color: #666;
    }

    .search-box {
      display: flex;
      gap: 8px;
    }

    .search-box input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-btn {
      padding: 12px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .search-btn:hover {
      background: #5568d3;
    }

    .search-btn svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }

    .popular-pages {
      text-align: left;
    }

    .popular-pages h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #333;
    }

    .page-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .page-links a {
      padding: 8px 16px;
      background: #f0f0f0;
      color: #667eea;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .page-links a:hover {
      background: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .error-content {
        padding: 32px 24px;
      }

      h1 {
        font-size: 72px;
      }

      h2 {
        font-size: 24px;
      }

      .actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NotFoundComponent {
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    this.location.back();
  }

  search(input: HTMLInputElement | Event): void {
    const query = input instanceof HTMLInputElement
      ? input.value
      : (input.target as HTMLInputElement).value;

    if (query.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: query.trim() }
      });
    }
  }
}
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  // ... other routes

  // ワイルドカードルート（最後に配置）
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Page Not Found' }
  }
];
```

### 例2: グローバルエラーハンドラー

```typescript
// services/global-error-handler.service.ts
import { ErrorHandler, Injectable, inject, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorLoggingService } from './error-logging.service';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);

  handleError(error: Error | HttpErrorResponse): void {
    const errorLoggingService = this.injector.get(ErrorLoggingService);
    const notificationService = this.injector.get(NotificationService);
    const router = this.injector.get(Router);

    let errorMessage: string;
    let shouldNotifyUser = true;

    if (error instanceof HttpErrorResponse) {
      // サーバーエラー
      errorMessage = this.getServerErrorMessage(error);
      this.handleHttpError(error, router);
    } else {
      // クライアントエラー
      errorMessage = this.getClientErrorMessage(error);
    }

    // エラーをログに記録
    errorLoggingService.logError({
      message: errorMessage,
      stack: error.stack,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // ユーザーに通知
    if (shouldNotifyUser) {
      notificationService.showError(errorMessage);
    }

    // コンソールにも出力（開発環境）
    console.error('Error handled by GlobalErrorHandler:', error);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network.';
    }

    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `Server error: ${error.message}`;
    }
  }

  private getClientErrorMessage(error: Error): string {
    return error.message || 'An unexpected error occurred.';
  }

  private handleHttpError(error: HttpErrorResponse, router: Router): void {
    switch (error.status) {
      case 401:
        // 未認証の場合はログインページへ
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }
        });
        break;

      case 403:
        // アクセス拒否の場合は403ページへ
        router.navigate(['/forbidden']);
        break;

      case 404:
        // リソースが見つからない場合は404ページへ
        router.navigate(['/not-found']);
        break;

      case 500:
      case 503:
        // サーバーエラーの場合はエラーページへ
        router.navigate(['/error'], {
          state: { error }
        });
        break;
    }
  }
}
```

```typescript
// app.config.ts
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
};
```

### 例3: エラーロギングサービス

```typescript
// services/error-logging.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  userId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private errorQueue: ErrorLog[] = [];
  private readonly MAX_QUEUE_SIZE = 50;
  private readonly BATCH_SEND_INTERVAL = 30000; // 30秒
  private loggingEndpoint = '/api/logs/errors';

  constructor(private http: HttpClient) {
    this.startBatchSending();
  }

  /**
   * エラーをログに記録
   */
  logError(error: ErrorLog): void {
    // エラーレベルを判定
    error.severity = this.determineSeverity(error);

    // キューに追加
    this.errorQueue.push(error);

    // クリティカルエラーは即座に送信
    if (error.severity === 'critical') {
      this.sendErrorLog(error).subscribe();
    }

    // キューがいっぱいになったら送信
    if (this.errorQueue.length >= this.MAX_QUEUE_SIZE) {
      this.sendBatchLogs();
    }

    // ローカルストレージにも保存（オフライン対応）
    this.saveToLocalStorage(error);
  }

  /**
   * バッチでログを送信
   */
  private sendBatchLogs(): void {
    if (this.errorQueue.length === 0) return;

    const logs = [...this.errorQueue];
    this.errorQueue = [];

    this.http.post(this.loggingEndpoint, { logs })
      .pipe(
        retry(3),
        catchError(error => {
          // 送信失敗時はキューに戻す
          this.errorQueue.unshift(...logs);
          console.error('Failed to send error logs:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * 単一のエラーログを送信
   */
  private sendErrorLog(error: ErrorLog): Observable<any> {
    return this.http.post(this.loggingEndpoint, error)
      .pipe(
        retry(2),
        catchError(err => {
          console.error('Failed to send error log:', err);
          return of(null);
        })
      );
  }

  /**
   * エラーの重要度を判定
   */
  private determineSeverity(error: ErrorLog): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message.toLowerCase();

    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }

    if (message.includes('error') || message.includes('failed')) {
      return 'high';
    }

    if (message.includes('warning') || message.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * ローカルストレージに保存
   */
  private saveToLocalStorage(error: ErrorLog): void {
    try {
      const stored = localStorage.getItem('error_logs');
      const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];

      logs.push(error);

      // 最新100件のみ保持
      if (logs.length > 100) {
        logs.shift();
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save error to localStorage:', e);
    }
  }

  /**
   * 定期的にバッチ送信
   */
  private startBatchSending(): void {
    setInterval(() => {
      this.sendBatchLogs();
    }, this.BATCH_SEND_INTERVAL);

    // ページ離脱時にも送信
    window.addEventListener('beforeunload', () => {
      if (this.errorQueue.length > 0) {
        // sendBeaconを使用して確実に送信
        const data = JSON.stringify({ logs: this.errorQueue });
        navigator.sendBeacon(this.loggingEndpoint, data);
      }
    });
  }

  /**
   * ローカルストレージからログを取得
   */
  getStoredLogs(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('error_logs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to retrieve stored logs:', e);
      return [];
    }
  }

  /**
   * ローカルストレージのログをクリア
   */
  clearStoredLogs(): void {
    localStorage.removeItem('error_logs');
  }
}
```

### 例4: Resolverエラーハンドリング

```typescript
// resolvers/product.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../services/notification.service';

export const productResolver: ResolveFn<any> = (route, state) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const productId = route.paramMap.get('id');

  if (!productId) {
    router.navigate(['/products']);
    return of(null);
  }

  return productService.getProduct(productId).pipe(
    catchError(error => {
      console.error('Failed to load product:', error);

      // エラーの種類に応じて処理
      if (error.status === 404) {
        notificationService.showError('Product not found');
        router.navigate(['/products']);
      } else {
        notificationService.showError('Failed to load product');
        router.navigate(['/error'], {
          state: { error, returnUrl: state.url }
        });
      }

      return of(null);
    })
  );
};
```

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { productResolver } from './resolvers/product.resolver';

export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: {
      product: productResolver
    }
  }
];
```

### 例5: ナビゲーションエラーハンドリング

```typescript
// services/navigation-error.service.ts
import { Injectable, inject } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ErrorLoggingService } from './error-logging.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorService {
  private router = inject(Router);
  private errorLoggingService = inject(ErrorLoggingService);
  private notificationService = inject(NotificationService);

  init(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationError => event instanceof NavigationError)
      )
      .subscribe(event => {
        this.handleNavigationError(event);
      });
  }

  private handleNavigationError(event: NavigationError): void {
    const error = event.error;

    // エラーをログに記録
    this.errorLoggingService.logError({
      message: `Navigation error: ${error.message}`,
      stack: error.stack,
      timestamp: new Date(),
      url: event.url,
      userAgent: navigator.userAgent,
      context: {
        targetUrl: event.url,
        navigationId: event.id
      }
    });

    // エラーの種類に応じて処理
    if (this.isChunkLoadError(error)) {
      this.handleChunkLoadError();
    } else if (this.isGuardError(error)) {
      this.handleGuardError(error);
    } else {
      this.handleGeneralNavigationError(error);
    }
  }

  /**
   * チャンクロードエラーの判定
   */
  private isChunkLoadError(error: Error): boolean {
    return error.message.includes('ChunkLoadError') ||
           error.message.includes('Loading chunk');
  }

  /**
   * ガードエラーの判定
   */
  private isGuardError(error: Error): boolean {
    return error.message.includes('Guard') ||
           error.message.includes('canActivate') ||
           error.message.includes('canLoad');
  }

  /**
   * チャンクロードエラーのハンドリング
   */
  private handleChunkLoadError(): void {
    this.notificationService.showError(
      'Failed to load page content. Reloading...',
      { duration: 3000 }
    );

    // 少し待ってからリロード
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  /**
   * ガードエラーのハンドリング
   */
  private handleGuardError(error: Error): void {
    console.error('Guard error:', error);

    // 認証が必要な場合
    if (error.message.includes('Authentication required')) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // 権限がない場合
    if (error.message.includes('Permission denied')) {
      this.router.navigate(['/forbidden']);
      return;
    }

    // その他のガードエラー
    this.notificationService.showError('Access denied');
    this.router.navigate(['/']);
  }

  /**
   * 一般的なナビゲーションエラーのハンドリング
   */
  private handleGeneralNavigationError(error: Error): void {
    console.error('Navigation error:', error);

    this.notificationService.showError(
      'Navigation failed. Please try again.'
    );

    // ホームページに戻る
    this.router.navigate(['/']);
  }
}
```

```typescript
// app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationErrorService } from './services/navigation-error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  private navigationErrorService = inject(NavigationErrorService);

  ngOnInit(): void {
    this.navigationErrorService.init();
  }
}
```

### 例6: リトライ機構

```typescript
// services/retry.service.ts
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, tap } from 'rxjs/operators';

export interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: any) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RetryService {
  /**
   * エクスポネンシャルバックオフでリトライ
   */
  retryWithBackoff<T>(config: RetryConfig = {}) {
    const {
      maxAttempts = 3,
      delayMs = 1000,
      backoffMultiplier = 2,
      maxDelayMs = 30000,
      shouldRetry = () => true
    } = config;

    return (source: Observable<T>) =>
      source.pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, index) => {
              const attempt = index + 1;

              // 最大試行回数を超えた場合
              if (attempt > maxAttempts) {
                return throwError(() => error);
              }

              // リトライすべきでないエラー
              if (!shouldRetry(error)) {
                return throwError(() => error);
              }

              // 遅延時間を計算（エクスポネンシャルバックオフ）
              const delay = Math.min(
                delayMs * Math.pow(backoffMultiplier, attempt - 1),
                maxDelayMs
              );

              console.log(
                `Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`,
                error
              );

              return timer(delay);
            })
          )
        )
      );
  }

  /**
   * 条件付きリトライ
   */
  retryIf<T>(
    shouldRetry: (error: any) => boolean,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ) {
    return this.retryWithBackoff<T>({
      maxAttempts,
      delayMs,
      shouldRetry
    });
  }

  /**
   * ネットワークエラーのみリトライ
   */
  retryOnNetworkError<T>(maxAttempts: number = 3) {
    return this.retryWithBackoff<T>({
      maxAttempts,
      shouldRetry: (error) => {
        // ネットワークエラーまたは5xxエラーのみリトライ
        return !navigator.onLine ||
               (error.status >= 500 && error.status < 600);
      }
    });
  }
}
```

```typescript
// services/data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetryService } from './retry.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private retryService = inject(RetryService);

  getData(): Observable<any> {
    return this.http.get('/api/data').pipe(
      this.retryService.retryWithBackoff({
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
        shouldRetry: (error) => {
          // 4xxエラーはリトライしない
          return error.status !== 404 && error.status !== 400;
        }
      })
    );
  }
}
```

### 例7: オフライン対応

```typescript
// services/offline.service.ts
import { Injectable, signal } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    this.initOnlineStatusTracking();
  }

  /**
   * オンライン状態のSignal
   */
  get online() {
    return this.isOnline.asReadonly();
  }

  /**
   * オンライン状態の追跡を開始
   */
  private initOnlineStatusTracking(): void {
    if (typeof window === 'undefined') return;

    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(online => {
      this.isOnline.set(online);

      if (online) {
        this.onOnline();
      } else {
        this.onOffline();
      }
    });
  }

  /**
   * オンラインになった時の処理
   */
  private onOnline(): void {
    console.log('Application is online');

    // 保留中のリクエストを再送信
    this.retryContinued();

    // ユーザーに通知
    this.showNotification('You are back online');
  }

  /**
   * オフラインになった時の処理
   */
  private onOffline(): void {
    console.log('Application is offline');

    // ユーザーに通知
    this.showNotification('You are offline. Some features may be limited.');
  }

  /**
   * 保留中のリクエストを再送信
   */
  private retryContinued(): void {
    // 実装...
  }

  /**
   * 通知を表示
   */
  private showNotification(message: string): void {
    // 実装...
  }

  /**
   * ネットワーク接続をチェック
   */
  async checkConnection(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    }

    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

## ベストプラクティス

### 1. ワイルドカードルートは最後に配置

404ページは必ず最後のルートとして定義します。

```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  // ... other routes
  { path: '**', component: NotFoundComponent }  // 最後
];
```

### 2. ユーザーフレンドリーなエラーメッセージ

技術的な詳細ではなく、ユーザーが理解できるメッセージを表示します。

```typescript
// 悪い例
"Error: ChunkLoadError: Loading chunk 3 failed"

// 良い例
"Failed to load page content. Please try again."
```

### 3. エラーロギングの実装

すべてのエラーを記録して分析できるようにします。

```typescript
handleError(error: Error): void {
  this.errorLoggingService.logError({
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    url: window.location.href
  });
}
```

### 4. リトライ戦略の実装

一時的なエラーは自動的にリトライします。

```typescript
this.http.get('/api/data').pipe(
  retryWithBackoff({ maxAttempts: 3, delayMs: 1000 })
)
```

### 5. グローバルエラーハンドラーの使用

ErrorHandlerを実装してすべてのエラーを一元管理します。

```typescript
{
  provide: ErrorHandler,
  useClass: GlobalErrorHandler
}
```

### 6. エラーの種類別処理

エラーの種類に応じて適切な処理を行います。

```typescript
if (error.status === 401) {
  // 未認証 -> ログインページへ
} else if (error.status === 403) {
  // 権限なし -> 403ページへ
} else if (error.status === 404) {
  // 見つからない -> 404ページへ
}
```

### 7. オフライン対応

ネットワーク接続をモニタリングします。

```typescript
if (!navigator.onLine) {
  this.showOfflineMessage();
  return;
}
```

### 8. ユーザーへのフィードバック

エラー発生時は適切にユーザーに通知します。

```typescript
this.notificationService.showError(
  'Failed to save changes',
  { duration: 5000, action: 'Retry' }
);
```

### 9. ナビゲーションエラーの監視

Router.eventsを監視してナビゲーションエラーを捕捉します。

```typescript
this.router.events
  .pipe(filter(e => e instanceof NavigationError))
  .subscribe(handleError);
```

### 10. セキュアなエラー情報

本番環境では機密情報を含むエラーを表示しません。

```typescript
if (isProduction()) {
  return 'An error occurred';
} else {
  return error.stack;  // 開発環境のみ
}
```

## よくある間違い

### 1. ワイルドカードルートの配置ミス

404ルートを最初に配置してしまう。

```typescript
// 悪い例
export const routes: Routes = [
  { path: '**', component: NotFoundComponent },  // 先頭
  { path: '', component: HomeComponent }  // 到達不可能
];

// 良い例
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }  // 最後
];
```

### 2. エラーの握りつぶし

エラーをキャッチしても何もしない。

```typescript
// 悪い例
.pipe(
  catchError(() => of(null))  // エラーを無視
)

// 良い例
.pipe(
  catchError(error => {
    this.errorLoggingService.logError(error);
    this.notificationService.showError('Operation failed');
    return of(null);
  })
)
```

### 3. 技術的すぎるエラーメッセージ

ユーザーに技術的な詳細を表示してしまう。

```typescript
// 悪い例
"TypeError: Cannot read property 'name' of undefined"

// 良い例
"Failed to load user information. Please try again."
```

### 4. エラーログの未実装

エラーが記録されず、問題の診断ができない。

```typescript
// 悪い例
console.error(error);  // コンソールのみ

// 良い例
this.errorLoggingService.logError(error);  // サーバーに送信
```

### 5. リトライの無制限実行

失敗し続けるリクエストを永遠にリトライしてしまう。

```typescript
// 悪い例
.pipe(retry())  // 無限リトライ

// 良い例
.pipe(retry(3))  // 最大3回
```

### 6. グローバルエラーハンドラーの未使用

個別のエラーハンドリングのみで一貫性がない。

```typescript
// 良い例
{
  provide: ErrorHandler,
  useClass: GlobalErrorHandler
}
```

### 7. ナビゲーションエラーの無視

ナビゲーション失敗を検出していない。

```typescript
// 良い例
this.router.events
  .pipe(filter(e => e instanceof NavigationError))
  .subscribe(e => this.handleNavigationError(e));
```

### 8. オフライン状態の未考慮

ネットワーク接続をチェックしていない。

```typescript
// 良い例
if (!navigator.onLine) {
  this.showOfflineMessage();
  return;
}
```

### 9. HTTPエラーの誤った処理

すべてのHTTPエラーを同じように処理してしまう。

```typescript
// 悪い例
catchError(() => this.showGenericError())

// 良い例
catchError(error => {
  if (error.status === 401) {
    this.redirectToLogin();
  } else if (error.status === 404) {
    this.show404();
  } else {
    this.showGenericError();
  }
  return throwError(() => error);
})
```

### 10. エラー状態のUI未提供

エラー発生時の適切なUIがない。

```typescript
// 良い例：エラー状態のテンプレート
<div *ngIf="error" class="error-message">
  <p>{{ error.message }}</p>
  <button (click)="retry()">Retry</button>
</div>
```

## 演習問題

### 初級

#### 演習1: 基本的な404ページ

タスク：
1. 404ページコンポーネントを作成
2. ワイルドカードルートを設定
3. ホームに戻るボタンを実装
4. 前のページに戻るボタンを実装

期待される動作：
- 存在しないURLで404ページが表示される
- ボタンでナビゲーションできる
- デザインがユーザーフレンドリー

#### 演習2: エラー通知サービス

タスク：
1. 通知サービスを作成
2. 成功、エラー、警告の3種類の通知を実装
3. 自動的に消える通知を実装
4. 通知をスタック表示

期待される動作：
- エラー発生時に通知が表示される
- 一定時間後に自動的に消える
- 複数の通知を同時に表示できる

### 中級

#### 演習1: グローバルエラーハンドラー

タスク：
1. ErrorHandlerを実装
2. HTTPエラーとクライアントエラーを区別
3. エラーをローカルストレージにログ
4. エラーの種類に応じてルーティング

期待される動作：
- すべてのエラーが捕捉される
- エラーがログに記録される
- 適切なエラーページが表示される

#### 演習2: リトライ機構

タスク：
1. エクスポネンシャルバックオフを実装
2. リトライ可能なエラーを判定
3. 最大試行回数を設定
4. リトライ状況をUIに表示

期待される動作：
- 一時的なエラーは自動的にリトライされる
- リトライ回数と残り時間が表示される
- 最大試行回数後はエラーメッセージを表示

### 上級

#### 演習1: 包括的なエラーハンドリングシステム

タスク：
1. グローバルエラーハンドラーを実装
2. エラーロギングサービスを作成
3. エラーをバッチでサーバーに送信
4. オフライン時はローカルに保存
5. オンライン復帰時に送信

期待される動作：
- すべてのエラーが記録される
- エラーは定期的にサーバーに送信される
- オフライン時もエラーが失われない
- ユーザーに適切なフィードバックがある

実装のヒント：
```typescript
interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

#### 演習2: 自己修復機能

タスク：
1. チャンクロードエラーを検出
2. 自動的にページをリロード
3. 連続エラーを検出して無限ループを防止
4. エラー回復の進捗を表示
5. ユーザーに状況を通知

期待される動作：
- チャンクロードエラー時に自動リロード
- 連続エラー時は手動リロードを促す
- 回復プロセスが視覚的に表示される
- ユーザーが状況を理解できる

実装のヒント：
```typescript
class SelfHealingService {
  private errorCount = 0;
  private readonly MAX_AUTO_RETRIES = 3;

  handleChunkLoadError(): void {
    this.errorCount++;

    if (this.errorCount < this.MAX_AUTO_RETRIES) {
      this.autoReload();
    } else {
      this.promptManualReload();
    }
  }
}
```

## 次のステップへのリンク

Error Handlingの基礎を学んだら、次のトピックに進みましょう：

- [Performance](../performance/README.md) - パフォーマンス最適化
- [State Management](../state-management/README.md) - 状態管理との統合
- [Route Reuse](../route-reuse/README.md) - ルート再利用戦略
- [Deep Linking](../deep-linking/README.md) - 深いリンクとフラグメント

## 参考リンク

- [Angular Error Handler](https://angular.dev/api/core/ErrorHandler)
- [Angular HTTP Error Handling](https://angular.dev/guide/http/making-requests#handling-errors)
- [RxJS Error Handling](https://rxjs.dev/guide/error-handling)
- [Web API - Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

## まとめ

Error Handlingは、堅牢なAngularアプリケーションを構築する上で不可欠な要素です。適切なエラーハンドリングにより、以下のメリットが得られます：

- ユーザーエクスペリエンスの向上
- アプリケーションの信頼性向上
- 問題の早期発見と修正
- デバッグの効率化
- ユーザーサポートの向上

グローバルエラーハンドラー、エラーロギング、リトライ機構、オフライン対応を適切に実装して、エラーにも優雅に対処できるアプリケーションを構築しましょう。
