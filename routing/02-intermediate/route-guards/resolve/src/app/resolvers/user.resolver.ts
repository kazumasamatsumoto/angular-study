import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, of } from 'rxjs';
import { User, UserService } from '../services/user.service';

/**
 * ユーザー詳細Resolver
 * ルートパラメータからユーザーIDを取得し、
 * そのユーザーのデータを事前にロードする
 */
export const userResolver: ResolveFn<User | null> = (route: ActivatedRouteSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  console.log(`[userResolver] ユーザー #${id} のデータを解決中...`);

  return userService.getUserById(id).pipe(
    catchError((error) => {
      console.error('[userResolver] エラー:', error);
      // エラー時はホームにリダイレクト
      alert(`ユーザーID ${id} が見つかりませんでした`);
      router.navigate(['/']);
      return of(null);
    })
  );
};
