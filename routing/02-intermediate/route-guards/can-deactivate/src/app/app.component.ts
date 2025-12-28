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
        <h1>CanDeactivate Guard - 未保存データの保護</h1>
        <p>ページ遷移時に未保存の変更を検知して、確認ダイアログを表示</p>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            ホーム
          </a>
          <a routerLink="/edit/1" routerLinkActive="active">
            記事編集
          </a>
          <a routerLink="/profile/edit" routerLinkActive="active">
            プロフィール編集
          </a>
          <a routerLink="/settings" routerLinkActive="active">
            設定
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
