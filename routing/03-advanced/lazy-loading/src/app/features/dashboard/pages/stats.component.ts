import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>統計情報</h3>

      <p>詳細な統計データを表示します。</p>

      <div class="stats-section">
        <h4>月次レポート</h4>
        <div class="chart-placeholder">
          <p>📊 チャート表示エリア</p>
          <p style="font-size: 0.9rem; color: #666;">
            実際のプロジェクトでは、Chart.jsやD3.jsなどのライブラリを使用してグラフを表示します。
          </p>
        </div>
      </div>

      <div class="stats-section">
        <h4>トップページ</h4>
        <table>
          <thead>
            <tr>
              <th>ページ</th>
              <th>訪問数</th>
              <th>平均滞在時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/home</td>
              <td>5,234</td>
              <td>2:45</td>
            </tr>
            <tr>
              <td>/products</td>
              <td>3,891</td>
              <td>4:12</td>
            </tr>
            <tr>
              <td>/about</td>
              <td>2,456</td>
              <td>1:33</td>
            </tr>
            <tr>
              <td>/contact</td>
              <td>1,678</td>
              <td>2:08</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="stats-section">
        <h4>トラフィックソース</h4>
        <div class="grid">
          <div class="source-card">
            <h5>オーガニック検索</h5>
            <div class="source-percentage">45.2%</div>
            <div class="source-count">6,789 訪問</div>
          </div>
          <div class="source-card">
            <h5>ダイレクト</h5>
            <div class="source-percentage">28.7%</div>
            <div class="source-count">4,312 訪問</div>
          </div>
          <div class="source-card">
            <h5>ソーシャルメディア</h5>
            <div class="source-percentage">18.3%</div>
            <div class="source-count">2,749 訪問</div>
          </div>
          <div class="source-card">
            <h5>リファラル</h5>
            <div class="source-percentage">7.8%</div>
            <div class="source-count">1,172 訪問</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-section {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .stats-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1976d2;
    }

    .chart-placeholder {
      background: white;
      padding: 3rem;
      border-radius: 4px;
      text-align: center;
      border: 2px dashed #e0e0e0;
    }

    .chart-placeholder p:first-child {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background: white;
      font-weight: 600;
      color: #666;
    }

    tbody tr:hover {
      background: #f9f9f9;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .source-card {
      background: white;
      padding: 1.5rem;
      border-radius: 4px;
      text-align: center;
    }

    .source-card h5 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: normal;
    }

    .source-percentage {
      font-size: 1.75rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0.5rem 0;
    }

    .source-count {
      font-size: 0.875rem;
      color: #999;
    }
  `]
})
export class StatsComponent {}
