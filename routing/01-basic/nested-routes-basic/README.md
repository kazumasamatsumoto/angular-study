# ネストされたルートの基礎（Basic Nested Routes）

このセクションでは、ネストされたルート（子ルート）の基本を学びます。

## ネストされたルートとは？

親コンポーネントの中に、さらに子コンポーネントをルーティングで表示する仕組みです。

```
/dashboard
  ├── /dashboard/profile
  ├── /dashboard/settings
  └── /dashboard/stats
```

## 実装例

### 1. ルート定義

**app.routes.ts**
```typescript
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'stats', component: StatsComponent }
    ]
  }
];
```

### 2. 親コンポーネント

**dashboard.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <h2>ダッシュボード</h2>
        <nav>
          <a routerLink="profile" routerLinkActive="active">プロフィール</a>
          <a routerLink="settings" routerLinkActive="active">設定</a>
          <a routerLink="stats" routerLinkActive="active">統計</a>
        </nav>
      </aside>

      <main class="content">
        <!-- 子ルートが表示される -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      min-height: 80vh;
    }

    .sidebar {
      width: 250px;
      background-color: #f5f5f5;
      padding: 1.5rem;
    }

    .sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .sidebar a {
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .sidebar a:hover {
      background-color: #e0e0e0;
    }

    .sidebar a.active {
      background-color: #1976d2;
      color: white;
    }

    .content {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class DashboardComponent {}
```

### 3. 子コンポーネント

**profile.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <h2>プロフィール</h2>
    <p>ユーザーのプロフィール情報を表示します。</p>
  `
})
export class ProfileComponent {}
```

## 重要なポイント

### 1. 相対パスと絶対パス

```html
<!-- 相対パス: 現在のルートからの相対 -->
<a routerLink="profile">プロフィール</a>
<!-- /dashboard/profile -->

<!-- 絶対パス: ルートから -->
<a routerLink="/dashboard/profile">プロフィール</a>
```

### 2. 子ルートのデフォルト

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    // /dashboard にアクセス時は /dashboard/profile にリダイレクト
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent }
  ]
}
```

### 3. 複数階層のネスト

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    {
      path: 'settings',
      component: SettingsComponent,
      children: [
        { path: 'account', component: AccountComponent },
        { path: 'privacy', component: PrivacyComponent }
      ]
    }
  ]
}
```

## よくある間違い

❌ **間違い**: 親コンポーネントに router-outlet がない
```typescript
// DashboardComponent に <router-outlet> がない
// → 子ルートが表示されない
```

✅ **正しい**: router-outlet を配置
```html
<div class="dashboard">
  <router-outlet></router-outlet>
</div>
```

## 演習問題

### 初級
1. 新しい子ルート「通知」を追加してください
   - パス: `/dashboard/notifications`

### 中級
2. 3階層のネストされたルートを実装してください
   - `/admin/users/list`
   - `/admin/users/create`

### 上級
3. タブナビゲーションを実装してください
   - タブの状態をルーティングで管理

## 実行方法

```bash
cd 01-basic/nested-routes-basic
npm install
npm start
# または
ng serve --port 4205
```

ブラウザで `http://localhost:4205` を開いてください。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/nested-routes-basic` に出力されます。

## 次のステップ

基礎編はこれで完了です！次は [02-intermediate](../../02-intermediate/README.md) で、より高度なルーティング機能を学びます。
