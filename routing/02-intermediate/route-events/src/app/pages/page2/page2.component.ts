import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>ページ2</h2>

      <div class="alert alert-success">
        NavigationEndイベント後、プログレスバーが100%になり、
        0.5秒後に非表示になります。
      </div>

      <h3>プログレスバーの実装</h3>
      <pre><code>// progress-bar.component.ts
&#64;Component({{ '{' }}
  template: \`
    &#64;if (navigationTracker.progress() > 0) {{ '{' }}
      &lt;div class="progress-bar-container"&gt;
        &lt;div
          class="progress-bar"
          [style.width.%]="navigationTracker.progress()"
        &gt;&lt;/div&gt;
      &lt;/div&gt;
    {{ '}' }}
  \`
{{ '}' }})
export class ProgressBarComponent {{ '{' }}
  navigationTracker = inject(NavigationTrackerService);
{{ '}' }}

// navigation-tracker.service.ts
this.router.events.pipe(
  filter(event =&gt; event instanceof NavigationStart)
).subscribe(() =&gt; {{ '{' }}
  this.progress.set(10);  // 開始時に10%
{{ '}' }});

this.router.events.pipe(
  filter(event =&gt; event instanceof NavigationEnd)
).subscribe(() =&gt; {{ '{' }}
  this.progress.set(100);  // 完了時に100%

  // 0.5秒後にリセット
  setTimeout(() =&gt; this.progress.set(0), 500);
{{ '}' }});
</code></pre>

      <h3>カスタマイズのアイデア</h3>
      <ul>
        <li>ガード実行時に進捗を更新（例: 30%）</li>
        <li>Resolver実行時に進捗を更新（例: 60%）</li>
        <li>コンポーネント読み込み時に進捗を更新（例: 90%）</li>
        <li>アニメーションの速度を調整</li>
      </ul>
    </div>
  `
})
export class Page2Component {}
