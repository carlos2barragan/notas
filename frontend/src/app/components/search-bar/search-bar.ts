import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
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
    .search-bar { padding: 0.5rem 0; }
    .search-input {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      &:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #6366f133; }
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  query = '';
}
