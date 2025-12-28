import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  // pathMatch: 'full' を指定することで、完全一致の場合のみリダイレクト
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  // リダイレクトの例: 旧パスから新パスへ
  { path: 'old-path', redirectTo: '/home' },

  // ワイルドカードルート: すべての未定義ルートにマッチ (最後に配置)
  { path: '**', component: NotFoundComponent }
];
