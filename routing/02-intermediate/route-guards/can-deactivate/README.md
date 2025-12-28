# CanDeactivate ルートガード - 未保存データの保護

## 概要

このプロジェクトは、Angularの`CanDeactivate`ガードを使用した、未保存の変更からユーザーを保護する実装例です。
フォームの編集中にページを離れようとした際に、確認ダイアログを表示してデータの損失を防ぎます。

## 主な機能

### 1. 変更検知
- フォームの変更をリアルタイムで検知
- フィールドごとの変更状態を視覚化
- 変更されたフィールドのサマリー表示

### 2. 離脱防止
- 未保存の変更がある場合、ページ遷移前に確認
- ユーザーの意図しないデータ損失を防止
- 保存後は自動的にガードを無効化

### 3. 視覚的フィードバック
- 未保存状態をインジケーターで表示
- 変更されたフィールドをハイライト
- 状態バッジで現在の状態を明示

## 実装のポイント

### 1. CanComponentDeactivateインターフェース

コンポーネントが実装すべきインターフェース：

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}
```

### 2. CanDeactivateガード

```typescript
export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> =
  (component) => {
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    return true;
  };
```

### 3. コンポーネントでの実装

```typescript
export class ArticleEditComponent implements CanComponentDeactivate {
  isDirty = signal(false);
  originalArticle: Article;
  article: Article;

  canDeactivate(): boolean {
    if (this.isDirty()) {
      return confirm('未保存の変更があります。本当に離れますか？');
    }
    return true;
  }

  save(): void {
    // 保存処理
    this.originalArticle = { ...this.article };
    this.isDirty.set(false);  // 保存後はクリーンな状態に
  }
}
```

### 4. ルート設定

```typescript
{
  path: 'edit/:id',
  component: ArticleEditComponent,
  canDeactivate: [canDeactivateGuard]
}
```

## ディレクトリ構造

```
src/app/
├── guards/
│   └── can-deactivate.guard.ts  # CanDeactivateガード
├── pages/
│   ├── home/                     # ホームページ
│   ├── article-edit/             # 記事編集（ガード有効）
│   ├── profile-edit/             # プロフィール編集（ガード有効）
│   └── settings/                 # 設定（ガード無効）
├── app.component.ts
└── app.routes.ts
```

## 実行方法

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm start
# または
ng serve --port 5202
```

ブラウザで `http://localhost:5202` を開く

### ビルド

```bash
npm run build
```

## 動作確認手順

### 基本的な動作

1. 「記事編集」または「プロフィール編集」ページに移動
2. フォームの任意の項目を変更
3. 保存せずにナビゲーションバーから別のページをクリック
4. → 確認ダイアログが表示される
5. 「キャンセル」を選択 → 現在のページに留まる
6. 「OK」を選択 → 変更を破棄してページ遷移

### 保存後の動作

1. フォームを変更
2. 「保存」ボタンをクリック
3. 別のページに移動
4. → 確認ダイアログは表示されない（保存済みのため）

### ガード無効ページの確認

1. 「設定」ページに移動
2. 他のページに移動
3. → ガードが適用されていないため、自由に遷移できる

## 重要なコンセプト

### CanDeactivate とは

- ルートを非アクティブ化（離脱）する前に実行されるガード
- `true`を返すと離脱を許可、`false`を返すと離脱を拒否
- フォームの未保存データを保護するのに最適

### 状態管理のベストプラクティス

```typescript
// 元データと編集中データを分離
originalArticle: Article;  // 保存済みの状態
article: Article;          // 編集中の状態

// 変更検知
isDirty = computed(() =>
  JSON.stringify(this.article) !== JSON.stringify(this.originalArticle)
);

// 保存時
save(): void {
  this.originalArticle = { ...this.article };
  this.isDirty.set(false);
}
```

### 確認ダイアログのカスタマイズ

基本的な`confirm()`の代わりに、カスタムモーダルを使用：

