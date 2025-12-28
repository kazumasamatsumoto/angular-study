import { ResolveFn } from '@angular/router';
import { delay, of } from 'rxjs';

/**
 * 遅いページResolver
 * 3秒の遅延をシミュレートして、ローディングインジケーターの動作を確認
 */
export const slowPageResolver: ResolveFn<string> = () => {
  console.log('[slowPageResolver] データを取得中... (3秒かかります)');
  return of('データ取得完了').pipe(
    delay(3000)
  );
};
