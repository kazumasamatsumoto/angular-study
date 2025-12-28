import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats">
      <h2>統計情報</h2>

      <div class="stats-grid">
        @for (stat of stats; track stat.label) {
          <div class="stat-card" [class.trend-up]="stat.trend === 'up'" [class.trend-down]="stat.trend === 'down'">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-content">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              @if (stat.trend !== 'neutral') {
                <div class="stat-trend" [class.positive]="stat.trend === 'up'" [class.negative]="stat.trend === 'down'">
                  <span class="trend-icon">{{ stat.trend === 'up' ? '↑' : '↓' }}</span>
                  <span class="trend-value">{{ stat.change }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="chart-section">
        <h3>アクセス推移</h3>
        <div class="chart">
          <div class="chart-bars">
            @for (bar of chartData; track $index) {
              <div class="bar-wrapper">
                <div class="bar" [style.height.%]="bar.value">
                  <span class="bar-label">{{ bar.value }}%</span>
                </div>
                <div class="bar-day">{{ bar.day }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>&#64;if ディレクティブ</h3>
        <p>
          このページでは Angular 18 の新しい <code>&#64;if</code> ディレクティブも使用しています。
        </p>

        <div class="code-example">
          <h4>従来の *ngIf</h4>
          <pre><code>&lt;div *ngIf="condition"&gt;
  表示する内容
&lt;/div&gt;</code></pre>

          <h4>新しい &#64;if</h4>
          <pre><code>&#64;if (condition) &#123;
  &lt;div&gt;表示する内容&lt;/div&gt;
&#125;</code></pre>

          <h4>&#64;if / &#64;else の例</h4>
          <pre><code>&#64;if (stat.trend !== 'neutral') &#123;
  &lt;div class="stat-trend"&gt;...&lt;/div&gt;
&#125; &#64;else &#123;
  &lt;div&gt;変化なし&lt;/div&gt;
&#125;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats {
      max-width: 1000px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-card.trend-up {
      border-left: 4px solid #4caf50;
    }

    .stat-card.trend-down {
      border-left: 4px solid #f44336;
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: #4caf50;
    }

    .stat-trend.negative {
      color: #f44336;
    }

    .trend-icon {
      font-size: 1rem;
    }

    .chart-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .chart-section h3 {
      color: #333;
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    .chart {
      background-color: white;
      padding: 1.5rem;
      border-radius: 6px;
      height: 250px;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      gap: 0.5rem;
    }

    .bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
    }

    .bar {
      width: 100%;
      background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      transition: all 0.3s;
    }

    .bar:hover {
      background: linear-gradient(180deg, #2196f3 0%, #1976d2 100%);
    }

    .bar-label {
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem;
    }

    .bar-day {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #666;
    }

    .info-section {
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 1.5rem;
      border-radius: 4px;
    }

    .info-section h3 {
      color: #2e7d32;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .info-section p {
      color: #333;
      margin-bottom: 0.75rem;
    }

    .code-example {
      margin-top: 1.5rem;
    }

    .code-example h4 {
      color: #2e7d32;
      margin-bottom: 0.5rem;
      margin-top: 1rem;
      font-size: 1rem;
    }

    pre {
      background-color: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsComponent {
  stats: StatItem[] = [
    {
      label: '総訪問者数',
      value: '12,458',
      icon: '👥',
      trend: 'up',
      change: '+12.5%'
    },
    {
      label: 'ページビュー',
      value: '45,281',
      icon: '📄',
      trend: 'up',
      change: '+8.3%'
    },
    {
      label: '平均滞在時間',
      value: '3m 24s',
      icon: '⏱️',
      trend: 'down',
      change: '-2.1%'
    },
    {
      label: '直帰率',
      value: '42.3%',
      icon: '📊',
      trend: 'down',
      change: '-5.7%'
    }
  ];

  chartData = [
    { day: '月', value: 65 },
    { day: '火', value: 78 },
    { day: '水', value: 92 },
    { day: '木', value: 85 },
    { day: '金', value: 95 },
    { day: '土', value: 72 },
    { day: '日', value: 58 }
  ];
}
