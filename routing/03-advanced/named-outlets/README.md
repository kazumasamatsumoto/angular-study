# 名前付きアウトレットとセカンダリルート（Named Outlets and Secondary Routes）

複数の`router-outlet`を使用して、同時に複数のビューを表示する方法を学びます。

## 学習内容

1. **名前付きアウトレットの基礎**
   - プライマリとセカンダリアウトレット
   - 複数アウトレットの定義
   - 名前付きアウトレットへのナビゲーション

2. **実用的なユースケース**
   - サイドパネル/サイドバー
   - モーダルダイアログ
   - マルチペインレイアウト
   - ポップアップとオーバーレイ

3. **高度な実装パターン**
   - 複数のセカンダリルート
   - 独立したナビゲーション履歴
   - アウトレット間の通信

## 名前付きアウトレットとは？

通常のルーティングでは1つの`<router-outlet>`（プライマリアウトレット）しか使用しませんが、名前付きアウトレットを使用すると、複数の独立したビューを同時に表示できます。

### 単一アウトレット vs 複数アウトレット

**単一アウトレット:**
```html
<router-outlet></router-outlet>
<!-- 1つのコンポーネントのみ表示 -->
```

**複数アウトレット:**
```html
<router-outlet></router-outlet> <!-- プライマリ -->
<router-outlet name="sidebar"></router-outlet> <!-- サイドバー -->
<router-outlet name="modal"></router-outlet> <!-- モーダル -->
```

## 実装例

### 1. 基本的な名前付きアウトレット

**app.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout">
      <main class="main-content">
        <!-- プライマリアウトレット -->
        <router-outlet></router-outlet>
      </main>

      <aside class="sidebar">
        <!-- 名前付きアウトレット: sidebar -->
        <router-outlet name="sidebar"></router-outlet>
      </aside>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      gap: 2rem;
    }
    .main-content {
      flex: 1;
    }
    .sidebar {
      width: 300px;
    }
  `]
})
export class AppComponent {}
```

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  // プライマリルート
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },

  // セカンダリルート（sidebar アウトレット）
  { path: 'menu', component: MenuComponent, outlet: 'sidebar' },
  { path: 'filters', component: FiltersComponent, outlet: 'sidebar' }
];
```

**ナビゲーション**
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showMenu()">メニューを表示</button>
    <button (click)="showFilters()">フィルターを表示</button>
    <button (click)="closeSidebar()">サイドバーを閉じる</button>
  `
})
export class ExampleComponent {
  constructor(private router: Router) {}

  showMenu() {
    // プライマリ: products, サイドバー: menu
    this.router.navigate([
      { outlets: { primary: 'products', sidebar: 'menu' } }
    ]);
  }

  showFilters() {
    // サイドバーのみ変更
    this.router.navigate([
      { outlets: { sidebar: 'filters' } }
    ]);
  }

  closeSidebar() {
    // サイドバーをクリア
    this.router.navigate([
      { outlets: { sidebar: null } }
    ]);
  }
}
```

### 2. モーダルダイアログの実装

**app.component.ts**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app">
      <router-outlet></router-outlet>

      <!-- モーダルアウトレット -->
      <router-outlet name="modal"></router-outlet>
    </div>
  `
})
export class AppComponent {}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },

  // モーダルルート
  {
    path: 'login',
    component: LoginModalComponent,
    outlet: 'modal'
  },
  {
    path: 'settings',
    component: SettingsModalComponent,
    outlet: 'modal'
  }
];
```

**login-modal.component.ts**
```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>ログイン</h2>
        <form>
          <input type="email" placeholder="メールアドレス">
          <input type="password" placeholder="パスワード">
          <button type="submit">ログイン</button>
          <button type="button" (click)="close()">キャンセル</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      min-width: 400px;
    }
  `]
})
export class LoginModalComponent {
  constructor(private router: Router) {}

  close() {
    // モーダルを閉じる
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
```

