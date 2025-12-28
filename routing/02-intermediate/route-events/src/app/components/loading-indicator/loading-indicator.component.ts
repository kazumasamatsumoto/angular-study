import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigation-tracker.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (navigationTracker.isLoading()) {
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    }
  `
})
export class LoadingIndicatorComponent {
  navigationTracker = inject(NavigationTrackerService);
}
