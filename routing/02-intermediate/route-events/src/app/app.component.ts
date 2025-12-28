import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { EventLoggerComponent } from './components/event-logger/event-logger.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoadingIndicatorComponent,
    ProgressBarComponent,
    EventLoggerComponent
  ],
  template: `
    <!-- プログレスバー -->
    <app-progress-bar />

    <!-- ローディングオーバーレイ -->
    <app-loading-indicator />

    <div class="container">
      <header class="header">
        <h1>Route Events - ルーティングイベントの監視</h1>
        <p>ナビゲーションイベントを活用したローディング表示とエラーハンドリング</p>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            ホーム
          </a>
          <a routerLink="/page1" routerLinkActive="active">
            ページ1
          </a>
          <a routerLink="/page2" routerLinkActive="active">
            ページ2
          </a>
          <a routerLink="/slow-page" routerLinkActive="active">
            遅いページ
          </a>
        </nav>
      </header>

      <!-- イベントログ -->
      <app-event-logger />

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