**モーダルを開く**
```typescript
// ログインモーダルを開く
this.router.navigate([{ outlets: { modal: 'login' } }]);

// モーダルを閉じる
this.router.navigate([{ outlets: { modal: null } }]);
```

### 3. 複数のセカンダリアウトレット

**app.component.ts**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout">
      <aside class="left-sidebar">
        <router-outlet name="sidebar"></router-outlet>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <aside class="right-panel">
        <router-outlet name="panel"></router-outlet>
      </aside>

      <router-outlet name="modal"></router-outlet>
    </div>
  `,
  styles: [`
    .layout {
      display: grid;
      grid-template-columns: 250px 1fr 300px;
      gap: 1rem;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
```

**app.routes.ts**
```typescript
export const routes: Routes = [
  // プライマリルート
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },

  // サイドバー
  { path: 'menu', component: MenuComponent, outlet: 'sidebar' },
  { path: 'navigation', component: NavigationComponent, outlet: 'sidebar' },

  // 右パネル
  { path: 'cart', component: CartComponent, outlet: 'panel' },
  { path: 'notifications', component: NotificationsComponent, outlet: 'panel' },

  // モーダル
  { path: 'login', component: LoginModalComponent, outlet: 'modal' },
  { path: 'confirm', component: ConfirmDialogComponent, outlet: 'modal' }
];
```

**複数アウトレットのナビゲーション**
```typescript
// すべてのアウトレットを一度に設定
this.router.navigate([{
  outlets: {
    primary: 'products',
    sidebar: 'menu',
    panel: 'cart',
    modal: 'login'
  }
}]);

// 一部のアウトレットのみ変更
this.router.navigate([{
  outlets: {
    panel: 'notifications'  // panelのみ変更
  }
}]);

// アウトレットをクリア
this.router.navigate([{
  outlets: {
    modal: null,
    panel: null
  }
}]);
```

### 4. パラメータ付きセカンダリルート

**app.routes.ts**
```typescript
export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    outlet: 'sidebar'
  },
  {
    path: 'comment/:commentId',
    component: CommentPanelComponent,
    outlet: 'panel'
  }
];
```

**ナビゲーション**
```typescript
// パラメータ付きでナビゲート
this.router.navigate([{
  outlets: {
    sidebar: ['user', userId],
    panel: ['comment', commentId]
  }
}]);
```

### 5. セカンダリルートの子ルート

**app.routes.ts**
```typescript
export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsLayoutComponent,
    outlet: 'sidebar',
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'privacy', component: PrivacySettingsComponent },
      { path: 'notifications', component: NotificationSettingsComponent }
    ]
  }
];
```

**settings-layout.component.ts**
```typescript
@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="settings">
      <nav>
        <a routerLink="general" routerLinkActive="active">一般</a>
        <a routerLink="privacy" routerLinkActive="active">プライバシー</a>
        <a routerLink="notifications" routerLinkActive="active">通知</a>
      </nav>

      <div class="settings-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class SettingsLayoutComponent {}
```

### 6. URL構造

名前付きアウトレットを使用すると、URLが特殊な形式になります：

```
/products(sidebar:menu)
  → プライマリ: /products
  → サイドバー: menu

/home(sidebar:menu//panel:cart)
  → プライマリ: /home
  → サイドバー: menu
  → パネル: cart

/products/123(modal:login)
  → プライマリ: /products/123
  → モーダル: login
```

### 7. RouterLinkでのナビゲーション

**テンプレート内での使用**
```html
<!-- 単一アウトレット -->
<a [routerLink]="[{ outlets: { sidebar: 'menu' } }]">
  メニューを開く
</a>

<!-- 複数アウトレット -->
<a [routerLink]="[{
  outlets: {
    primary: 'products',
    sidebar: 'filters'
  }
}]">
  商品とフィルター
</a>

