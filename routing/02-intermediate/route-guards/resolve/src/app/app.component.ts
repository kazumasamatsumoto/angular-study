import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <header class="header">
        <h1>Resolve Guard - データのプリロード</h1>
        <p>ルート遷移前にデータを取得して、コンポーネントに渡す</p>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            ホーム
          </a>
          <a routerLink="/users" routerLinkActive="active">
            ユーザー一覧
          </a>
          <a routerLink="/users/1" routerLinkActive="active">
            ユーザー詳細 #1
          </a>
          <a routerLink="/dashboard" routerLinkActive="active">
            ダッシュボード
          </a>
        </nav>
      </header>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
