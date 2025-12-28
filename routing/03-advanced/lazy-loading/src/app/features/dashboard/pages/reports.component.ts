import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h3>レポート</h3>

      <p>生成されたレポートの一覧です。</p>

      <div class="reports-header">
        <button class="btn">新しいレポートを作成</button>
      </div>

      <div class="reports-list">
        @for (report of reports; track report.id) {
          <div class="report-card">
            <div class="report-icon">📄</div>
            <div class="report-content">
              <h4>{{ report.title }}</h4>
              <div class="report-meta">
                <span class="badge badge-primary">{{ report.type }}</span>
                <span class="report-date">{{ report.date }}</span>
              </div>
            </div>
            <div class="report-actions">
              <span class="badge" [ngClass]="report.status === '完了' ? 'badge-success' : 'badge-warning'">
                {{ report.status }}
              </span>
              <button class="btn btn-secondary">ダウンロード</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .reports-header {
      margin: 1.5rem 0;
    }

    .reports-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .report-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .report-icon {
      font-size: 2.5rem;
    }

    .report-content {
      flex: 1;
    }

    .report-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .report-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .report-date {
      color: #999;
      font-size: 0.9rem;
    }

    .report-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class ReportsComponent {
  reports: Report[] = [
    {
      id: 1,
      title: '月次パフォーマンスレポート',
      type: 'パフォーマンス',
      date: '2024年3月1日',
      status: '完了'
    },
    {
      id: 2,
      title: 'ユーザー行動分析',
      type: '分析',
      date: '2024年2月25日',
      status: '完了'
    },
    {
      id: 3,
      title: 'トラフィックレポート',
      type: 'トラフィック',
      date: '2024年2月20日',
      status: '完了'
    },
    {
      id: 4,
      title: 'コンバージョンレポート',
      type: 'コンバージョン',
      date: '2024年2月15日',
      status: '処理中'
    }
  ];
}
