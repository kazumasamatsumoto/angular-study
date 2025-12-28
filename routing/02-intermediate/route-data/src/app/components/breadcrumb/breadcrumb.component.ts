import { Component, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (breadcrumbs().length > 0) {
      <nav class="breadcrumb" aria-label="パンくずリスト">
        <ol class="breadcrumb-list">
          @for (breadcrumb of breadcrumbs(); track breadcrumb.url; let last = $last) {
            <li class="breadcrumb-item">
              @if (!last) {
                <a [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
                <span class="breadcrumb-separator">›</span>
              } @else {
                <span class="breadcrumb-current" aria-current="page">
                  {{ breadcrumb.label }}
                </span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    // 初期表示時のパンくずリストを構築
    this.buildBreadcrumbs();

    // ルート変更時にパンくずリストを更新
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    let currentRoute = this.activatedRoute.root;
    let url = '';

    // ルートツリーを辿ってパンくずリストを構築
    while (currentRoute) {
      if (currentRoute.snapshot.routeConfig?.path) {
        // パラメータを含むパスを解決
        const path = currentRoute.snapshot.url.map(segment => segment.path).join('/');
        if (path) {
          url += `/${path}`;

          // route dataからbreadcrumbラベルを取得
          const breadcrumbLabel = currentRoute.snapshot.data['breadcrumb'];
          if (breadcrumbLabel) {
            breadcrumbs.push({
              label: breadcrumbLabel,
              url: url
            });
          }
        }
      }

      currentRoute = currentRoute.firstChild!;
    }

    this.breadcrumbs.set(breadcrumbs);
  }
}