```typescript
canDeactivate(): Observable<boolean> {
  if (this.isDirty()) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '未保存の変更',
        message: '変更が保存されていません。本当に離れますか？',
        changes: this.getChangeSummary()
      }
    });
    return dialogRef.afterClosed();
  }
  return of(true);
}
```

## 演習問題

### 初級

1. **変更内容のプレビュー**
   - 確認ダイアログで変更されたフィールドを表示
   - ヒント: 元データと現在のデータを比較

2. **フィールドレベルの追跡**
   - 各フィールドの変更状態を個別に管理
   - ヒント: 各フィールドにcomputed signalを使用

### 中級

3. **カスタム確認ダイアログ**
   - browser confirmの代わりに独自のモーダルコンポーネントを作成
   - ヒント: Observableを返す

4. **自動保存機能**
   - 一定時間ごとに自動保存（ドラフト機能）
   - ヒント: RxJSのintervalとdebounceTimeを使用

### 上級

5. **変更履歴管理**
   - アンドゥ/リドゥ機能の実装
   - ヒント: 変更履歴をスタックで管理

6. **複雑なフォームのバリデーション**
   - 保存前にフォームの妥当性をチェック
   - エラーがある場合は保存を許可しない
   ```typescript
   canDeactivate(): boolean {
     if (this.isDirty()) {
       if (this.hasValidationErrors()) {
         alert('エラーを修正してから保存してください');
         return false;
       }
       return confirm('未保存の変更があります...');
     }
     return true;
   }
   ```

## 実務での応用例

### 1. リッチテキストエディタ

```typescript
export class BlogPostEditorComponent implements CanComponentDeactivate {
  editorContent = signal('');
  lastSavedContent = signal('');
  autoSaveInterval = 30000; // 30秒

  ngOnInit() {
    // 自動保存
    interval(this.autoSaveInterval)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.autoSave());
  }

  canDeactivate(): boolean {
    const hasChanges = this.editorContent() !== this.lastSavedContent();
    if (hasChanges) {
      return confirm('未保存の変更があります。自動保存されていない内容は失われます。');
    }
    return true;
  }
}
```

### 2. マルチステップフォーム

```typescript
export class MultiStepFormComponent implements CanComponentDeactivate {
  currentStep = signal(1);
  formData = signal<FormData>({});

  canDeactivate(): boolean {
    if (this.currentStep() < this.totalSteps) {
      return confirm(
        `ステップ${this.currentStep()}/${this.totalSteps}です。\n` +
        '最後まで完了していませんが、本当に離れますか？'
      );
    }
    return true;
  }
}
```

### 3. データグリッド編集

```typescript
export class DataGridComponent implements CanComponentDeactivate {
  editedRows = new Set<number>();

  canDeactivate(): boolean {
    if (this.editedRows.size > 0) {
      return confirm(
        `${this.editedRows.size}件の未保存の変更があります。\n` +
        '本当に離れますか？'
      );
    }
    return true;
  }
}
```

## トラブルシューティング

### ガードが機能しない

- コンポーネントが`CanComponentDeactivate`インターフェースを実装しているか確認
- `canDeactivate`メソッドが正しく実装されているか確認
- ルート設定で`canDeactivate: [canDeactivateGuard]`が指定されているか確認

### confirmダイアログが表示されない

- `isDirty`の状態が正しく管理されているか確認
- 保存時に`isDirty`を`false`にリセットしているか確認

### 保存後も確認が表示される

- 保存処理後に`isDirty.set(false)`が呼ばれているか確認
- `originalData`が更新されているか確認

## 参考リンク

- [Angular CanDeactivate Guard](https://angular.dev/api/router/CanDeactivate)
- [Route Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [Form Validation](https://angular.dev/guide/forms/reactive-forms)

## まとめ

このデモで学べること：

- ✅ CanDeactivateガードの基本的な使い方
- ✅ フォームの変更検知と状態管理
- ✅ ユーザーへの適切なフィードバック
- ✅ データ損失の防止パターン
- ✅ 実務で使える実装パターン

これらの知識は、ユーザーフレンドリーで安全なフォームアプリケーション開発に直接役立ちます。