<!-- アウトレットをクリア -->
<a [routerLink]="[{ outlets: { sidebar: null } }]">
  サイドバーを閉じる
</a>
```

### 8. アウトレット間の通信

**services/outlet-communication.service.ts**
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OutletCommunicationService {
  private messageSubject = new BehaviorSubject<any>(null);
  public message$: Observable<any> = this.messageSubject.asObservable();

  sendMessage(message: any): void {
    this.messageSubject.next(message);
  }

  clearMessage(): void {
    this.messageSubject.next(null);
  }
}
```

**サイドバーコンポーネントから送信**
```typescript
@Component({
  selector: 'app-sidebar',
  template: `
    <button (click)="sendData()">データを送信</button>
  `
})
export class SidebarComponent {
  constructor(private comm: OutletCommunicationService) {}

  sendData() {
    this.comm.sendMessage({ type: 'filter', value: 'electronics' });
  }
}
```

**メインコンポーネントで受信**
```typescript
@Component({
  selector: 'app-main',
  template: `
    <div>受信: {{ message | json }}</div>
  `
})
export class MainComponent implements OnInit {
  message: any;

  constructor(private comm: OutletCommunicationService) {}

  ngOnInit() {
    this.comm.message$.subscribe(msg => {
      this.message = msg;
    });
  }
}
```

## ベストプラクティス

### 1. アウトレットのクリーンアップ

```typescript
ngOnDestroy() {
  // コンポーネント破棄時にアウトレットをクリア
  this.router.navigate([{ outlets: { modal: null } }]);
}
```

### 2. モーダルのオーバーレイクリック

```html
<div class="modal-overlay" (click)="close()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    <!-- モーダル内容 -->
  </div>
</div>
```

### 3. ESCキーでモーダルを閉じる

```typescript
@HostListener('document:keydown.escape')
onEscPress() {
  this.close();
}
```

### 4. 現在のアウトレット状態を確認

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {
  this.route.url.subscribe(segments => {
    console.log('Current URL segments:', segments);
  });
}
```

## よくある間違い

❌ **アウトレット名の不一致**
```typescript
// ルート定義
{ path: 'menu', outlet: 'sidebar' }

// テンプレート
<router-outlet name="side"></router-outlet> // 名前が違う！
```

✅ **正しい名前の使用**
```typescript
{ path: 'menu', outlet: 'sidebar' }
<router-outlet name="sidebar"></router-outlet>
```

❌ **ナビゲーション後のクリーンアップ忘れ**
```typescript
// モーダルが開きっぱなし
this.router.navigate(['/other-page']);
```

✅ **適切なクリーンアップ**
```typescript
this.router.navigate([{ outlets: { modal: null } }])
  .then(() => this.router.navigate(['/other-page']));
```

## 実用例：Eコマースサイト

```typescript
// 商品一覧ページでカートとフィルターを表示
this.router.navigate([{
  outlets: {
    primary: 'products',
    sidebar: 'filters',
    panel: 'cart'
  }
}]);

// 商品詳細を見る（フィルターは残す）
this.router.navigate([{
  outlets: {
    primary: ['product', productId]
    // sidebarとpanelは変更しない
  }
}]);

// ログインモーダルを開く
this.router.navigate([{
  outlets: {
    modal: 'login'
  }
}]);
```

## 演習問題

### 初級
1. サイドバー用の名前付きアウトレットを作成し、メニューコンポーネントを表示してください
2. ボタンクリックでサイドバーを開閉する機能を実装してください

### 中級
3. モーダルダイアログを名前付きアウトレットで実装してください
4. 複数のアウトレット（サイドバー、パネル、モーダル）を同時に制御してください

### 上級
5. アウトレット間でデータを共有するサービスを実装してください
6. URLから現在のアウトレット状態を復元する機能を実装してください

## 次のステップ

次は [route-reuse](../route-reuse/README.md) で、ルート再利用戦略を学びます。
