import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { User, UserService } from '../services/user.service';

/**
 * ユーザー一覧Resolver
 * すべてのユーザーデータを事前にロードする
 */
export const usersResolver: ResolveFn<User[]> = () => {
  const userService = inject(UserService);

  console.log('[usersResolver] ユーザー一覧のデータを解決中...');

  return userService.getUsers().pipe(
    catchError((error) => {
      console.error('[usersResolver] エラー:', error);
      // エラー時は空配列を返す
      return of([]);
    })
  );
};
