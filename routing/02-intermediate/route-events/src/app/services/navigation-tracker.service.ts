import { Injectable, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface NavigationEvent {
  type: string;
  time: Date;
  url?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationTrackerService {
  isLoading = signal(false);
  progress = signal(0);
  events = signal<NavigationEvent[]>([]);
  stats = signal({
    totalNavigations: 0,
    successfulNavigations: 0,
    failedNavigations: 0,
    canceledNavigations: 0
  });

  constructor(private router: Router) {
    this.setupNavigationTracking();
  }

  private setupNavigationTracking(): void {
    // NavigationStart: ナビゲーション開始
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.isLoading.set(true);
        this.progress.set(10);
        this.addEvent({
          type: 'NavigationStart',
          time: new Date(),
          url: event.url
        });
      });

    // NavigationEnd: ナビゲーション成功
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoading.set(false);
        this.progress.set(100);
        this.addEvent({
          type: 'NavigationEnd',
          time: new Date(),
          url: event.urlAfterRedirects
        });

        // 統計を更新
        this.stats.update(stats => ({
          ...stats,
          totalNavigations: stats.totalNavigations + 1,
          successfulNavigations: stats.successfulNavigations + 1
        }));

        // プログレスバーをリセット
        setTimeout(() => this.progress.set(0), 500);
      });

    // NavigationCancel: ナビゲーションキャンセル
    this.router.events
      .pipe(filter(event => event instanceof NavigationCancel))
      .subscribe((event: any) => {
        this.isLoading.set(false);
        this.progress.set(0);
        this.addEvent({
          type: 'NavigationCancel',
          time: new Date(),
          url: event.url,
          message: event.reason
        });

        // 統計を更新
        this.stats.update(stats => ({
          ...stats,
          totalNavigations: stats.totalNavigations + 1,
          canceledNavigations: stats.canceledNavigations + 1
        }));
      });

    // NavigationError: ナビゲーションエラー
    this.router.events
      .pipe(filter(event => event instanceof NavigationError))
      .subscribe((event: any) => {
        this.isLoading.set(false);
        this.progress.set(0);
        this.addEvent({
          type: 'NavigationError',
          time: new Date(),
          url: event.url,
          message: event.error?.message || 'Unknown error'
        });

        // 統計を更新
        this.stats.update(stats => ({
          ...stats,
          totalNavigations: stats.totalNavigations + 1,
          failedNavigations: stats.failedNavigations + 1
        }));

        console.error('Navigation error:', event.error);
      });
  }

  private addEvent(event: NavigationEvent): void {
    this.events.update(events => {
      const newEvents = [event, ...events];
      // 最新100件のみ保持
      return newEvents.slice(0, 100);
    });
  }

  clearEvents(): void {
    this.events.set([]);
  }

  resetStats(): void {
    this.stats.set({
      totalNavigations: 0,
      successfulNavigations: 0,
      failedNavigations: 0,
      canceledNavigations: 0
    });
  }
}
