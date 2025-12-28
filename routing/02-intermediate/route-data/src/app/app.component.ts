import { Component, OnInit, DestroyRef } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>Route Data - ルートメタデータの活用</h1>
        <p>ルート設定のdataプロパティを使った、パンくずリストやページタイトルの動的設定</p>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            ホーム
          </a>
          <a routerLink="/products" routerLinkActive="active">
            商品一覧
          </a>
          <a routerLink="/products/1" routerLinkActive="active">
            商品詳細
          </a>
          <a routerLink="/about" routerLinkActive="active">
            会社概要
          </a>
          <a routerLink="/contact" routerLinkActive="active">
            お問い合わせ
          </a>
        </nav>
      </header>

      <!-- パンくずリスト -->
      <app-breadcrumb />

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    // ルート変更時にページタイトルを更新
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.updateTitle();
      });
  }

  private updateTitle(): void {
    // 現在のルートのdataからtitleを取得
    let route = this.router.routerState.root;
    let title = 'Route Data Demo';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['title']) {
        title = route.snapshot.data['title'] + ' - Route Data Demo';
      }
    }

    this.titleService.setTitle(title);
  }
}
