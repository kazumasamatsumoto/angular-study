import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // 遅延ローディング: 管理画面モジュール
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

  // 遅延ローディング: ユーザーモジュール
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  },

  // 遅延ローディング: ダッシュボードモジュール
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
