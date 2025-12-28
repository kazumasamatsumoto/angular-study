import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigation-tracker.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (navigationTracker.progress() > 0) {
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          [style.width.%]="navigationTracker.progress()"
        ></div>
      </div>
    }
  `
})
export class ProgressBarComponent {
  navigationTracker = inject(NavigationTrackerService);
}
