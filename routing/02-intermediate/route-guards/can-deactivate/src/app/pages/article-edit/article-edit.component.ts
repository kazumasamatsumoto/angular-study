import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
}

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>記事編集</h2>

      @if (isDirty()) {
        <div class="unsaved-indicator">
          未保存の変更があります
        </div>
      }

      <div class="status-badge" [ngClass]="isDirty() ? 'status-dirty' : 'status-pristine'">
        状態: {{ isDirty() ? '変更あり' : '変更なし' }}
      </div>

      <div class="alert alert-info">
        このフォームはCanDeactivateガードで保護されています。
        変更を加えた後、保存せずに別のページに移動しようとすると確認ダイアログが表示されます。
      </div>

      <form>
        <div class="form-group" [class.dirty]="titleChanged()">
          <label for="title">タイトル *</label>
          <input
            type="text"
            id="title"
            [(ngModel)]="article.title"
            name="title"
            (input)="markAsDirty()"
            placeholder="記事のタイトルを入力"
          >
          @if (titleChanged()) {
            <small style="color: #f093fb;">変更されました</small>
          }
        </div>

        <div class="form-group" [class.dirty]="categoryChanged()">
          <label for="category">カテゴリー</label>
          <select
            id="category"
            [(ngModel)]="article.category"
            name="category"
            (change)="markAsDirty()"
          >
            <option value="">選択してください</option>
            <option value="tech">技術</option>
            <option value="business">ビジネス</option>
            <option value="lifestyle">ライフスタイル</option>
            <option value="other">その他</option>
          </select>
          @if (categoryChanged()) {
            <small style="color: #f093fb;">変更されました</small>
          }
        </div>

        <div class="form-group" [class.dirty]="contentChanged()">
          <label for="content">本文 *</label>
          <textarea
            id="content"
            [(ngModel)]="article.content"
            name="content"
            (input)="markAsDirty()"
            placeholder="記事の本文を入力"
            rows="10"
          ></textarea>
          @if (contentChanged()) {
            <small style="color: #f093fb;">変更されました</small>
          }
        </div>

        <div class="form-group" [class.dirty]="tagsChanged()">
          <label for="tags">タグ（カンマ区切り）</label>
          <input
            type="text"
            id="tags"
            [(ngModel)]="article.tags"
            name="tags"
            (input)="markAsDirty()"
            placeholder="例: Angular, TypeScript, Web開発"
          >
          @if (tagsChanged()) {
            <small style="color: #f093fb;">変更されました</small>
          }
        </div>

        @if (isDirty()) {
          <div class="changes-summary">
            <h4>変更されたフィールド:</h4>
            <ul>
              @if (titleChanged()) { <li>タイトル</li> }
              @if (categoryChanged()) { <li>カテゴリー</li> }
              @if (contentChanged()) { <li>本文</li> }
              @if (tagsChanged()) { <li>タグ</li> }
            </ul>
          </div>
        }

        <div>
          <button
            type="button"
            class="btn btn-success"
            (click)="save()"
            [disabled]="!isDirty()"
          >
            保存
          </button>
          <button
            type="button"
            class="btn btn-danger"
            (click)="reset()"
            [disabled]="!isDirty()"
          >
            リセット
          </button>
        </div>
      </form>

      <h3 style="margin-top: 2rem;">ガードの動作確認</h3>
      <ol>
        <li>上記のフォームで任意の項目を変更してください</li>
        <li>ナビゲーションバーから別のページをクリックしてください</li>
        <li>確認ダイアログが表示されます</li>
        <li>「キャンセル」を選択すると、このページに留まります</li>
        <li>「OK」を選択すると、変更を破棄してページ遷移します</li>
        <li>または、「保存」ボタンをクリックすると、変更が保存され、自由にページ遷移できます</li>
      </ol>

      <h3>実装のポイント</h3>
      <pre><code>export class ArticleEditComponent implements CanComponentDeactivate {{ '{' }}
  isDirty = signal(false);
  originalArticle: Article = {{ '{' }} ... {{ '}' }};

  canDeactivate(): boolean {{ '{' }}
    if (this.isDirty()) {{ '{' }}
      return confirm('未保存の変更があります。本当に離れますか？');
    {{ '}' }}
    return true;
  {{ '}' }}

  markAsDirty(): void {{ '{' }}
    this.isDirty.set(true);
  {{ '}' }}

  save(): void {{ '{' }}
    // 保存処理
    this.isDirty.set(false);  // 保存後はクリーンな状態に
  {{ '}' }}
{{ '}' }}</code></pre>
    </div>
  `
})
export class ArticleEditComponent implements OnInit, CanComponentDeactivate {
  articleId = signal(0);
  isDirty = signal(false);

  // 元の記事データ
  originalArticle: Article = {
    id: 0,
    title: '',
    content: '',
    category: '',
    tags: ''
  };

  // 編集中の記事データ
  article: Article = {
    id: 0,
    title: '',
    content: '',
    category: '',
    tags: ''
  };

  // 各フィールドの変更検知
  titleChanged = computed(() => this.article.title !== this.originalArticle.title);
  categoryChanged = computed(() => this.article.category !== this.originalArticle.category);
  contentChanged = computed(() => this.article.content !== this.originalArticle.content);
  tagsChanged = computed(() => this.article.tags !== this.originalArticle.tags);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // ルートパラメータから記事IDを取得
    const id = this.route.snapshot.params['id'];
    this.articleId.set(+id);

    // デモ用の初期データを読み込み
    this.loadArticle(this.articleId());
  }

  loadArticle(id: number): void {
    // 実際のアプリケーションでは、APIから記事データを取得
    this.originalArticle = {
      id: id,
      title: `サンプル記事 #${id}`,
      content: 'これはサンプルの記事本文です。\n\nCanDeactivateガードのデモのために用意されました。\n\nこの内容を編集して、保存せずにページを離れようとすると、確認ダイアログが表示されます。',
      category: 'tech',
      tags: 'Angular, ルーティング, ガード'
    };

    // 編集用のコピーを作成
    this.article = { ...this.originalArticle };
  }

  markAsDirty(): void {
    this.isDirty.set(true);
  }

  save(): void {
    // 実際のアプリケーションでは、APIに保存
    console.log('記事を保存しました:', this.article);

    // 元のデータを更新
    this.originalArticle = { ...this.article };

    // クリーンな状態にリセット
    this.isDirty.set(false);

    alert('記事を保存しました！');
  }

  reset(): void {
    if (confirm('変更を破棄して元に戻しますか？')) {
      this.article = { ...this.originalArticle };
      this.isDirty.set(false);
    }
  }

  /**
   * CanDeactivateガードから呼び出されるメソッド
   * ページから離れる前に確認する
   */
  canDeactivate(): boolean {
    if (this.isDirty()) {
      return confirm(
        '未保存の変更があります。\n' +
        '保存せずにこのページを離れますか？\n\n' +
        '- OK: 変更を破棄して離れる\n' +
        '- キャンセル: このページに留まる'
      );
    }
    return true;
  }
}
