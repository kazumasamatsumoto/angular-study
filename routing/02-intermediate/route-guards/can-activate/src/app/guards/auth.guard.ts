import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * 認証ガード
 * ユーザーがログインしているかをチェックし、
 * 未認証の場合はログインページにリダイレクトする
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // 未認証の場合、ログインページにリダイレクト
  // リダイレクト後にログイン元のURLに戻れるよう、returnUrlを保存
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
