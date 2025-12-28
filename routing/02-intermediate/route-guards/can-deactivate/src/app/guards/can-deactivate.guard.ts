import { CanDeactivateFn } from '@angular/router';

/**
 * 未保存の変更があるかどうかをチェックするインターフェース
 */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

/**
 * CanDeactivateガード
 * コンポーネントから離れる前に、未保存の変更があるかチェックし、
 * ある場合はユーザーに確認ダイアログを表示する
 */
export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // コンポーネントがcanDeactivateメソッドを実装している場合
  if (component.canDeactivate) {
    return component.canDeactivate();
  }

  // 実装していない場合は、離脱を許可
  return true;
};
