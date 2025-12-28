import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      @if (routeData) {
        <div class="page-header">
          <span class="page-icon">{{ routeData['icon'] }}</span>
          <div class="page-title-group">
            <h2>{{ routeData['title'] }}</h2>
            <p class="page-subtitle">{{ routeData['description'] }}</p>
          </div>
        </div>
      }

      <div class="alert alert-info">
        このページには、SEO用のメタデータ（showInSitemap、lastModified）が
        Route Dataに設定されています。
      </div>

      <p>
        当社は、最新のテクノロジーを活用したソリューションを提供しています。
        お客様のビジネスの成長をサポートすることが私たちの使命です。
      </p>

      <h3>会社情報</h3>
      <div class="metadata-box">
        <div class="metadata-item">
          <span class="metadata-label">会社名:</span>
          <span class="metadata-value">株式会社サンプル</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">設立:</span>
          <span class="metadata-value">2020年1月</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">所在地:</span>
          <span class="metadata-value">東京都渋谷区</span>
        </div>
      </div>

      <h3>SEO用メタデータ</h3>
      <p>
        Route Dataには、SEO対策用のカスタムメタデータも設定できます。
        これらの情報は、サイトマップ生成やメタタグ設定に利用できます。
      </p>

      <div class="metadata-box">
        <h4>現在のRoute Data</h4>
        @for (item of getRouteDataEntries(); track item.key) {
          <div class="metadata-item">
            <span class="metadata-label">{{ item.key }}:</span>
            <span class="metadata-value">{{ item.value }}</span>
          </div>
        }
      </div>

      <h3>カスタムメタデータの活用例</h3>
      <pre><code>// app.routes.ts
{{ '{' }}
  path: 'about',
  component: AboutComponent,
  data: {{ '{' }}
    title: '会社概要',
    showInSitemap: true,     // サイトマップに含める
    lastModified: '2024-01-15',  // 最終更新日
    priority: 0.8,           // サイトマップの優先度
    changeFreq: 'monthly'    // 更新頻度
  {{ '}' }}
{{ '}' }}
</code></pre>
    </div>
  `
})
export class AboutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  routeData: any;

  ngOnInit(): void {
    this.routeData = this.route.snapshot.data;
  }

  getRouteDataEntries(): { key: string; value: any }[] {
    return Object.entries(this.routeData).map(([key, value]) => ({
      key,
      value: JSON.stringify(value)
    }));
  }
}
