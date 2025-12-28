import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export interface DashboardData {
  users: any[];
  stats: any;
  loading: boolean;
  error?: string;
}

/**
 * ダッシュボードデータResolver
 * 複数のAPIリクエストを並行実行し、
 * すべてのデータが揃ってからページを表示する
 */
export const dashboardDataResolver: ResolveFn<DashboardData> = () => {
  const userService = inject(UserService);

  console.log('[dashboardDataResolver] ダッシュボードデータを解決中...');

  // 複数のリクエストを並行実行
  return forkJoin({
    users: userService.getUsers(),
    stats: userService.getUserStats()
  }).pipe(
    map(result => ({
      users: result.users,
      stats: result.stats,
      loading: false
    })),
    catchError((error) => {
      console.error('[dashboardDataResolver] エラー:', error);
      return of({
        users: [],
        stats: { total: 0, active: 0, premium: 0 },
        loading: false,
        error: 'データの取得に失敗しました'
      });
    })
  );
};
