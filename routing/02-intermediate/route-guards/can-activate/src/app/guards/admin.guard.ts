import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * 管理者ガード
 * ユーザーが管理者権限を持っているかをチェックし、
 * 権限がない場合はダッシュボードにリダイレクトする
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // 管理者権限がない場合、ダッシュボードにリダイレクト
  alert('管理者権限が必要です');
  router.navigate(['/dashboard']);

  return false;
};
