import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-wrap">
      <svg class="search-icon" viewBox="0 0 20 20" fill="none">
        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M13 13l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="search.emit($event)"
        placeholder="Buscar notas..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-wrap {
      position: relative;
      margin-bottom: 0.5rem;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 15px;
      height: 15px;
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.25rem;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.85rem;
      font-family: inherit;
      color: var(--text-primary);
      outline: none;
      transition: all 0.2s ease;

      &::placeholder { color: var(--text-muted); }
      &:focus {
        border-color: var(--border-hover);
        background: var(--surface-3);
        box-shadow: 0 0 0 3px var(--accent-glow);
      }
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  query = '';
}
