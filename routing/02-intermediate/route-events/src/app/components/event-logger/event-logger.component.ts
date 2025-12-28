import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigation-tracker.service';

@Component({
  selector: 'app-event-logger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>ナビゲーションイベントログ</h3>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ navigationTracker.stats().totalNavigations }}</div>
          <div class="stat-label">総ナビゲーション数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ navigationTracker.stats().successfulNavigations }}</div>
          <div class="stat-label">成功</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ navigationTracker.stats().canceledNavigations }}</div>
          <div class="stat-label">キャンセル</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ navigationTracker.stats().failedNavigations }}</div>
          <div class="stat-label">失敗</div>
        </div>
      </div>

      <div style="margin: 1rem 0;">
        <button class="btn btn-secondary" (click)="navigationTracker.clearEvents()">
          ログをクリア
        </button>
        <button class="btn btn-secondary" (click)="navigationTracker.resetStats()">
          統計をリセット
        </button>
      </div>

      <div class="event-log">
        @for (event of navigationTracker.events(); track event.time) {
          <div class="event-entry" [ngClass]="getEventClass(event.type)">
            <span class="event-time">{{ formatTime(event.time) }}</span>
            <span class="event-type" [ngClass]="getEventTypeClass(event.type)">
              {{ event.type }}
            </span>
            <span>{{ event.url }}</span>
            @if (event.message) {
              <span style="color: #e74c3c;"> - {{ event.message }}</span>
            }
          </div>
        } @empty {
          <div style="color: #95a5a6; text-align: center; padding: 2rem;">
            イベントログはありません。ページを移動してイベントを記録してください。
          </div>
        }
      </div>
    </div>
  `
})
export class EventLoggerComponent {
  navigationTracker = inject(NavigationTrackerService);

  getEventClass(type: string): string {
    return type.toLowerCase().replace('navigation', 'navigation-');
  }

  getEventTypeClass(type: string): string {
    if (type === 'NavigationStart') return 'start';
    if (type === 'NavigationEnd') return 'end';
    if (type === 'NavigationError') return 'error';
    if (type === 'NavigationCancel') return 'cancel';
    return '';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('ja-JP');
  }
}
